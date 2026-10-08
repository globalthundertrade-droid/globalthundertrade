import { getDb, saveDb } from '../server/db/cmsStorage.js';
import { handleAuthRoutes } from '../server/routes/authRoutes.js';
import { handleMediaRoutes } from '../server/routes/mediaRoutes.js';
import { handleProductRoutes } from '../server/routes/productRoutes.js';
import { handleBlogRoutes } from '../server/routes/blogRoutes.js';
import { handleContentRoutes } from '../server/routes/contentRoutes.js';
import { handleCalculatorRoutes } from '../server/routes/calculatorRoutes.js';
import { handleInquiryRoutes } from '../server/routes/inquiryRoutes.js';
import { handleReviewRoutes } from '../server/routes/reviewRoutes.js';
import { handleSeoRoutes, generateSitemapXml, generateRobotsTxt, syncSitemapFiles } from '../server/routes/seoRoutes.js';
import { testSupabaseConnection, syncLocalDbToSupabase, BUCKET_NAME } from '../server/db/supabaseBackend.js';

/**
 * Helper to parse request body across Vercel serverless and raw Node HTTP streams
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    // If body has already been parsed by Vercel serverless runtime
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        try {
          return resolve(JSON.parse(req.body));
        } catch {
          return resolve({});
        }
      }
      if (typeof req.body === 'object') {
        return resolve(req.body);
      }
    }

    // Otherwise, read stream
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 120 * 1024 * 1024) {
        reject(new Error('Payload too large (max 120MB)'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

/**
 * Universal Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Determine requested endpoint URL cleanly
  let url = req.url ? req.url.split('?')[0] : '/';
  const queryEndpoint = req.query?.endpoint || req.query?.slug || req.query?.path;

  if (queryEndpoint) {
    const slugStr = Array.isArray(queryEndpoint) ? queryEndpoint.join('/') : String(queryEndpoint);
    url = `/api/${slugStr.replace(/^\/+/, '')}`;
  } else if (req.headers['x-matched-path'] && req.headers['x-matched-path'].startsWith('/api')) {
    url = req.headers['x-matched-path'].split('?')[0];
  } else if (req.headers['x-vercel-matched-path'] && req.headers['x-vercel-matched-path'].startsWith('/api')) {
    url = req.headers['x-vercel-matched-path'].split('?')[0];
  }

  if (url === '/' || url === '/api' || url === '/api/') {
    url = '/api/health';
  }

  // Intercept sitemap and robots if routed to api
  if (url === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(generateSitemapXml(getDb()));
    return;
  }
  if (url === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(generateRobotsTxt(getDb()));
    return;
  }

  // Parse body for write operations
  let body = {};
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      body = await parseBody(req);
    } catch (err) {
      console.error('[Vercel API] Body parse error:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON request payload or payload too large.' }));
      return;
    }
  }

  try {
    // 1. GET /api/health — Health diagnostics
    if (req.method === 'GET' && url === '/api/health') {
      const currentDb = getDb();
      const destinationEmail = process.env.GTT_CONTACT_EMAIL || 'globalthundertrade@gmail.com';
      const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        version: '2.0.0',
        environment: 'vercel-serverless',
        destinationEmail,
        smtpConfigured: hasSmtp,
        productsCount: currentDb.products?.length || 0,
        blogsCount: currentDb.blogs?.length || 0,
        mediaCount: currentDb.media?.length || 0,
        inquiriesCount: currentDb.inquiries?.length || 0,
        adminUser: currentDb.users?.[0]?.email
      }));
      return;
    }

    // 2. GET /api/cms/all — Unified public CMS snapshot
    if (req.method === 'GET' && url === '/api/cms/all') {
      const currentDb = getDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        siteContent: currentDb.siteContent || {},
        products: (currentDb.products || []).filter(p => p.status === 'published'),
        blogs: (currentDb.blogs || []).filter(b => b.status === 'published'),
        categories: currentDb.categories || [],
        reviews: (currentDb.reviews || []).filter(r => r.status === 'published'),
        calculatorSettings: currentDb.calculatorSettings || {},
        seoSettings: currentDb.seoSettings || {}
      }));
      return;
    }

    // Route modules
    if (handleAuthRoutes(req, res, url, body)) return;
    if (handleMediaRoutes(req, res, url, body)) return;
    if (handleProductRoutes(req, res, url, body)) return;
    if (handleBlogRoutes(req, res, url, body)) return;
    if (handleContentRoutes(req, res, url, body)) return;
    if (handleCalculatorRoutes(req, res, url, body)) return;
    if (handleInquiryRoutes(req, res, url, body)) return;
    if (handleReviewRoutes(req, res, url, body)) return;
    if (handleSeoRoutes(req, res, url, body)) return;

    // 3. POST /api/supplier-application
    if (req.method === 'POST' && url === '/api/supplier-application') {
      body.type = 'supplier_application';
      if (handleInquiryRoutes(req, res, '/api/inquiries', body)) return;
    }

    // 4. POST /api/ai/generate
    if (req.method === 'POST' && url === '/api/ai/generate') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Concept generation model ready. Add GEMINI_API_KEY in .env for generative image rendering.',
        conceptImageUrl: null
      }));
      return;
    }

    // 5. GET /api/cms/supabase/status
    if (req.method === 'GET' && url === '/api/cms/supabase/status') {
      const status = await testSupabaseConnection();
      const supabaseUrl = process.env.SUPABASE_URL || 'https://mclxalvjcwlmyzyszspp.supabase.co';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        url: supabaseUrl,
        bucket: BUCKET_NAME,
        storageReady: true,
        databaseConnected: status.connected,
        databaseError: status.error || null,
        sqlEditorUrl: 'https://supabase.com/dashboard/project/mclxalvjcwlmyzyszspp/sql/new'
      }));
      return;
    }

    // 6. POST /api/cms/supabase/sync
    if (req.method === 'POST' && url === '/api/cms/supabase/sync') {
      const currentDb = getDb();
      const result = await syncLocalDbToSupabase(currentDb);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `API endpoint '${url}' not found.` }));
  } catch (handlerErr) {
    console.error('[Vercel API Handler] Unexpected error:', handlerErr);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error', details: handlerErr.message }));
  }
}

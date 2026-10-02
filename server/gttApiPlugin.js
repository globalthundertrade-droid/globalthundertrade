import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from './db/cmsStorage.js';
import { handleAuthRoutes } from './routes/authRoutes.js';
import { handleMediaRoutes } from './routes/mediaRoutes.js';
import { handleProductRoutes } from './routes/productRoutes.js';
import { handleBlogRoutes } from './routes/blogRoutes.js';
import { handleContentRoutes } from './routes/contentRoutes.js';
import { handleCalculatorRoutes } from './routes/calculatorRoutes.js';
import { handleInquiryRoutes } from './routes/inquiryRoutes.js';
import { handleReviewRoutes } from './routes/reviewRoutes.js';
import { handleSeoRoutes, generateSitemapXml, generateRobotsTxt } from './routes/seoRoutes.js';

/**
 * GTT BACKEND API VITE PLUGIN
 * 
 * Provides production-ready endpoints for:
 * 1. Admin Authentication & Session Management
 * 2. Media Library with upload, replace, and drag-and-drop support
 * 3. Products & Variants Management with Draft/Published toggling
 * 4. Blog CMS with Rich-Text editing and SEO fields
 * 5. Cost Calculator Pricing Engine
 * 6. Inquiries & Leads Inbox
 * 7. Reviews Management
 * 8. SEO Control Center & Dynamic Sitemaps
 * 9. Legacy /api/health and /api/supplier-application endpoints
 */
export function gttApiPlugin() {
  const setupMiddleware = (server) => {
    // Ensure initial DB is seeded
    const db = getDb();

    // Ensure sitemap.xml and robots.txt are current on startup
    try {
      const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
      const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
      fs.writeFileSync(sitemapPath, generateSitemapXml(db), 'utf8');
      fs.writeFileSync(robotsPath, generateRobotsTxt(db), 'utf8');
    } catch (e) {
      console.warn('[GTT Plugin] Warning syncing sitemap on startup:', e);
    }

    server.middlewares.use(async (req, res, next) => {
        // Intercept /sitemap.xml to serve dynamic content directly
        if (req.url === '/sitemap.xml') {
          res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
          res.end(generateSitemapXml(getDb()));
          return;
        }

        // Intercept /robots.txt
        if (req.url === '/robots.txt') {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(generateRobotsTxt(getDb()));
          return;
        }

        // Only handle /api/ routes
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        // Helper to parse JSON body
        const parseBody = () => new Promise((resolve, reject) => {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
            // 120MB limit for high-res images and HD video attachments
            if (body.length > 120 * 1024 * 1024) {
              reject(new Error('Payload too large (max 120MB)'));
            }
          });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (err) {
              reject(err);
            }
          });
          req.on('error', reject);
        });

        let body = {};
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          try {
            body = await parseBody();
          } catch (err) {
            console.error('[GTT API] Body parse error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON request payload or payload too large.' }));
            return;
          }
        }

        // 1. GET /api/health — Diagnostic status
        if (req.method === 'GET' && url === '/api/health') {
          const currentDb = getDb();
          const destinationEmail = process.env.GTT_CONTACT_EMAIL || 'globalthundertrade@gmail.com';
          const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'ok',
            version: '2.0.0',
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

        // 2. GET /api/cms/all — Public unified CMS snapshot
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

        // 3. POST /api/supplier-application (Legacy support redirecting to inquiry engine)
        if (req.method === 'POST' && url === '/api/supplier-application') {
          body.type = 'supplier_application';
          if (handleInquiryRoutes(req, res, '/api/inquiries', body)) return;
        }

        // 4. POST /api/ai/generate (transparent concept stub)
        if (req.method === 'POST' && url === '/api/ai/generate') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: "Concept generation model ready. Add GEMINI_API_KEY in .env for generative image rendering.",
            conceptImageUrl: null
          }));
          return;
        }

        // 404 for unrecognized API routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `API endpoint '${url}' not found.` }));
      });
  };

  return {
    name: 'gtt-api-plugin',
    configureServer: setupMiddleware,
    configurePreviewServer: setupMiddleware
  };
}

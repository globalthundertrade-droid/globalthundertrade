import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';
import { getSupabaseServerClient } from '../db/supabaseBackend.js';

export function generateSitemapXml(db) {
  const domain = db.seoSettings?.global?.canonicalDomain || 'https://globalthundertrade.com';
  const today = new Date().toISOString().split('T')[0];

  const corePages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.9', changefreq: 'monthly' },
    { url: '/products', priority: '0.9', changefreq: 'weekly' },
    { url: '/products/street-fashion', priority: '0.85', changefreq: 'weekly' },
    { url: '/products/leather-products', priority: '0.85', changefreq: 'weekly' },
    { url: '/products/medical-wear', priority: '0.85', changefreq: 'weekly' },
    { url: '/products/premium-blanks', priority: '0.85', changefreq: 'weekly' },
    { url: '/products/industrial-supplies', priority: '0.85', changefreq: 'weekly' },
    { url: '/side-products', priority: '0.8', changefreq: 'monthly' },
    { url: '/blanks', priority: '0.85', changefreq: 'weekly' },
    { url: '/cost-calculator', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/reviews', priority: '0.7', changefreq: 'monthly' },
    { url: '/be-a-supplier', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.85', changefreq: 'weekly' }
  ];

  const productPages = (db.products || [])
    .filter(p => p.status === 'published')
    .map(p => ({
      url: `/products/${p.category || 'street-fashion'}/${p.slug || p.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));

  const blogPages = (db.blogs || [])
    .filter(b => b.status === 'published')
    .map(b => ({
      url: `/blog/${b.slug || b.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));

  const allUrls = [...corePages, ...productPages, ...blogPages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${domain}${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

export function generateRobotsTxt(db) {
  const domain = db.seoSettings?.global?.canonicalDomain || 'https://globalthundertrade.com';
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;
}

export function handleSeoRoutes(req, res, url, body) {
  const db = getDb();

  // 1. GET /api/cms/seo — Get global & page SEO settings
  if (req.method === 'GET' && url === '/api/cms/seo') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      seo: db.seoSettings || {}
    }));
    return true;
  }

  // 2. PUT /api/cms/seo — Update SEO settings
  if (req.method === 'PUT' && url === '/api/cms/seo') {
    requireAuth(req, res, async () => {
      const { global, pages } = body || {};

      if (global) {
        db.seoSettings.global = {
          ...(db.seoSettings.global || {}),
          ...global
        };
      }

      if (pages) {
        db.seoSettings.pages = {
          ...(db.seoSettings.pages || {}),
          ...pages
        };
      }

      await saveDb(db);

      // Sync to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('seo_settings').upsert({
          id: 'default',
          global_seo: db.seoSettings.global || {},
          pages_seo: db.seoSettings.pages || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (e) {}

      // Auto sync sitemap & robots
      try {
        const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
        const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
        fs.writeFileSync(sitemapPath, generateSitemapXml(db), 'utf8');
        fs.writeFileSync(robotsPath, generateRobotsTxt(db), 'utf8');
      } catch (e) {
        console.warn('[CMS SEO] Error writing sitemap/robots file:', e);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'SEO settings and sitemap updated.',
        seo: db.seoSettings
      }));
    });
    return true;
  }

  // 3. POST /api/cms/seo/regenerate-sitemap — Explicit regenerate
  if (req.method === 'POST' && url === '/api/cms/seo/regenerate-sitemap') {
    requireAuth(req, res, () => {
      try {
        const sitemapXml = generateSitemapXml(db);
        const robotsTxt = generateRobotsTxt(db);

        const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
        const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');

        fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
        fs.writeFileSync(robotsPath, robotsTxt, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Sitemap.xml and robots.txt successfully synchronized with live database.',
          totalUrls: (db.products?.length || 0) + (db.blogs?.length || 0) + 16
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to write sitemap files.' }));
      }
    });
    return true;
  }

  return false;
}

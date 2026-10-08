import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';
import { getSupabaseServerClient } from '../db/supabaseBackend.js';
import { CATEGORIES } from '../../src/data/categoriesData.js';
import { PRODUCTS } from '../../src/data/productsData.js';
import { BLANK_PRODUCTS } from '../../src/data/blanksData.js';
import { SIDE_PRODUCTS } from '../../src/data/sideProductsData.js';
import { BLOG_POSTS } from '../../src/data/blogData.js';

/**
 * Compile all dynamic URLs across storefront, categories, products, blanks, side products, and blogs
 */
export function getSitemapData(db = getDb()) {
  const domain = (db?.seoSettings?.global?.canonicalDomain || 'https://globalthundertrade.com').replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];
  const pagesSeo = db?.seoSettings?.pages || {};

  const entries = [];
  const seenUrls = new Set();
  const stats = {
    core: 0,
    categories: 0,
    products: 0,
    blanks: 0,
    sideProducts: 0,
    blogs: 0,
    total: 0
  };

  const addUrl = (urlPath, priority, changefreq, section, lastmod = today) => {
    const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
    if (seenUrls.has(cleanPath)) return;

    // Check if explicitly set to index: false in SEO settings
    const pageKey = cleanPath === '/' ? 'home' : cleanPath.replace(/^\//, '').replace(/\//g, '-');
    if (pagesSeo[pageKey]?.index === false) return;

    seenUrls.add(cleanPath);
    entries.push({
      loc: `${domain}${cleanPath}`,
      path: cleanPath,
      lastmod: lastmod || today,
      changefreq,
      priority: typeof priority === 'number' ? priority.toFixed(2) : String(priority),
      section
    });

    if (stats[section] !== undefined) {
      stats[section]++;
    }
  };

  // 1. Core Primary Storefront Pages
  const coreList = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/services', priority: '0.9', changefreq: 'monthly' },
    { path: '/products', priority: '0.9', changefreq: 'weekly' },
    { path: '/side-products', priority: '0.85', changefreq: 'weekly' },
    { path: '/blanks', priority: '0.85', changefreq: 'weekly' },
    { path: '/cost-calculator', priority: '0.9', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/reviews', priority: '0.7', changefreq: 'monthly' },
    { path: '/be-a-supplier', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.85', changefreq: 'weekly' }
  ];
  coreList.forEach(item => addUrl(item.path, item.priority, item.changefreq, 'core'));

  // 2. Categories & Aliases
  const categoriesList = [...CATEGORIES];
  if (db?.categories && Array.isArray(db.categories)) {
    db.categories.forEach(c => {
      if (!categoriesList.some(ex => ex.slug === c.slug || ex.id === c.id)) {
        categoriesList.push(c);
      }
    });
  }

  categoriesList.forEach(c => {
    if (c.slug) addUrl(`/products/${c.slug}`, 0.85, 'weekly', 'categories');
    if (Array.isArray(c.aliases)) {
      c.aliases.forEach(alias => addUrl(`/products/${alias}`, 0.85, 'weekly', 'categories'));
    }
  });

  // 3. Products (CMS products + static fallback products)
  const allProducts = [];
  const productSlugs = new Set();

  (db?.products || []).forEach(p => {
    if (p.status !== 'draft') {
      const slug = p.slug || p.id;
      allProducts.push(p);
      productSlugs.add(slug);
    }
  });

  PRODUCTS.forEach(p => {
    const slug = p.slug || p.id;
    if (!productSlugs.has(slug)) {
      allProducts.push(p);
      productSlugs.add(slug);
    }
  });

  allProducts.forEach(p => {
    const cat = p.category || 'street-fashion';
    const slug = p.slug || p.id;
    const lastmod = p.updatedAt ? p.updatedAt.split('T')[0] : (p.createdAt ? p.createdAt.split('T')[0] : today);
    addUrl(`/products/${cat}/${slug}`, 0.8, 'monthly', 'products', lastmod);
  });

  // 4. Premium Blanks
  const allBlanks = [...BLANK_PRODUCTS];
  (db?.products || []).forEach(p => {
    if (p.status !== 'draft' && (p.isCustomBlank || p.category === 'premium-blanks' || p.category === 'blanks')) {
      if (!allBlanks.some(b => (b.slug || b.id) === (p.slug || p.id))) {
        allBlanks.push(p);
      }
    }
  });

  allBlanks.forEach(b => {
    const slug = b.slug || b.id;
    const lastmod = b.updatedAt ? b.updatedAt.split('T')[0] : today;
    addUrl(`/blanks/${slug}`, 0.8, 'weekly', 'blanks', lastmod);
  });

  // 5. Side Products & Hardware Trims
  const allSideProducts = [...SIDE_PRODUCTS];
  (db?.products || []).forEach(p => {
    if (p.status !== 'draft' && (p.category === 'side-products' || p.category === 'side')) {
      if (!allSideProducts.some(sp => (sp.slug || sp.id) === (p.slug || p.id))) {
        allSideProducts.push(p);
      }
    }
  });

  allSideProducts.forEach(sp => {
    const slug = sp.slug || sp.id;
    addUrl(`/side-products/${slug}`, 0.75, 'monthly', 'sideProducts', today);
  });

  // 6. Blogs (CMS blogs + static fallback blogs)
  const allBlogs = [];
  const blogSlugs = new Set();

  (db?.blogs || []).forEach(b => {
    if (b.status !== 'draft') {
      const slug = b.slug || b.id;
      if (!blogSlugs.has(slug)) {
        allBlogs.push(b);
        blogSlugs.add(slug);
      }
    }
  });

  BLOG_POSTS.forEach(b => {
    const slug = b.slug || b.id;
    if (!blogSlugs.has(slug)) {
      allBlogs.push(b);
      blogSlugs.add(slug);
    }
  });

  allBlogs.forEach(b => {
    const slug = b.slug || b.id;
    const lastmod = b.updatedAt ? b.updatedAt.split('T')[0] : (b.modifiedTime ? b.modifiedTime.split('T')[0] : (b.publishDate || today));
    addUrl(`/blog/${slug}`, 0.8, 'monthly', 'blogs', lastmod);
  });

  stats.total = entries.length;
  return { domain, today, entries, stats };
}

/**
 * Generate standard XML sitemap
 */
export function generateSitemapXml(db = getDb()) {
  const { entries } = getSitemapData(db);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(db = getDb()) {
  const domain = (db?.seoSettings?.global?.canonicalDomain || 'https://globalthundertrade.com').replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;
}

/**
 * Atomically synchronize public/sitemap.xml and public/robots.txt (and dist/ if present)
 */
export function syncSitemapFiles(db = getDb()) {
  try {
    const sitemapXml = generateSitemapXml(db);
    const robotsTxt = generateRobotsTxt(db);

    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    const robotsPath = path.join(publicDir, 'robots.txt');

    fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');

    // Also sync to dist/ if dist directory exists
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
      } catch (e) {
        // Non-blocking if dist not writeable
      }
    }

    const totalUrls = (sitemapXml.match(/<loc>/g) || []).length;
    console.log(`[SEO Sync] Dynamically synchronized ${totalUrls} live URLs to sitemap.xml & robots.txt.`);
    return { success: true, totalUrls };
  } catch (err) {
    console.error('[SEO Sync] Error writing sitemap/robots file:', err);
    return { success: false, error: err.message };
  }
}

/**
 * SEO API Route Handlers
 */
export function handleSeoRoutes(req, res, url, body) {
  const db = getDb();

  // 1. GET /api/cms/seo — Get global & page SEO settings + real-time sitemap stats
  if (req.method === 'GET' && url === '/api/cms/seo') {
    const { stats, domain, today } = getSitemapData(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      seo: db.seoSettings || {},
      sitemapStats: {
        ...stats,
        domain,
        lastSynced: today
      }
    }));
    return true;
  }

  // 2. PUT /api/cms/seo — Update SEO settings
  if (req.method === 'PUT' && url === '/api/cms/seo') {
    requireAuth(req, res, async () => {
      const { global, pages } = body || {};

      if (!db.seoSettings) {
        db.seoSettings = {};
      }

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
      const syncResult = syncSitemapFiles(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `SEO settings updated and ${syncResult.totalUrls || 'all'} sitemap URLs synchronized.`,
        seo: db.seoSettings,
        totalUrls: syncResult.totalUrls
      }));
    });
    return true;
  }

  // 3. POST /api/cms/seo/regenerate-sitemap — Explicit regenerate
  if (req.method === 'POST' && url === '/api/cms/seo/regenerate-sitemap') {
    requireAuth(req, res, () => {
      const syncResult = syncSitemapFiles(db);
      if (syncResult.success) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Sitemap.xml and robots.txt successfully synchronized with live database.',
          totalUrls: syncResult.totalUrls
        }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: syncResult.error || 'Failed to write sitemap files.' }));
      }
    });
    return true;
  }

  return false;
}

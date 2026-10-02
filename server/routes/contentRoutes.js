import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';
import { getSupabaseServerClient } from '../db/supabaseBackend.js';

export function handleContentRoutes(req, res, url, body) {
  const db = getDb();

  // 1. GET /api/cms/content — Get all site content
  if (req.method === 'GET' && url === '/api/cms/content') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      siteContent: db.siteContent || {}
    }));
    return true;
  }

  // 2. GET /api/cms/content/:page — Get content for specific page
  const pageMatch = url.match(/^\/api\/cms\/content\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && pageMatch) {
    const pageKey = pageMatch[1];
    const pageContent = db.siteContent?.[pageKey] || {};

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      page: pageKey,
      content: pageContent
    }));
    return true;
  }

function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source !== undefined ? source : target;
  }
  const result = Array.isArray(target) ? [...target] : { ...(target || {}) };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

  // 3. PUT /api/cms/content/:page — Update content for specific page
  if (req.method === 'PUT' && pageMatch) {
    requireAuth(req, res, async () => {
      const pageKey = pageMatch[1];
      const updates = body || {};

      if (!db.siteContent) {
        db.siteContent = {};
      }

      db.siteContent[pageKey] = deepMerge(db.siteContent[pageKey] || {}, updates);

      if (pageKey === 'homepage' || pageKey === 'home') {
        db.siteContent.homepage = deepMerge(db.siteContent.homepage || {}, updates);
        db.siteContent.home = db.siteContent.homepage;
        if (updates.categories && Array.isArray(db.categories)) {
          Object.entries(updates.categories).forEach(([slug, catData]) => {
            if (catData) {
              const cat = db.categories.find(c => c.slug === slug || c.id === slug);
              if (cat) {
                if (catData.image !== undefined) cat.image = catData.image;
                if (catData.video !== undefined) cat.video = catData.video;
                if (catData.mode !== undefined) cat.mode = catData.mode;
                if (catData.mobileMode !== undefined) cat.mobileMode = catData.mobileMode;
                if (catData.poster !== undefined) cat.poster = catData.poster;
              }
            }
          });
        }
      }

      await saveDb(db);

      // Sync to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('site_content').upsert({
          section_key: pageKey,
          content: db.siteContent[pageKey],
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });
      } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        page: pageKey,
        content: db.siteContent[pageKey]
      }));
    });
    return true;
  }

  return false;
}

import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';
import { uploadBufferToSupabase, getSupabaseServerClient } from '../db/supabaseBackend.js';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'media', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only serverless filesystems
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm', '.mov', '.jfif'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB (supports high-definition video assets)

/**
 * Format bytes into human readable format (KB, MB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Find all human-readable locations where a media asset is currently active on the site
 */
export function findMediaUsages(mediaUrl, db) {
  const usages = [];
  if (!mediaUrl || typeof mediaUrl !== 'string') return usages;
  const targetClean = mediaUrl.trim();

  // 1. Check siteContent
  if (db.siteContent) {
    const home = db.siteContent.homepage || db.siteContent.home || {};
    
    // Hero
    if (home.hero?.video === targetClean) usages.push('Homepage → Hero Video');
    if (home.hero?.image === targetClean) usages.push('Homepage → Hero Image');

    // Categories
    if (home.categories && typeof home.categories === 'object') {
      for (const [catSlug, catData] of Object.entries(home.categories)) {
        if (catData?.image === targetClean) usages.push(`Homepage → Categories (${catSlug} Image)`);
        if (catData?.video === targetClean) usages.push(`Homepage → Categories (${catSlug} Video)`);
      }
    }

    // Customization
    if (home.customization && typeof home.customization === 'object') {
      for (const [stgId, stgData] of Object.entries(home.customization)) {
        if (stgData?.image === targetClean) usages.push(`Homepage → Customization (${stgId})`);
        if (stgData?.video === targetClean) usages.push(`Homepage → Customization (${stgId} Video)`);
      }
    }

    // Details Matter
    if (home.detailsMatter && typeof home.detailsMatter === 'object') {
      for (const [itemId, itemData] of Object.entries(home.detailsMatter)) {
        if (itemData?.image === targetClean) usages.push(`Homepage → Details Matter (${itemId})`);
      }
    }

    // Final CTA
    if (home.finalCta?.image === targetClean) usages.push('Homepage → Final CTA (Image)');
    if (home.finalCta?.video === targetClean) usages.push('Homepage → Final CTA (Video)');

    // Services
    if (db.siteContent.services?.manufacturingImage?.image === targetClean || db.siteContent.services?.manufacturingImage === targetClean) {
      usages.push('Services → Manufacturing Pillar Image');
    }

    // About
    if (db.siteContent.about?.storyImage?.image === targetClean || db.siteContent.about?.storyImage === targetClean) {
      usages.push('About → Company Story Image');
    }
    if (db.siteContent.about?.factoryFloor?.image === targetClean || db.siteContent.about?.factoryFloor === targetClean) {
      usages.push('About → Factory Floor Image');
    }
  }

  // 2. Check categories
  if (Array.isArray(db.categories)) {
    db.categories.forEach(c => {
      if (c.image === targetClean) usages.push(`Category Division: ${c.title} (Image)`);
      if (c.video === targetClean) usages.push(`Category Division: ${c.title} (Video)`);
    });
  }

  // 3. Check products
  if (Array.isArray(db.products)) {
    db.products.forEach(p => {
      if (p.image === targetClean) usages.push(`Product: ${p.name} (Main Image)`);
      if (p.video === targetClean) usages.push(`Product: ${p.name} (Video)`);
      if (Array.isArray(p.gallery) && p.gallery.includes(targetClean)) {
        usages.push(`Product: ${p.name} (Gallery)`);
      }
      if (Array.isArray(p.variants)) {
        p.variants.forEach(v => {
          if (v.image === targetClean) usages.push(`Product: ${p.name} (Variant: ${v.colorName || 'Color'})`);
        });
      }
    });
  }

  // 4. Check blogs
  if (Array.isArray(db.blogs)) {
    db.blogs.forEach(b => {
      if (b.image === targetClean) usages.push(`Blog: ${b.title}`);
      if (b.video === targetClean || b.featuredVideo === targetClean) usages.push(`Blog: ${b.title} (Video)`);
    });
  }

  return [...new Set(usages)];
}

/**
 * Scan public directory to index all real assets
 */
export function scanAndSyncPublicMedia(db) {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) return db.media || [];

  const existingByUrl = new Map();
  (db.media || []).forEach(item => {
    if (item.url) existingByUrl.set(item.url, item);
  });

  const discoveredItems = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const relPath = fullPath.substring(publicDir.length).replace(/\\/g, '/');
          const webUrl = relPath.startsWith('/') ? relPath : `/${relPath}`;
          
          let stat;
          try {
            stat = fs.statSync(fullPath);
          } catch (e) {
            stat = { size: 0 };
          }

          const isVideo = VIDEO_EXTENSIONS.includes(ext);
          const existing = existingByUrl.get(webUrl);

          // Determine locationTag intelligently
          let locationTag = 'general';
          const lower = webUrl.toLowerCase();
          if (lower.includes('streetwear') || lower.includes('hero') || lower.includes('home') || lower.includes('categories')) {
            locationTag = 'homepage';
          } else if (lower.includes('the details matter') || lower.includes('the-details-matter')) {
            locationTag = 'the-details-matter';
          } else if (lower.includes('services')) {
            locationTag = 'services';
          } else if (lower.includes('blanks')) {
            locationTag = 'blanks';
          } else if (lower.includes('products')) {
            locationTag = 'products';
          } else if (lower.includes('about')) {
            locationTag = 'about';
          } else if (lower.includes('portfolio')) {
            locationTag = 'portfolio';
          } else if (lower.includes('uploads')) {
            locationTag = 'uploads';
          }

          const cleanBase = path.basename(entry.name, ext).replace(/[^a-zA-Z0-9_-]/g, ' ').trim();
          const friendlyAlt = cleanBase || `${locationTag} asset`;

          const item = {
            id: existing?.id || `med_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            url: webUrl,
            filename: entry.name,
            originalName: existing?.originalName || entry.name,
            extension: ext,
            type: isVideo ? 'video' : (ext === '.svg' ? 'vector' : 'image'),
            isVideo,
            sizeBytes: stat.size,
            sizeFormatted: formatBytes(stat.size),
            alt: existing?.alt || friendlyAlt,
            description: existing?.description || `GTT ${locationTag} asset (${entry.name})`,
            locationTag: existing?.locationTag || locationTag,
            createdAt: existing?.createdAt || new Date().toISOString(),
            updatedAt: existing?.updatedAt || new Date().toISOString(),
            associatedSlots: findMediaUsages(webUrl, db)
          };

          discoveredItems.push(item);
        }
      }
    }
  }

  walk(publicDir);

  // Sort: uploads and active assets first, then alphabetically by location
  discoveredItems.sort((a, b) => {
    if (a.associatedSlots?.length > 0 && (!b.associatedSlots || b.associatedSlots.length === 0)) return -1;
    if (b.associatedSlots?.length > 0 && (!a.associatedSlots || a.associatedSlots.length === 0)) return 1;
    return a.filename.localeCompare(b.filename);
  });

  db.media = discoveredItems;
  return db.media;
}

export function handleMediaRoutes(req, res, url, body) {
  const db = getDb();

  // 1. GET /api/cms/media — List media with live usage calculation
  if (req.method === 'GET' && url === '/api/cms/media') {
    // If media list is empty or sparse, sync from public/
    if (!db.media || db.media.length < 50) {
      scanAndSyncPublicMedia(db);
    } else {
      // Refresh active usage references
      db.media = (db.media || []).map(m => ({
        ...m,
        sizeFormatted: m.sizeFormatted || formatBytes(m.sizeBytes),
        associatedSlots: findMediaUsages(m.url, db)
      }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      total: db.media.length,
      media: db.media
    }));
    return true;
  }

  // 2. POST /api/cms/media/scan — Force re-scan of public/ folder
  if (req.method === 'POST' && url === '/api/cms/media/scan') {
    requireAuth(req, res, async () => {
      try {
        const synced = scanAndSyncPublicMedia(db);
        await saveDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          count: synced.length,
          media: synced,
          message: `Indexed ${synced.length} project media assets.`
        }));
      } catch (err) {
        console.error('[CMS Media Scan] Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to scan media directory.' }));
      }
    });
    return true;
  }

  // 3. POST /api/cms/media/upload — Upload media
  if (req.method === 'POST' && url === '/api/cms/media/upload') {
    requireAuth(req, res, async () => {
      try {
        const { dataUrl, filename, alt, description, locationTag } = body || {};

        if (!dataUrl || !filename) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Data URL and filename are required.' }));
          return;
        }

        const ext = path.extname(filename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: `Invalid file extension (${ext}). Allowed formats: JPG, JPEG, PNG, WEBP, SVG, MP4, WEBM, MOV.`
          }));
          return;
        }

        // Parse base64
        const matches = dataUrl.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid base64 data format.' }));
          return;
        }

        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        if (buffer.length > MAX_UPLOAD_SIZE) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File exceeds 100MB maximum allowed size.' }));
          return;
        }

        const isVideo = VIDEO_EXTENSIONS.includes(ext);
        const cleanBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
        const safeFilename = `${cleanBase}-${Date.now()}${ext}`;
        const targetFilePath = path.join(UPLOADS_DIR, safeFilename);

        try {
          fs.writeFileSync(targetFilePath, buffer);
        } catch (fsErr) {
          console.warn('[CMS Media Upload] Local disk write skipped (serverless environment):', fsErr.message);
        }

        const publicUrl = `/media/uploads/${safeFilename}`;
        const newMediaItem = {
          id: `med_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          url: publicUrl,
          filename: safeFilename,
          originalName: filename,
          extension: ext,
          mimeType,
          type: isVideo ? 'video' : (ext === '.svg' ? 'vector' : 'image'),
          isVideo,
          sizeBytes: buffer.length,
          sizeFormatted: formatBytes(buffer.length),
          alt: alt ? alt.trim() : cleanBase.replace(/[-_]/g, ' '),
          description: description ? description.trim() : (isVideo ? 'Uploaded Video Asset' : 'Uploaded Image Asset'),
          locationTag: locationTag || 'uploads',
          associatedSlots: [],
          createdAt: new Date().toISOString()
        };

        // Upload to Supabase Storage bucket
        try {
          const sbUpload = await uploadBufferToSupabase(safeFilename, buffer, mimeType);
          if (sbUpload.success) {
            newMediaItem.supabaseUrl = sbUpload.publicUrl;
            const client = getSupabaseServerClient();
            await client.from('media').upsert({
              id: newMediaItem.id,
              url: sbUpload.publicUrl,
              filename: safeFilename,
              extension: ext,
              type: newMediaItem.type,
              alt: newMediaItem.alt,
              description: newMediaItem.description,
              location_tag: newMediaItem.locationTag,
              created_at: newMediaItem.createdAt
            }, { onConflict: 'id' });
          }
        } catch (sbErr) {
          console.warn('[Supabase Media Upload] Sync notice:', sbErr.message);
        }

        db.media = [newMediaItem, ...(db.media || [])];
        await saveDb(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          media: newMediaItem
        }));
      } catch (err) {
        console.error('[CMS Media Upload] Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to save uploaded media.' }));
      }
    });
    return true;
  }

  // 4. POST /api/cms/media/replace — Replace an image slot across the entire site safely
  if (req.method === 'POST' && url === '/api/cms/media/replace') {
    requireAuth(req, res, async () => {
      try {
        const { targetOldUrl, newUrl, sectionKey, slotKey } = body || {};

        if (!newUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'newUrl is required.' }));
          return;
        }

        const isVideo = VIDEO_EXTENSIONS.includes(path.extname(newUrl).toLowerCase());

        // 1. Recursive deep update in siteContent for any matching old URL
        const updateNestedObject = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'string' && targetOldUrl && obj[key] === targetOldUrl) {
              obj[key] = newUrl;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              updateNestedObject(obj[key]);
            }
          }
        };

        if (targetOldUrl) {
          updateNestedObject(db.siteContent);
        }

        // 2. Specific section and slotKey handling (NEVER replace parent objects with strings)
        if (sectionKey && slotKey) {
          if (!db.siteContent) db.siteContent = {};
          if (!db.siteContent[sectionKey]) db.siteContent[sectionKey] = {};

          if (slotKey === 'hero') {
            if (!db.siteContent[sectionKey].hero || typeof db.siteContent[sectionKey].hero !== 'object') {
              db.siteContent[sectionKey].hero = {};
            }
            if (isVideo) {
              db.siteContent[sectionKey].hero.video = newUrl;
            } else {
              db.siteContent[sectionKey].hero.image = newUrl;
            }
          } else if (slotKey.startsWith('categories.')) {
            const catSlug = slotKey.split('.')[1];
            if (!db.siteContent[sectionKey].categories) db.siteContent[sectionKey].categories = {};
            if (!db.siteContent[sectionKey].categories[catSlug] || typeof db.siteContent[sectionKey].categories[catSlug] !== 'object') {
              db.siteContent[sectionKey].categories[catSlug] = {};
            }
            if (isVideo) {
              db.siteContent[sectionKey].categories[catSlug].video = newUrl;
            } else {
              db.siteContent[sectionKey].categories[catSlug].image = newUrl;
            }
          } else if (slotKey.startsWith('customization.')) {
            const stgId = slotKey.split('.')[1];
            if (!db.siteContent[sectionKey].customization) db.siteContent[sectionKey].customization = {};
            if (!db.siteContent[sectionKey].customization[stgId] || typeof db.siteContent[sectionKey].customization[stgId] !== 'object') {
              db.siteContent[sectionKey].customization[stgId] = {};
            }
            if (isVideo) {
              db.siteContent[sectionKey].customization[stgId].video = newUrl;
            } else {
              db.siteContent[sectionKey].customization[stgId].image = newUrl;
            }
          } else if (slotKey.startsWith('detailsMatter.')) {
            const itemId = slotKey.split('.')[1];
            if (!db.siteContent[sectionKey].detailsMatter) db.siteContent[sectionKey].detailsMatter = {};
            if (!db.siteContent[sectionKey].detailsMatter[itemId] || typeof db.siteContent[sectionKey].detailsMatter[itemId] !== 'object') {
              db.siteContent[sectionKey].detailsMatter[itemId] = {};
            }
            db.siteContent[sectionKey].detailsMatter[itemId].image = newUrl;
          } else if (slotKey.includes('.')) {
            const parts = slotKey.split('.');
            let curr = db.siteContent[sectionKey];
            for (let i = 0; i < parts.length - 1; i++) {
              if (!curr[parts[i]]) curr[parts[i]] = {};
              curr = curr[parts[i]];
            }
            const lastPart = parts[parts.length - 1];
            if (typeof curr[lastPart] === 'object' && curr[lastPart] !== null) {
              if (isVideo) curr[lastPart].video = newUrl;
              else curr[lastPart].image = newUrl;
            } else {
              curr[lastPart] = newUrl;
            }
          } else {
            const targetVal = db.siteContent[sectionKey][slotKey];
            if (typeof targetVal === 'object' && targetVal !== null) {
              if (isVideo) targetVal.video = newUrl;
              else targetVal.image = newUrl;
            } else {
              db.siteContent[sectionKey][slotKey] = newUrl;
            }
          }

          // Keep home and homepage aliases strictly in sync
          if (sectionKey === 'homepage') {
            db.siteContent.home = db.siteContent.homepage;
          } else if (sectionKey === 'home') {
            db.siteContent.homepage = db.siteContent.home;
          }
        }

        // 3. Update in categories array
        if (Array.isArray(db.categories)) {
          db.categories.forEach(c => {
            if (targetOldUrl && c.image === targetOldUrl) c.image = newUrl;
            if (targetOldUrl && c.video === targetOldUrl) c.video = newUrl;
            if (slotKey && slotKey.startsWith('categories.')) {
              const slug = slotKey.split('.')[1];
              if (c.slug === slug || c.id === slug) {
                if (isVideo) c.video = newUrl;
                else c.image = newUrl;
              }
            }
          });
        }

        // 4. Update in products
        if (targetOldUrl && Array.isArray(db.products)) {
          db.products.forEach(p => {
            if (p.image === targetOldUrl) p.image = newUrl;
            if (p.video === targetOldUrl) p.video = newUrl;
            if (p.media && typeof p.media === 'object') {
              if (p.media.image === targetOldUrl) p.media.image = newUrl;
              if (p.media.video === targetOldUrl) p.media.video = newUrl;
            }
            if (Array.isArray(p.gallery)) {
              p.gallery = p.gallery.map(img => img === targetOldUrl ? newUrl : img);
            }
            if (Array.isArray(p.variants)) {
              p.variants.forEach(v => {
                if (v.image === targetOldUrl) v.image = newUrl;
                if (v.video === targetOldUrl) v.video = newUrl;
              });
            }
          });
        }

        // 5. Update in blogs
        if (targetOldUrl && Array.isArray(db.blogs)) {
          db.blogs.forEach(b => {
            if (b.image === targetOldUrl) b.image = newUrl;
            if (b.video === targetOldUrl) b.video = newUrl;
            if (b.featuredVideo === targetOldUrl) b.featuredVideo = newUrl;
          });
        }

        // 6. Update reference in media registry
        if (targetOldUrl && Array.isArray(db.media)) {
          const oldMedia = db.media.find(m => m.url === targetOldUrl);
          if (oldMedia) {
            oldMedia.url = newUrl;
            oldMedia.updatedAt = new Date().toISOString();
          }
        }

        await saveDb(db);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Media reference successfully updated across website.',
          updatedUrl: newUrl
        }));
      } catch (err) {
        console.error('[CMS Media Replace] Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update media reference.' }));
      }
    });
    return true;
  }

  // 5. PUT /api/cms/media/:id — Update metadata
  const mediaIdMatch = url.match(/^\/api\/cms\/media\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'PUT' && mediaIdMatch) {
    requireAuth(req, res, async () => {
      const mediaId = mediaIdMatch[1];
      const item = (db.media || []).find(m => m.id === mediaId);
      if (!item) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Media not found.' }));
        return;
      }

      const { alt, description, locationTag } = body || {};
      if (alt !== undefined) item.alt = alt.trim();
      if (description !== undefined) item.description = description.trim();
      if (locationTag !== undefined) item.locationTag = locationTag.trim();
      item.updatedAt = new Date().toISOString();

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, media: item }));
    });
    return true;
  }

  // 6. DELETE /api/cms/media/:id — Delete media
  if (req.method === 'DELETE' && mediaIdMatch) {
    requireAuth(req, res, async () => {
      const mediaId = mediaIdMatch[1];
      const item = (db.media || []).find(m => m.id === mediaId);
      if (!item) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Media not found.' }));
        return;
      }

      // If it is in /media/uploads/, remove the physical file safely
      if (item.url && item.url.startsWith('/media/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', item.url);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }

      db.media = (db.media || []).filter(m => m.id !== mediaId);
      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Media removed.' }));
    });
    return true;
  }

  return false;
}

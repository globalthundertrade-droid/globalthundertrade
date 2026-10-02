import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth, extractToken, verifySessionToken } from '../auth.js';

export function handleProductRoutes(req, res, url, body) {
  const db = getDb();

  // Helper to check if requester is admin
  const isAdmin = () => {
    const token = extractToken(req);
    return token ? Boolean(verifySessionToken(token)) : false;
  };

  // 1. GET /api/cms/products — List products
  if (req.method === 'GET' && url.startsWith('/api/cms/products')) {
    const urlObj = new URL(req.url, 'http://localhost');
    const category = urlObj.searchParams.get('category');
    const status = urlObj.searchParams.get('status');
    const search = urlObj.searchParams.get('search');
    const admin = isAdmin();

    let list = db.products || [];

    // If not admin, only show published products
    if (!admin) {
      list = list.filter(p => p.status === 'published');
    } else if (status) {
      list = list.filter(p => p.status === status);
    }

    if (category) {
      const cleanCat = category.toLowerCase().trim();
      list = list.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        return pCat === cleanCat ||
               (cleanCat === 'street-fashion' && (pCat === 'streetwear' || pCat === 'fashion-wear')) ||
               (cleanCat === 'leather-products' && pCat === 'leather') ||
               (cleanCat === 'medical-wear' && pCat === 'medical') ||
               (cleanCat === 'premium-blanks' && pCat === 'blanks') ||
               (cleanCat === 'industrial-supplies' && pCat === 'industrial') ||
               (cleanCat === 'side-products' && pCat === 'side');
      });
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q))
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      total: list.length,
      products: list
    }));
    return true;
  }

  // 2. GET /api/cms/products/:id — Single product
  const singleMatch = url.match(/^\/api\/cms\/products\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && singleMatch) {
    const target = singleMatch[1];
    const product = (db.products || []).find(p => p.id === target || p.slug === target);

    if (!product) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found.' }));
      return true;
    }

    // Check published status if non-admin
    if (product.status !== 'published' && !isAdmin()) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found.' }));
      return true;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, product }));
    return true;
  }

  // 3. POST /api/cms/products — Create product
  if (req.method === 'POST' && url === '/api/cms/products') {
    requireAuth(req, res, async () => {
      const pData = body || {};

      if (!pData.name || !pData.name.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product name is required.' }));
        return;
      }

      const id = pData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const slug = pData.slug ? pData.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-') :
                   pData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');

      const newProduct = {
        id,
        slug,
        name: pData.name.trim(),
        type: pData.type || pData.name.trim(),
        category: pData.category || 'street-fashion',
        tagline: pData.tagline || '',
        description: pData.description || '',
        longDescription: pData.longDescription || pData.description || '',
        image: pData.image || '/media/products/streetwear-hoodies.jpg',
        gallery: Array.isArray(pData.gallery) ? pData.gallery : [pData.image || '/media/products/streetwear-hoodies.jpg'],
        gsm: pData.gsm || (Array.isArray(pData.gsmOptions) && pData.gsmOptions.length > 0 ? pData.gsmOptions.join(', ') : ''),
        fabric: pData.fabric || (Array.isArray(pData.fabrics) && pData.fabrics.length > 0 ? pData.fabrics.join(', ') : ''),
        fit: pData.fit || (Array.isArray(pData.fitOptions) && pData.fitOptions.length > 0 ? pData.fitOptions.join(', ') : ''),
        sampleMOQ: pData.sampleMOQ || pData.sampleMoq || '1–5 pcs for prototyping',
        bulkMOQ: pData.bulkMOQ || pData.bulkMoq || '25–50 pcs flexible starter batches',
        video: pData.video || '',
        mediaMode: pData.mediaMode || (pData.video ? 'hover_video' : 'image_only'),
        mobileMediaMode: pData.mobileMediaMode || 'image_only',
        fabrics: Array.isArray(pData.fabrics) && pData.fabrics.length > 0 ? pData.fabrics : (pData.fabric ? [pData.fabric] : []),
        gsmOptions: Array.isArray(pData.gsmOptions) && pData.gsmOptions.length > 0 ? pData.gsmOptions : (pData.gsm ? [pData.gsm] : []),
        fitOptions: Array.isArray(pData.fitOptions) && pData.fitOptions.length > 0 ? pData.fitOptions : (pData.fit ? [pData.fit] : []),
        colorOptions: Array.isArray(pData.colorOptions) ? pData.colorOptions : [],
        features: Array.isArray(pData.features) ? pData.features : [],
        customizationOptions: Array.isArray(pData.customizationOptions) ? pData.customizationOptions : [],
        sampleMoq: pData.sampleMOQ || pData.sampleMoq || '1–5 pcs for prototyping',
        bulkMoq: pData.bulkMOQ || pData.bulkMoq || '25–50 pcs flexible starter batches',
        moqNotice: pData.moqNotice || 'Flexible sampling & production tiers available.',
        status: pData.status === 'draft' ? 'draft' : 'published',
        variants: Array.isArray(pData.variants) ? pData.variants : [],
        sortOrder: (db.products?.length || 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.products = [newProduct, ...(db.products || [])];
      await saveDb(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: newProduct }));
    });
    return true;
  }

  // 4. PUT /api/cms/products/:id — Update product
  if (req.method === 'PUT' && singleMatch) {
    requireAuth(req, res, async () => {
      const targetId = singleMatch[1];
      const productIndex = (db.products || []).findIndex(p => p.id === targetId);

      if (productIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found.' }));
        return;
      }

      const current = db.products[productIndex];
      const updates = body || {};

      const updatedProduct = {
        ...current,
        ...updates,
        id: current.id, // Preserve ID
        updatedAt: new Date().toISOString()
      };

      db.products[productIndex] = updatedProduct;
      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: updatedProduct }));
    });
    return true;
  }

  // 5. POST /api/cms/products/:id/duplicate — Duplicate product
  const dupMatch = url.match(/^\/api\/cms\/products\/([a-zA-Z0-9_-]+)\/duplicate$/);
  if (req.method === 'POST' && dupMatch) {
    requireAuth(req, res, async () => {
      const sourceId = dupMatch[1];
      const source = (db.products || []).find(p => p.id === sourceId);

      if (!source) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found.' }));
        return;
      }

      const newId = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const duplicated = {
        ...source,
        id: newId,
        slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
        name: `${source.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.products = [duplicated, ...(db.products || [])];
      await saveDb(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: duplicated }));
    });
    return true;
  }

  // 6. PATCH /api/cms/products/:id/status — Toggle publish status
  const statusMatch = url.match(/^\/api\/cms\/products\/([a-zA-Z0-9_-]+)\/status$/);
  if (req.method === 'PATCH' && statusMatch) {
    requireAuth(req, res, async () => {
      const targetId = statusMatch[1];
      const product = (db.products || []).find(p => p.id === targetId);

      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found.' }));
        return;
      }

      const newStatus = body?.status === 'published' ? 'published' : 'draft';
      product.status = newStatus;
      product.updatedAt = new Date().toISOString();

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, status: newStatus }));
    });
    return true;
  }

  // 7. DELETE /api/cms/products/:id — Delete product
  if (req.method === 'DELETE' && singleMatch) {
    requireAuth(req, res, async () => {
      const targetId = singleMatch[1];
      const initialLen = (db.products || []).length;
      db.products = (db.products || []).filter(p => p.id !== targetId);

      if (db.products.length === initialLen) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found.' }));
        return;
      }

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Product deleted.' }));
    });
    return true;
  }

  return false;
}

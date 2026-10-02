import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth, extractToken, verifySessionToken } from '../auth.js';

export function handleReviewRoutes(req, res, url, body) {
  const db = getDb();

  const isAdmin = () => {
    const token = extractToken(req);
    return token ? Boolean(verifySessionToken(token)) : false;
  };

  // 1. GET /api/cms/reviews — List reviews
  if (req.method === 'GET' && url.startsWith('/api/cms/reviews')) {
    const admin = isAdmin();
    let list = db.reviews || [];

    if (!admin) {
      list = list.filter(r => r.status === 'published');
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      total: list.length,
      reviews: list
    }));
    return true;
  }

  // 2. POST /api/cms/reviews — Create review
  if (req.method === 'POST' && url === '/api/cms/reviews') {
    requireAuth(req, res, async () => {
      const { author, location, rating = 5, date, product, text, isGoogleReview = true, status = 'published' } = body || {};

      if (!author || !text) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Author and review text are required.' }));
        return;
      }

      const newReview = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        author: author.trim(),
        location: (location || 'Client').trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
        date: date || 'Verified Client Review',
        product: (product || 'Custom Apparel Manufacturing').trim(),
        text: text.trim(),
        isGoogleReview: Boolean(isGoogleReview),
        status: status === 'hidden' ? 'hidden' : 'published',
        createdAt: new Date().toISOString()
      };

      db.reviews = [newReview, ...(db.reviews || [])];
      await saveDb(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, review: newReview }));
    });
    return true;
  }

  // 3. PUT /api/cms/reviews/:id — Update review
  const reviewMatch = url.match(/^\/api\/cms\/reviews\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'PUT' && reviewMatch) {
    requireAuth(req, res, async () => {
      const reviewId = reviewMatch[1];
      const index = (db.reviews || []).findIndex(r => r.id === reviewId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Review not found.' }));
        return;
      }

      const current = db.reviews[index];
      const updates = body || {};

      db.reviews[index] = {
        ...current,
        ...updates,
        id: current.id,
        updatedAt: new Date().toISOString()
      };

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, review: db.reviews[index] }));
    });
    return true;
  }

  // 4. DELETE /api/cms/reviews/:id — Delete review
  if (req.method === 'DELETE' && reviewMatch) {
    requireAuth(req, res, async () => {
      const reviewId = reviewMatch[1];
      db.reviews = (db.reviews || []).filter(r => r.id !== reviewId);
      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Review deleted.' }));
    });
    return true;
  }

  return false;
}

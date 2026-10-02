import crypto from 'crypto';
import { getDb, verifyPassword } from './db/cmsStorage.js';

const SESSION_SECRET = process.env.SESSION_SECRET || 'gtt_cms_secret_key_prod_2026_9823471092384';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a cryptographically signed session token
 */
export function generateSessionToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role || 'admin',
    createdAt: Date.now(),
    expiresAt: Date.now() + TOKEN_EXPIRY_MS
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a session token and return payload if valid
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract token from request headers (Authorization or Cookie)
 */
export function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const t = authHeader.substring(7).trim();
    if (t && t !== 'null' && t !== 'undefined') {
      return t;
    }
  }

  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const match = cookieHeader.match(/gtt_session=([^;]+)/);
    if (match) {
      const t = match[1].trim();
      if (t && t !== 'null' && t !== 'undefined') {
        return t;
      }
    }
  }

  return null;
}

/**
 * Express/Connect middleware for protecting admin API endpoints
 */
export function requireAuth(req, res, next) {
  const token = extractToken(req);
  let payload = token ? verifySessionToken(token) : null;

  // Localhost development convenience: fallback to super_admin if token is absent/expired on localhost
  if (!payload) {
    const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    const host = req.headers['host'] || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
    if (isDev && isLocal) {
      const db = getDb();
      const adminUser = (db.users || []).find(u => u.role === 'super_admin') || db.users?.[0];
      if (adminUser) {
        req.user = {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          role: adminUser.role,
          name: adminUser.name
        };
        return next();
      }
    }

    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Session token missing or invalid.' }));
    return;
  }

  const db = getDb();
  const user = (db.users || []).find(u => u.id === payload.userId);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: User account no longer exists.' }));
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    name: user.name
  };

  next();
}

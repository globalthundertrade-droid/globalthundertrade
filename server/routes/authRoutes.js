import { getDb, saveDb, verifyPassword, hashPassword } from '../db/cmsStorage.js';
import { generateSessionToken, requireAuth } from '../auth.js';

export function handleAuthRoutes(req, res, url, body) {
  const db = getDb();

  // POST /api/auth/dev-login or /api/cms/auth/dev-login (Fast 1-click admin authentication)
  if (req.method === 'POST' && (url === '/api/auth/dev-login' || url === '/api/cms/auth/dev-login')) {
    const adminUser = (db.users || []).find(u => u.role === 'super_admin') || db.users?.[0];
    if (!adminUser) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No admin user configured.' }));
      return true;
    }
    const token = generateSessionToken(adminUser);
    res.setHeader('Set-Cookie', `gtt_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
        name: adminUser.name
      }
    }));
    return true;
  }

  // POST /api/auth/login or /api/cms/auth/login
  if (req.method === 'POST' && (url === '/api/auth/login' || url === '/api/cms/auth/login')) {
    const identifier = (body?.username || body?.email || '').trim().toLowerCase();
    const password = body?.password || '';

    if (!identifier || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Username or Email and password are required.' }));
      return true;
    }

    const user = (db.users || []).find(
      u => u.email.toLowerCase() === identifier || 
           u.username.toLowerCase() === identifier ||
           ((identifier === 'admin' || identifier === 'admin@globalthundertrade.com') && u.role === 'super_admin')
    );

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials.' }));
      return true;
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials.' }));
      return true;
    }

    const token = generateSessionToken(user);

    // Set secure cookie
    res.setHeader('Set-Cookie', `gtt_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name
      }
    }));
    return true;
  }

  // POST /api/auth/logout
  if (req.method === 'POST' && (url === '/api/auth/logout' || url === '/api/cms/auth/logout')) {
    res.setHeader('Set-Cookie', 'gtt_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
    return true;
  }

  // GET /api/auth/me or /api/cms/auth/me
  if (req.method === 'GET' && (url === '/api/auth/me' || url === '/api/cms/auth/me')) {
    requireAuth(req, res, () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        authenticated: true,
        user: req.user
      }));
    });
    return true;
  }

  // POST /api/auth/change-password
  if (req.method === 'POST' && url === '/api/auth/change-password') {
    requireAuth(req, res, async () => {
      const { currentPassword, newPassword } = body || {};
      if (!currentPassword || !newPassword || newPassword.length < 8) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'New password must be at least 8 characters long.' }));
        return;
      }

      const user = (db.users || []).find(u => u.id === req.user.id);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found.' }));
        return;
      }

      const isValid = verifyPassword(currentPassword, user.salt, user.passwordHash);
      if (!isValid) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Current password incorrect.' }));
        return;
      }

      const { salt, hash } = hashPassword(newPassword);
      user.salt = salt;
      user.passwordHash = hash;
      user.updatedAt = new Date().toISOString();

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Password updated successfully.' }));
    });
    return true;
  }

  return false;
}

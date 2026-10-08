import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth, extractToken, verifySessionToken } from '../auth.js';
import { getSupabaseServerClient } from '../db/supabaseBackend.js';
import { syncSitemapFiles } from './seoRoutes.js';

export function handleBlogRoutes(req, res, url, body) {
  const db = getDb();

  const isAdmin = () => {
    const token = extractToken(req);
    return token ? Boolean(verifySessionToken(token)) : false;
  };

  // 1. GET /api/cms/blogs — List blogs
  if (req.method === 'GET' && url.startsWith('/api/cms/blogs')) {
    const urlObj = new URL(req.url, 'http://localhost');
    const category = urlObj.searchParams.get('category');
    const status = urlObj.searchParams.get('status');
    const search = urlObj.searchParams.get('search');
    const admin = isAdmin();

    let list = db.blogs || [];

    if (!admin) {
      list = list.filter(b => b.status === 'published');
    } else if (status) {
      list = list.filter(b => b.status === status);
    }

    if (category && category !== 'All') {
      const cleanCat = category.toLowerCase().trim();
      list = list.filter(b => (b.category || '').toLowerCase() === cleanCat);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(b =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.metaDescription && b.metaDescription.toLowerCase().includes(q))
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      total: list.length,
      blogs: list
    }));
    return true;
  }

  // 2. GET /api/cms/blogs/:slug — Single blog
  const slugMatch = url.match(/^\/api\/cms\/blogs\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && slugMatch) {
    const target = slugMatch[1];
    const post = (db.blogs || []).find(b => b.slug === target || b.id === target);

    if (!post) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Article not found.' }));
      return true;
    }

    if (post.status !== 'published' && !isAdmin()) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Article not found.' }));
      return true;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, blog: post }));
    return true;
  }

  // 3. POST /api/cms/blogs — Create blog
  if (req.method === 'POST' && url === '/api/cms/blogs') {
    requireAuth(req, res, async () => {
      const bData = body || {};

      if (!bData.title || !bData.title.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Article title is required.' }));
        return;
      }

      const id = bData.id || `blog_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const slug = bData.slug ? bData.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-') :
                   bData.title.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');

      const newPost = {
        id,
        slug,
        title: bData.title.trim(),
        metaTitle: bData.metaTitle || `${bData.title.trim()} | Global Thunder Trade`,
        metaDescription: bData.metaDescription || bData.excerpt || '',
        primaryKeyword: bData.primaryKeyword || '',
        secondaryKeywords: Array.isArray(bData.secondaryKeywords) ? bData.secondaryKeywords : [],
        category: bData.category || 'Clothing Manufacturing',
        author: bData.author || 'GTT Technical Editorial Team',
        date: bData.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        publishedTime: bData.publishedTime || new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        readTime: bData.readTime || '6 min read',
        image: bData.image || '/media/home/idea-to-market/05-manufacturing.jpg',
        imageAlt: bData.imageAlt || bData.title.trim(),
        excerpt: bData.excerpt || '',
        shortAnswer: bData.shortAnswer || '',
        tableOfContents: Array.isArray(bData.tableOfContents) ? bData.tableOfContents : [],
        sections: Array.isArray(bData.sections) ? bData.sections : [],
        faqs: Array.isArray(bData.faqs) ? bData.faqs : [],
        contentHtml: bData.contentHtml || '',
        canonicalUrl: bData.canonicalUrl || `https://globalthundertrade.com/blog/${slug}`,
        ogTitle: bData.ogTitle || bData.metaTitle || bData.title.trim(),
        ogDescription: bData.ogDescription || bData.metaDescription || bData.excerpt || '',
        ogImage: bData.ogImage || bData.image || '/media/home/idea-to-market/05-manufacturing.jpg',
        status: bData.status === 'draft' ? 'draft' : 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.blogs = [newPost, ...(db.blogs || [])];
      await saveDb(db);

      // Sync to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('blogs').upsert({
          id: String(newPost.id),
          slug: newPost.slug || String(newPost.id),
          title: newPost.title || 'Untitled Blog',
          category: newPost.category || 'Industry',
          read_time: newPost.readTime || '5 min read',
          excerpt: newPost.excerpt || '',
          content: newPost.content || '',
          cover_image: newPost.coverImage || newPost.image || '',
          author: newPost.author || 'Global Thunder Trade Editorial',
          tags: newPost.tags || [],
          status: newPost.status || 'published',
          sort_order: parseInt(newPost.sortOrder, 10) || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (e) {
        console.warn('[Supabase Blog Create] Sync notice:', e.message);
      }

      // Auto-sync dynamic sitemap
      syncSitemapFiles(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, blog: newPost }));
    });
    return true;
  }

  // 4. PUT /api/cms/blogs/:id — Update blog
  if (req.method === 'PUT' && slugMatch) {
    requireAuth(req, res, async () => {
      const targetId = slugMatch[1];
      const blogIndex = (db.blogs || []).findIndex(b => b.id === targetId || b.slug === targetId);

      if (blogIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Article not found.' }));
        return;
      }

      const current = db.blogs[blogIndex];
      const updates = body || {};

      const updatedBlog = {
        ...current,
        ...updates,
        id: current.id,
        modifiedTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.blogs[blogIndex] = updatedBlog;
      await saveDb(db);

      // Sync to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('blogs').upsert({
          id: String(updatedBlog.id),
          slug: updatedBlog.slug || String(updatedBlog.id),
          title: updatedBlog.title || 'Untitled Blog',
          category: updatedBlog.category || 'Industry',
          read_time: updatedBlog.readTime || '5 min read',
          excerpt: updatedBlog.excerpt || '',
          content: updatedBlog.content || '',
          cover_image: updatedBlog.coverImage || updatedBlog.image || '',
          author: updatedBlog.author || 'Global Thunder Trade Editorial',
          tags: updatedBlog.tags || [],
          status: updatedBlog.status || 'published',
          sort_order: parseInt(updatedBlog.sortOrder, 10) || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (e) {
        console.warn('[Supabase Blog Update] Sync notice:', e.message);
      }

      // Auto-sync dynamic sitemap
      syncSitemapFiles(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, blog: updatedBlog }));
    });
    return true;
  }

  // 5. POST /api/cms/blogs/:id/duplicate — Duplicate blog
  const dupMatch = url.match(/^\/api\/cms\/blogs\/([a-zA-Z0-9_-]+)\/duplicate$/);
  if (req.method === 'POST' && dupMatch) {
    requireAuth(req, res, async () => {
      const sourceId = dupMatch[1];
      const source = (db.blogs || []).find(b => b.id === sourceId || b.slug === sourceId);

      if (!source) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Article not found.' }));
        return;
      }

      const newId = `blog_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const duplicated = {
        ...source,
        id: newId,
        slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
        title: `${source.title} (Draft Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.blogs = [duplicated, ...(db.blogs || [])];
      await saveDb(db);

      // Sync duplicate to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('blogs').upsert({
          id: String(duplicated.id),
          slug: duplicated.slug,
          title: duplicated.title,
          category: duplicated.category || 'Industry',
          read_time: duplicated.readTime || '5 min read',
          excerpt: duplicated.excerpt || '',
          content: duplicated.content || '',
          cover_image: duplicated.coverImage || '',
          author: duplicated.author || 'Global Thunder Trade Editorial',
          tags: duplicated.tags || [],
          status: 'draft',
          sort_order: parseInt(duplicated.sortOrder, 10) || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (e) {}

      // Auto-sync dynamic sitemap
      syncSitemapFiles(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, blog: duplicated }));
    });
    return true;
  }

  // 6. PATCH /api/cms/blogs/:id/status — Toggle publish status
  const statusMatch = url.match(/^\/api\/cms\/blogs\/([a-zA-Z0-9_-]+)\/status$/);
  if (req.method === 'PATCH' && statusMatch) {
    requireAuth(req, res, async () => {
      const targetId = statusMatch[1];
      const post = (db.blogs || []).find(b => b.id === targetId || b.slug === targetId);

      if (!post) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Article not found.' }));
        return;
      }

      const newStatus = body?.status === 'published' ? 'published' : 'draft';
      post.status = newStatus;
      post.updatedAt = new Date().toISOString();

      await saveDb(db);

      // Sync status to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('blogs').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', String(post.id));
      } catch (e) {}

      // Auto-sync dynamic sitemap
      syncSitemapFiles(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, status: newStatus }));
    });
    return true;
  }

  // 7. DELETE /api/cms/blogs/:id — Delete blog
  if (req.method === 'DELETE' && slugMatch) {
    requireAuth(req, res, async () => {
      const targetId = slugMatch[1];
      const initialLen = (db.blogs || []).length;
      const targetPost = (db.blogs || []).find(b => b.id === targetId || b.slug === targetId);
      db.blogs = (db.blogs || []).filter(b => b.id !== targetId && b.slug !== targetId);

      if (db.blogs.length === initialLen) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Article not found.' }));
        return;
      }

      await saveDb(db);

      // Sync delete to Supabase
      if (targetPost) {
        try {
          const client = getSupabaseServerClient();
          await client.from('blogs').delete().eq('id', String(targetPost.id));
        } catch (e) {}
      }

      // Auto-sync dynamic sitemap
      syncSitemapFiles(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Article deleted.' }));
    });
    return true;
  }

  return false;
}

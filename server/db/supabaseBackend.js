import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mclxalvjcwlmyzyszspp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_SECRET_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbHhhbHZqY3dsbXl6eXN6c3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDkxNjc2MCwiZXhwIjoyMTA2NDkyNzYwfQ.OTu69Exv5JfFEV9ABSOB6CF6xdUyaMiCBhtGEwtPSEg';

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'gtt-media';

let supabaseServerClient = null;

export function getSupabaseServerClient() {
  if (!supabaseServerClient) {
    supabaseServerClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabaseServerClient;
}

/**
 * Check if Supabase connection is healthy
 */
export async function testSupabaseConnection() {
  try {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from('inquiries').select('id').limit(1);
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true, data };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/**
 * Upload buffer directly to Supabase storage bucket
 */
export async function uploadBufferToSupabase(fileName, buffer, mimeType = 'image/jpeg') {
  try {
    const client = getSupabaseServerClient();
    const cleanPath = fileName.replace(/^\/+/, '');

    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .upload(cleanPath, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(cleanPath);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (err) {
    console.warn('[Supabase Backend] Storage upload error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Insert an inquiry into Supabase
 */
export async function insertInquiryToSupabase(inquiry) {
  try {
    const client = getSupabaseServerClient();
    const { data, error } = await client
      .from('inquiries')
      .upsert({
        id: inquiry.id,
        type: inquiry.type || 'contact',
        name: inquiry.data?.name || inquiry.data?.fullName || inquiry.data?.contactPerson || inquiry.name || '',
        email: inquiry.data?.email || inquiry.email || '',
        phone: inquiry.data?.phone || inquiry.phone || '',
        company: inquiry.data?.company || inquiry.data?.brandName || inquiry.company || '',
        country: inquiry.data?.country || inquiry.country || '',
        message: inquiry.data?.message || inquiry.data?.description || inquiry.message || '',
        quantity: parseInt(inquiry.data?.quantity || inquiry.quantity, 10) || null,
        timeline: inquiry.data?.timeline || inquiry.timeline || '',
        budget: inquiry.data?.budget || inquiry.budget || '',
        status: inquiry.status || 'unread',
        data: inquiry.data || inquiry,
        created_at: inquiry.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.warn('[Supabase Backend] insertInquiry error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sync entire local DB to Supabase
 */
export async function syncLocalDbToSupabase(localDb) {
  const client = getSupabaseServerClient();
  const summary = {
    products: 0,
    blogs: 0,
    reviews: 0,
    inquiries: 0,
    categories: 0,
    calculatorSettings: false,
    seoSettings: false,
    siteContent: 0,
    errors: []
  };

  try {
    // 1. Sync Inquiries
    if (localDb.inquiries && localDb.inquiries.length > 0) {
      const records = localDb.inquiries.map(inq => ({
        id: inq.id,
        type: inq.type || 'contact',
        name: inq.data?.name || inq.data?.fullName || inq.data?.contactPerson || inq.name || '',
        email: inq.data?.email || inq.email || '',
        phone: inq.data?.phone || inq.phone || '',
        company: inq.data?.company || inq.data?.brandName || inq.company || '',
        country: inq.data?.country || inq.country || '',
        message: inq.data?.message || inq.data?.description || inq.message || '',
        quantity: parseInt(inq.data?.quantity || inq.quantity, 10) || null,
        timeline: inq.data?.timeline || inq.timeline || '',
        budget: inq.data?.budget || inq.budget || '',
        status: inq.status || 'unread',
        data: inq.data || inq,
        created_at: inq.createdAt || new Date().toISOString()
      }));

      const { data, error } = await client.from('inquiries').upsert(records, { onConflict: 'id' });
      if (error) summary.errors.push(`Inquiries: ${error.message}`);
      else summary.inquiries = records.length;
    }

    // 2. Sync Products
    if (localDb.products && localDb.products.length > 0) {
      const records = localDb.products.map(p => ({
        id: String(p.id),
        slug: p.slug || String(p.id),
        title: p.title || p.name || 'Untitled Product',
        category: p.category || 'street-fashion',
        subcategory: p.subcategory || '',
        base_price: parseFloat(p.basePrice || p.price || 0),
        moq: parseInt(p.moq, 10) || 25,
        description: p.description || '',
        image: p.image || '',
        gallery: p.gallery || [],
        color_options: p.colorOptions || [],
        specs: p.specs || {},
        variants: p.variants || [],
        status: p.status || 'published',
        sort_order: parseInt(p.sortOrder, 10) || 0,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await client.from('products').upsert(records, { onConflict: 'id' });
      if (error) summary.errors.push(`Products: ${error.message}`);
      else summary.products = records.length;
    }

    // 3. Sync Categories
    if (localDb.categories && localDb.categories.length > 0) {
      const records = localDb.categories.map(c => ({
        id: c.id,
        slug: c.slug || c.id,
        title: c.title || c.name || c.id,
        sort_order: c.order || 0,
        image: c.image || null,
        video: c.video || null,
        mode: c.mode || 'interaction_video',
        mobile_mode: c.mobileMode || 'interaction_video'
      }));

      const { data, error } = await client.from('categories').upsert(records, { onConflict: 'id' });
      if (error) summary.errors.push(`Categories: ${error.message}`);
      else summary.categories = records.length;
    }

    // 4. Sync Blogs
    if (localDb.blogs && localDb.blogs.length > 0) {
      const records = localDb.blogs.map(b => ({
        id: String(b.id),
        slug: b.slug || String(b.id),
        title: b.title || 'Untitled Blog',
        category: b.category || 'Industry',
        read_time: b.readTime || '5 min read',
        excerpt: b.excerpt || '',
        content: b.content || '',
        cover_image: b.coverImage || b.image || '',
        author: b.author || 'Global Thunder Trade Editorial',
        tags: b.tags || [],
        status: b.status || 'published',
        sort_order: parseInt(b.sortOrder, 10) || 0,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await client.from('blogs').upsert(records, { onConflict: 'id' });
      if (error) summary.errors.push(`Blogs: ${error.message}`);
      else summary.blogs = records.length;
    }

    // 5. Sync Reviews
    if (localDb.reviews && localDb.reviews.length > 0) {
      const records = localDb.reviews.map(r => ({
        id: String(r.id),
        author: r.author || r.name || 'Anonymous',
        company: r.company || '',
        role: r.role || '',
        rating: parseInt(r.rating, 10) || 5,
        text: r.text || r.content || '',
        date: r.date || '',
        avatar: r.avatar || '',
        status: r.status || 'published',
        sort_order: parseInt(r.sortOrder, 10) || 0
      }));

      const { data, error } = await client.from('reviews').upsert(records, { onConflict: 'id' });
      if (error) summary.errors.push(`Reviews: ${error.message}`);
      else summary.reviews = records.length;
    }

    // 6. Sync Calculator Settings
    if (localDb.calculatorSettings) {
      const { error } = await client.from('calculator_settings').upsert({
        id: 'default',
        currency: localDb.calculatorSettings.currency || 'USD',
        min_moq: localDb.calculatorSettings.minMoq || 25,
        disclaimer: localDb.calculatorSettings.disclaimer || '',
        products: localDb.calculatorSettings.products || [],
        fabrics: localDb.calculatorSettings.fabrics || [],
        gsm_weights: localDb.calculatorSettings.gsmWeights || [],
        fits: localDb.calculatorSettings.fits || [],
        color_dyes: localDb.calculatorSettings.colorDyes || [],
        printing: localDb.calculatorSettings.printing || [],
        embroidery: localDb.calculatorSettings.embroidery || [],
        embellishments: localDb.calculatorSettings.embellishments || [],
        labels: localDb.calculatorSettings.labels || [],
        tags: localDb.calculatorSettings.tags || [],
        wash_finishing: localDb.calculatorSettings.washFinishing || [],
        packaging: localDb.calculatorSettings.packaging || [],
        quantity_breaks: localDb.calculatorSettings.quantityBreaks || [],
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) summary.errors.push(`Calculator Settings: ${error.message}`);
      else summary.calculatorSettings = true;
    }

    // 7. Sync SEO Settings
    if (localDb.seoSettings) {
      const { error } = await client.from('seo_settings').upsert({
        id: 'default',
        global_seo: localDb.seoSettings.global || {},
        pages_seo: localDb.seoSettings.pages || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) summary.errors.push(`SEO Settings: ${error.message}`);
      else summary.seoSettings = true;
    }

    // 8. Sync Site Content sections
    if (localDb.siteContent) {
      const entries = Object.entries(localDb.siteContent);
      let count = 0;
      for (const [sectionKey, content] of entries) {
        const { error } = await client.from('site_content').upsert({
          section_key: sectionKey,
          content: content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });
        if (!error) count++;
      }
      summary.siteContent = count;
    }

    return { success: summary.errors.length === 0, summary };
  } catch (err) {
    console.error('[Supabase Backend] Sync exception:', err);
    summary.errors.push(`General Exception: ${err.message}`);
    return { success: false, summary };
  }
}

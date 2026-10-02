import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mclxalvjcwlmyzyszspp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbHhhbHZqY3dsbXl6eXN6c3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MTY3NjAsImV4cCI6MjEwNjQ5Mjc2MH0.pdTWJb_8sIO4IcAgujap9EKGPA0K28yELO7amGMi4uM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const SUPABASE_STORAGE_BUCKET = 'gtt-media';

/**
 * Submit an inquiry/lead directly to Supabase
 * @param {Object} inquiryData 
 */
export async function submitInquiryToSupabase(inquiryData) {
  try {
    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          id,
          type: inquiryData.type || 'quote_request',
          name: inquiryData.name || inquiryData.fullName || inquiryData.contactPerson || '',
          email: inquiryData.email,
          phone: inquiryData.phone || '',
          company: inquiryData.company || inquiryData.brandName || '',
          country: inquiryData.country || '',
          message: inquiryData.message || inquiryData.description || '',
          quantity: parseInt(inquiryData.quantity, 10) || null,
          timeline: inquiryData.timeline || '',
          budget: inquiryData.budget || '',
          status: 'unread',
          data: inquiryData
        }
      ])
      .select();

    if (error) {
      console.warn('[Supabase Client] submitInquiryToSupabase error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('[Supabase Client] Exception in submitInquiryToSupabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch published products from Supabase
 */
export async function fetchProductsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { success: true, products: data || [] };
  } catch (err) {
    console.warn('[Supabase Client] fetchProducts error, falling back to local API:', err.message);
    return { success: false, error: err.message, products: null };
  }
}

/**
 * Fetch published blog posts from Supabase
 */
export async function fetchBlogsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { success: true, blogs: data || [] };
  } catch (err) {
    console.warn('[Supabase Client] fetchBlogs error:', err.message);
    return { success: false, error: err.message, blogs: null };
  }
}

/**
 * Fetch published reviews from Supabase
 */
export async function fetchReviewsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { success: true, reviews: data || [] };
  } catch (err) {
    console.warn('[Supabase Client] fetchReviews error:', err.message);
    return { success: false, error: err.message, reviews: null };
  }
}

/**
 * Upload file directly to Supabase Storage bucket
 * @param {File|Blob} file 
 * @param {string} destinationPath 
 */
export async function uploadToSupabaseStorage(file, destinationPath) {
  try {
    const cleanPath = destinationPath.replace(/^\/+/, '');
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(cleanPath, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(cleanPath);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (err) {
    console.error('[Supabase Client] Storage upload error:', err);
    return { success: false, error: err.message };
  }
}

-- =============================================================================
-- GLOBAL THUNDER TRADE — SUPABASE DATABASE SCHEMA
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INQUIRIES & SUBMISSIONS (Quotes, Contact, Samples, Product Ideas, Suppliers)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'contact', -- 'contact', 'quote_request', 'sample_request', 'product_idea', 'supplier_application'
    name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    country TEXT,
    message TEXT,
    quantity INTEGER,
    timeline TEXT,
    budget TEXT,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'in_review', 'quoted', 'archived'
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick inquiry filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON public.inquiries (type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

-- 2. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    base_price NUMERIC(10, 2) DEFAULT 0,
    moq INTEGER DEFAULT 25,
    description TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    color_options JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    image TEXT,
    video TEXT,
    mode TEXT DEFAULT 'interaction_video',
    mobile_mode TEXT DEFAULT 'interaction_video',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOGS & EDITORIAL JOURNAL
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author TEXT DEFAULT 'Global Thunder Trade Editorial',
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs (status);

-- 5. REVIEWS & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    company TEXT,
    role TEXT,
    rating INTEGER DEFAULT 5,
    text TEXT NOT NULL,
    date TEXT,
    avatar TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE CONTENT (Key-Value Section CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT PRIMARY KEY, -- e.g. 'homepage_hero', 'homepage_finalCta', 'services_hero', 'about_hero'
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COST CALCULATOR PRICING ENGINE SETTINGS
CREATE TABLE IF NOT EXISTS public.calculator_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    currency TEXT DEFAULT 'USD',
    min_moq INTEGER DEFAULT 25,
    disclaimer TEXT,
    products JSONB DEFAULT '[]'::jsonb,
    fabrics JSONB DEFAULT '[]'::jsonb,
    gsm_weights JSONB DEFAULT '[]'::jsonb,
    fits JSONB DEFAULT '[]'::jsonb,
    color_dyes JSONB DEFAULT '[]'::jsonb,
    printing JSONB DEFAULT '[]'::jsonb,
    embroidery JSONB DEFAULT '[]'::jsonb,
    embellishments JSONB DEFAULT '[]'::jsonb,
    labels JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    wash_finishing JSONB DEFAULT '[]'::jsonb,
    packaging JSONB DEFAULT '[]'::jsonb,
    quantity_breaks JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEO SETTINGS (Global and Page-level)
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    global_seo JSONB DEFAULT '{}'::jsonb,
    pages_seo JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MEDIA ASSET REGISTRY
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    type TEXT DEFAULT 'image', -- 'image' or 'video'
    alt TEXT,
    description TEXT,
    location_tag TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_url ON public.media (url);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 1. Inquiries: Anyone can insert (submit quote/contact), service_role has full control
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full inquiry access" ON public.inquiries;
CREATE POLICY "Service role has full inquiry access" ON public.inquiries
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Products: Public read published, service_role full control
DROP POLICY IF EXISTS "Public can read published products" ON public.products;
CREATE POLICY "Public can read published products" ON public.products
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Service role has full products access" ON public.products;
CREATE POLICY "Service role has full products access" ON public.products
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Categories: Public read, service_role full control
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories" ON public.categories
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role has full categories access" ON public.categories;
CREATE POLICY "Service role has full categories access" ON public.categories
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Blogs: Public read published, service_role full control
DROP POLICY IF EXISTS "Public can read published blogs" ON public.blogs;
CREATE POLICY "Public can read published blogs" ON public.blogs
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Service role has full blogs access" ON public.blogs;
CREATE POLICY "Service role has full blogs access" ON public.blogs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Reviews: Public read published, service_role full control
DROP POLICY IF EXISTS "Public can read published reviews" ON public.reviews;
CREATE POLICY "Public can read published reviews" ON public.reviews
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Service role has full reviews access" ON public.reviews;
CREATE POLICY "Service role has full reviews access" ON public.reviews
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Site Content: Public read, service_role full control
DROP POLICY IF EXISTS "Public can read site content" ON public.site_content;
CREATE POLICY "Public can read site content" ON public.site_content
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role has full site content access" ON public.site_content;
CREATE POLICY "Service role has full site content access" ON public.site_content
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. Calculator Settings: Public read, service_role full control
DROP POLICY IF EXISTS "Public can read calculator settings" ON public.calculator_settings;
CREATE POLICY "Public can read calculator settings" ON public.calculator_settings
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role has full calculator settings access" ON public.calculator_settings;
CREATE POLICY "Service role has full calculator settings access" ON public.calculator_settings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 8. SEO Settings: Public read, service_role full control
DROP POLICY IF EXISTS "Public can read seo settings" ON public.seo_settings;
CREATE POLICY "Public can read seo settings" ON public.seo_settings
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role has full seo settings access" ON public.seo_settings;
CREATE POLICY "Service role has full seo settings access" ON public.seo_settings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 9. Media: Public read, service_role full control
DROP POLICY IF EXISTS "Public can read media metadata" ON public.media;
CREATE POLICY "Public can read media metadata" ON public.media
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role has full media access" ON public.media;
CREATE POLICY "Service role has full media access" ON public.media
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

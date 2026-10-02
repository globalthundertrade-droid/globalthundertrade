import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Path constants
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'cms_db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// In-memory cache & write queue to prevent concurrent corruption
let inMemoryDb = null;
let isWriting = false;
const writeQueue = [];

/**
 * Hash password using scryptSync
 */
export function hashPassword(password, salt = null) {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, generatedSalt, 64);
  return {
    salt: generatedSalt,
    hash: derivedKey.toString('hex')
  };
}

/**
 * Verify password against salt and hash
 */
export function verifyPassword(password, salt, storedHash) {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (keyBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(keyBuffer, storedBuffer);
  } catch (err) {
    console.error('[CMS Auth] Verification error:', err);
    return false;
  }
}

/**
 * Generate initial default database state
 */
function createInitialDb() {
  const defaultAdminEmail = process.env.ADMIN_EMAIL || 'globalthundertrade@gmail.com';
  const defaultAdminPass = process.env.ADMIN_PASSWORD || 'd3v8l999';
  const { salt, hash } = hashPassword(defaultAdminPass);

  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    users: [
      {
        id: 'usr_admin_01',
        email: defaultAdminEmail,
        username: 'admin',
        role: 'super_admin',
        salt,
        passwordHash: hash,
        name: 'GTT Executive Admin',
        createdAt: new Date().toISOString()
      }
    ],
    // Pricing engine configuration for Cost Calculator
    calculatorSettings: {
      currency: 'USD',
      minMoq: 25,
      disclaimer: 'Final pricing may vary based on materials, customization, quantity, specifications, and final production requirements.',
      products: [
        { id: 'hoodie', name: 'Heavyweight Hoodie', baseCost: 16.50, category: 'Streetwear' },
        { id: 'tshirt', name: 'Vintage Boxy T-Shirt', baseCost: 7.20, category: 'Streetwear' },
        { id: 'sweatshirt', name: 'French Terry Sweatshirt', baseCost: 13.80, category: 'Streetwear' },
        { id: 'joggers', name: 'Relaxed Heavyweight Joggers', baseCost: 14.50, category: 'Streetwear' },
        { id: 'cargo-pants', name: 'Heavyweight Utility Cargo Pants', baseCost: 22.00, category: 'Streetwear' },
        { id: 'varsity-jacket', name: 'Leather-Sleeve Varsity Jacket', baseCost: 48.00, category: 'Outerwear' },
        { id: 'leather-jacket', name: 'Full-Grain Leather Moto Jacket', baseCost: 85.00, category: 'Leather' },
        { id: 'medical-scrubs', name: 'Technical Antimicrobial Scrubs (Set)', baseCost: 18.50, category: 'Medical' },
        { id: 'blank-hoodie', name: 'Premium Blank Hoodie', baseCost: 14.00, category: 'Blanks' },
        { id: 'blank-tee', name: 'Premium Blank Tee', baseCost: 6.50, category: 'Blanks' }
      ],
      fabrics: [
        { id: '100-combed-cotton', name: '100% Combed Ring-Spun Cotton', costModifier: 0.00 },
        { id: 'french-terry', name: 'Luxury Diagonal Loopback French Terry', costModifier: 1.50 },
        { id: 'brushed-fleece', name: 'Heavy Brushed Cotton Fleece', costModifier: 1.80 },
        { id: 'organic-cotton', name: '100% Certified Organic Cotton', costModifier: 2.20 },
        { id: 'cvc-blend', name: 'Durable CVC Cotton-Poly Blend', costModifier: -0.50 },
        { id: 'full-grain-leather', name: 'Premium Full-Grain Cowhide Leather', costModifier: 35.00 },
        { id: 'antimicrobial-poly', name: '4-Way Stretch Antimicrobial Blend', costModifier: 2.00 }
      ],
      gsmWeights: [
        { id: 'gsm-180', gsm: 180, label: '180 GSM (Lightweight Jersey)', costModifier: -0.80 },
        { id: 'gsm-240', gsm: 240, label: '240 GSM (Heavyweight Tee)', costModifier: 0.00 },
        { id: 'gsm-280', gsm: 280, label: '280 GSM (Ultra-Heavy Tee)', costModifier: 0.90 },
        { id: 'gsm-360', gsm: 360, label: '360 GSM (Mid-Weight Fleece/Terry)', costModifier: 0.00 },
        { id: 'gsm-420', gsm: 420, label: '420 GSM (Heavyweight Streetwear)', costModifier: 1.20 },
        { id: 'gsm-460', gsm: 460, label: '460 GSM (Luxury Dense Standard)', costModifier: 2.10 },
        { id: 'gsm-500', gsm: 500, label: '500 GSM (Ultra-Dense Boxy Armor)', costModifier: 3.20 }
      ],
      fits: [
        { id: 'oversized-boxy', name: 'Oversized Boxy Silhouette', costModifier: 0.50 },
        { id: 'drop-shoulder', name: 'Relaxed Drop-Shoulder Fit', costModifier: 0.00 },
        { id: 'regular-standard', name: 'Classic / Regular Fit', costModifier: 0.00 },
        { id: 'slim-tailored', name: 'Slim / Ergonomic Tailored', costModifier: 0.30 }
      ],
      colorDyes: [
        { id: 'standard-black-white', name: 'Standard Solid (Pitch Black / Optical White)', costModifier: 0.00 },
        { id: 'custom-pantone', name: 'Custom Pantone Color Dye', costModifier: 0.60 },
        { id: 'vintage-acid-wash', name: 'Vintage Acid / Mineral Sun-Bleach Wash', costModifier: 2.20 },
        { id: 'pigment-garment-dye', name: 'Pigment Garment Dye with Softening', costModifier: 1.80 }
      ],
      printing: [
        { id: 'print-none', name: 'None / Plain Blank', costModifier: 0.00 },
        { id: 'screen-print-1-2', name: 'Screen Print (1–2 Colors)', costModifier: 1.20 },
        { id: 'screen-print-multi', name: 'Screen Print (3+ Colors / Jumbo Oversized)', costModifier: 2.20 },
        { id: 'dtg-print', name: 'DTG (Direct-to-Garment High Detail)', costModifier: 3.50 },
        { id: 'dtf-print', name: 'High-Definition DTF Heat Transfer', costModifier: 2.50 },
        { id: 'puff-print', name: '3D High-Density Puff Screen Print', costModifier: 2.80 }
      ],
      embroidery: [
        { id: 'embroidery-none', name: 'None', costModifier: 0.00 },
        { id: 'flat-micro', name: 'Flat Satin Micro-Stitch (Small Chest/Cuff)', costModifier: 1.50 },
        { id: 'puff-3d', name: '3D Puff Embroidery (Center Chest / Hood)', costModifier: 2.80 },
        { id: 'chenille-patch', name: 'Tactile Chenille / Letterman Patch', costModifier: 4.20 },
        { id: 'chainstitch', name: 'Vintage Chainstitch Monogram', costModifier: 2.40 }
      ],
      embellishments: [
        { id: 'embellish-none', name: 'None', costModifier: 0.00 },
        { id: 'korean-rhinestones', name: 'Hotfix Precision Glass Rhinestones', costModifier: 3.20 },
        { id: 'metal-hardware', name: 'Custom Metal Eyelets, Aglets & Rivets', costModifier: 1.80 },
        { id: 'distressed-grinding', name: 'Distressed Raw Hem & Collar Grinding', costModifier: 1.40 }
      ],
      labels: [
        { id: 'label-gtt-standard', name: 'Standard Care Label', costModifier: 0.00 },
        { id: 'woven-neck-damask', name: 'High-Density Woven Neck Damask Label', costModifier: 0.70 },
        { id: 'clamp-hem-label', name: 'Woven Clamp Hem / Pocket Flag Label', costModifier: 0.50 },
        { id: 'heat-transfer-tagless', name: 'Heat Transfer Tagless Neck Stamp', costModifier: 0.40 }
      ],
      tags: [
        { id: 'tag-none', name: 'None', costModifier: 0.00 },
        { id: 'matte-hangtag', name: 'Custom 700 GSM Matte Black Hangtag with Cord', costModifier: 0.60 },
        { id: 'embossed-hangtag', name: 'Luxury Debossed Foil Cardstock with Safety Pin', costModifier: 0.95 }
      ],
      washFinishing: [
        { id: 'wash-standard', name: 'Standard Factory Pre-Shrunk Wash', costModifier: 0.00 },
        { id: 'wash-enzyme', name: 'Enzyme Silicone Softening Wash', costModifier: 0.85 },
        { id: 'wash-vintage-acid', name: 'Heavy Vintage Acid / Mineral Wash', costModifier: 1.95 }
      ],
      packaging: [
        { id: 'pack-standard-poly', name: 'Individual Clear Polybag', costModifier: 0.20 },
        { id: 'pack-frosted-ziplock', name: 'Custom Printed Frosted Ziplock Polybag', costModifier: 0.80 },
        { id: 'pack-gift-box', name: 'Luxury Rigid Presentation Retail Box', costModifier: 3.50 }
      ],
      // Quantity breaks with percentage discount or multiplier
      quantityBreaks: [
        { min: 1, max: 24, label: '1–24 pcs (Sample Batch)', multiplier: 1.45 },
        { min: 25, max: 49, label: '25–49 pcs (Starter Drop)', multiplier: 1.25 },
        { min: 50, max: 99, label: '50–99 pcs (Standard Run)', multiplier: 1.10 },
        { min: 100, max: 249, label: '100–249 pcs (Growth Tier)', multiplier: 1.00 },
        { min: 250, max: 499, label: '250–499 pcs (Volume Tier)', multiplier: 0.90 },
        { min: 500, max: 100000, label: '500+ pcs (Enterprise Scale)', multiplier: 0.82 }
      ]
    },
    // Global & page-level SEO settings
    seoSettings: {
      global: {
        siteTitle: 'Global Thunder Trade | Custom Apparel Manufacturing & Product Development',
        siteDescription: 'Global Thunder Trade is an end-to-end clothing manufacturer and product development partner for streetwear, fashion, leather goods, medical apparel, and blanks.',
        organizationName: 'Global Thunder Trade',
        logoUrl: '',
        defaultOgImage: '/media/home/hero/hero-poster.jpg',
        canonicalDomain: 'https://globalthundertrade.com',
        socialProfiles: [
          'https://instagram.com/globalthundertrade',
          'https://linkedin.com/company/global-thunder-trade'
        ],
        contactEmail: 'globalthundertrade@gmail.com',
        indexSite: true
      },
      pages: {
        home: {
          title: "Global Thunder Trade | Custom Apparel Manufacturing & Product Development",
          description: "From concept to bulk delivery: luxury heavyweight streetwear, cut-and-sew apparel, leather goods, medical wear, and premium blanks.",
          canonical: "https://globalthundertrade.com/",
          ogImage: "/media/home/hero/hero-poster.jpg",
          index: true
        },
        services: {
          title: "Apparel Manufacturing & Product Development Services | GTT",
          description: "End-to-end fashion development: garment engineering, fabric milling, sampling, bulk manufacturing, custom trims, content, and e-commerce.",
          canonical: "https://globalthundertrade.com/services",
          ogImage: "/media/services/01-manufacturing.jpg",
          index: true
        },
        products: {
          title: "Custom Apparel Catalog & Manufacturing Capabilities | GTT",
          description: "Browse Global Thunder Trade apparel manufacturing catalog across Streetwear, Leather, Medical Wear, Blanks, and Industrial Supplies.",
          canonical: "https://globalthundertrade.com/products",
          ogImage: "/media/categories/street-fashion.jpg",
          index: true
        },
        blanks: {
          title: "Heavyweight Wholesale Blank Apparel | GTT Premium Blanks",
          description: "Luxury 460 GSM blank hoodies, 280 GSM vintage tees, French terry crewnecks, and fleece sweatpants ready for brand custom relabeling.",
          canonical: "https://globalthundertrade.com/blanks",
          ogImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg",
          index: true
        },
        costCalculator: {
          title: "Clothing Manufacturing Cost Calculator | Global Thunder Trade",
          description: "Estimate your custom apparel production costs based on product silhouette, fabric composition, GSM weight, customization, and quantity.",
          canonical: "https://globalthundertrade.com/cost-calculator",
          ogImage: "/media/home/hero/hero-poster.jpg",
          index: true
        },
        about: {
          title: "About Global Thunder Trade | International Apparel Manufacturing Studio",
          description: "Discover Global Thunder Trade's master-craftsman heritage, high-volume production capabilities, and global client network.",
          canonical: "https://globalthundertrade.com/about",
          ogImage: "/media/home/idea-to-market/05-manufacturing.jpg",
          index: true
        },
        contact: {
          title: "Request a Quote & Contact Manufacturing Team | GTT",
          description: "Send your tech pack, mockup, or garment specifications to GTT. Direct factory pricing, transparent MOQs, and dedicated sampling support.",
          canonical: "https://globalthundertrade.com/contact",
          ogImage: "/media/homepage/homepage-cta.jpg",
          index: true
        },
        blog: {
          title: "The GTT Journal | Apparel Manufacturing Guides & Insights",
          description: "In-depth technical guides for clothing brands on fabric GSM, manufacturing terminology, sample evaluation, and production scaling.",
          canonical: "https://globalthundertrade.com/blog",
          ogImage: "/media/home/idea-to-market/05-manufacturing.jpg",
          index: true
        },
        beASupplier: {
          title: "Supplier & Partner Factory Application | Global Thunder Trade",
          description: "Apply to become a verified supplier, fabric mill, or production partner in the Global Thunder Trade international manufacturing network.",
          canonical: "https://globalthundertrade.com/be-a-supplier",
          ogImage: "/media/services/01-manufacturing.jpg",
          index: true
        },
        reviews: {
          title: "Verified Client Reviews & Testimonials | Global Thunder Trade",
          description: "Read authentic feedback from fashion founders, streetwear directors, and clothing brands producing with Global Thunder Trade.",
          canonical: "https://globalthundertrade.com/reviews",
          ogImage: "/media/home/hero/hero-poster.jpg",
          index: true
        }
      }
    },
    // Media registry (indexed from project)
    media: [],
    // Section-based content for all pages
    siteContent: {
      homepage: {
        hero: {
          eyebrow: "GLOBAL THUNDER TRADE — APPAREL MANUFACTURING · PRODUCT DEVELOPMENT",
          title1: "WE DON'T JUST",
          title2: "MANUFACTURE CLOTHES.",
          title3: "WE HELP BUILD BRANDS.",
          lead: "From your first product idea to sampling, cut-and-sew manufacturing, custom trims, brand-ready finishing, and final packaging — Global Thunder Trade helps clothing brands turn concepts into production-ready collections.",
          video: "/media/home/hero/hero-video.mp4",
          mode: "video_only",
          alt: "Master tailor drafting patterns and cutting luxury fabric in apparel atelier",
          tagline: "FROM IDEA → PRODUCT",
          primaryCtaText: "Start Your Production",
          primaryCtaLink: "/contact",
          secondaryCtaText: "Explore Our Work",
          secondaryCtaLink: "/products"
        },
        categories: {
          "street-fashion": {
            image: "/streetwear and fasion/image.jpg",
            video: "/streetwear and fasion/video.mp4",
            mode: "interaction_video",
            mobileMode: "interaction_video"
          },
          "leather-products": {
            image: "/leather products/image.jpg",
            video: "/leather products/video.mp4",
            mode: "interaction_video",
            mobileMode: "interaction_video"
          },
          "medical-wear": {
            image: "/medical/image.jpg",
            video: "/medical/video.mp4",
            mode: "interaction_video",
            mobileMode: "interaction_video"
          },
          "premium-blanks": {
            image: "/blanks/image.jpg",
            video: "/blanks/video.mp4",
            mode: "interaction_video",
            mobileMode: "interaction_video"
          },
          "industrial-supplies": {
            image: "/industrial supplies/image.jpg",
            video: "/industrial supplies/video.mp4",
            mode: "interaction_video",
            mobileMode: "interaction_video"
          }
        },
        customization: {
          "embroidery": { image: "/media/home/customization/01-embroidery.jpg", video: null, alt: "Industrial tactile embroidery" },
          "rhinestones": { image: "/media/home/customization/04-rhinestones.jpg", video: null, alt: "Precision glass crystal & hardware" },
          "screen-printing": { image: "/media/homepage/factory-preview-printing.jpg", video: null, alt: "High-density industrial screen printing" },
          "dtf-printing": { image: "/media/home/customization/02-dtf-printing.jpg", video: null, alt: "High-definition direct-to-film" },
          "dtg-printing": { image: "/media/home/customization/03-dtg-printing.jpg", video: null, alt: "Soft-hand direct-to-garment" },
          "custom-labels": { image: "/media/products/side-products/custom-labels.jpg", video: null, alt: "Woven damask & satin labels" },
          "custom-tags": { image: "/media/products/side-products/custom-tags.jpg", video: null, alt: "Bespoke debossed hangtags" },
          "washes-finishing": { image: "/media/manufacturing/06-customization-branding.jpg", video: null, alt: "Vintage washes & hand distressing" },
          "packaging": { image: "/media/home/customization/06-packaging.jpg", video: null, alt: "Retail-ready luxury packaging" }
        },
        detailsMatter: {
          "chains": { image: "/media/the-details-matter/chains.jpg", alt: "Chains - Industrial & Cuban Links" },
          "buckles": { image: "/media/the-details-matter/buckles.jpg", alt: "Buckles - Tactical & Magnetic Cast" },
          "zippers": { image: "/media/the-details-matter/zippers.jpg", alt: "Zippers - Precision YKK Systems" },
          "rhinestones": { image: "/media/the-details-matter/rhinestones.jpg", alt: "Rhinestones - Precision Glass Crystal" },
          "patches": { image: "/media/the-details-matter/patches.jpg", alt: "Patches - Chenille & 3D Embroidery" },
          "labels": { image: "/media/the-details-matter/labels.jpg", alt: "Labels - High-Density Woven Damask" }
        },
        internationalReach: {
          eyebrow: "INTERNATIONAL REACH",
          heading: "FROM OUR FACTORY TO BRANDS AROUND THE WORLD.",
          subheading: "Helping emerging streetwear labels and high-volume clothing brands turn ideas into market-ready products across key international territories."
        },
        finalCta: {
          eyebrow: "START PRODUCTION",
          heading: "READY TO BUILD YOUR NEXT DROP?",
          description: "Send us your tech pack, mockup, or reference garment. Our team will review your specifications, provide sampling guidance, and deliver transparent factory pricing.",
          image: "/media/homepage/homepage-cta.jpg",
          alt: "Finished apparel by Global Thunder Trade",
          buttonText: "Send Mockup & Get Quote",
          buttonLink: "/contact"
        }
      },
      services: {
        hero: {
          eyebrow: "END-TO-END APPAREL SERVICES",
          heading: "FROM CONCEPT TO RETAIL-READY COLLECTIONS.",
          subheading: "Full-package product development, cut-and-sew manufacturing, custom trims, editorial lookbooks, and conversion-engineered e-commerce."
        }
      },
      about: {
        hero: {
          eyebrow: "ABOUT GLOBAL THUNDER TRADE",
          heading: "ENGINEERING APPAREL FOR THE WORLD'S MOST AMBITIOUS BRANDS.",
          subheading: "Headquartered in Pakistan with global brand partners across the US, UK, Europe, Australia, and the Middle East."
        }
      }
    },
    // Dynamic products, variants, and blogs initialized below
    products: [],
    categories: [
      { id: 'street-fashion', slug: 'street-fashion', title: 'Street & Fashion', order: 1, image: '/streetwear and fasion/image.jpg', video: '/streetwear and fasion/video.mp4', mode: 'interaction_video', mobileMode: 'interaction_video' },
      { id: 'leather-products', slug: 'leather-products', title: 'Leather Products', order: 2, image: '/leather products/image.jpg', video: '/leather products/video.mp4', mode: 'interaction_video', mobileMode: 'interaction_video' },
      { id: 'medical-wear', slug: 'medical-wear', title: 'Medical Wear', order: 3, image: '/medical/image.jpg', video: '/medical/video.mp4', mode: 'interaction_video', mobileMode: 'interaction_video' },
      { id: 'premium-blanks', slug: 'premium-blanks', title: 'Premium Blanks', order: 4, image: '/blanks/image.jpg', video: '/blanks/video.mp4', mode: 'interaction_video', mobileMode: 'interaction_video' },
      { id: 'industrial-supplies', slug: 'industrial-supplies', title: 'Industrial Supplies', order: 5, image: '/industrial supplies/image.jpg', video: '/industrial supplies/video.mp4', mode: 'interaction_video', mobileMode: 'interaction_video' },
      { id: 'side-products', slug: 'side-products', title: 'Side Products', order: 6 }
    ],
    blogs: [],
    reviews: [],
    inquiries: []
  };
}

/**
 * Seed existing data into the database if empty or not present
 */
function seedExistingData(db) {
  try {
    // 1. Seed Products if empty
    if (!db.products || db.products.length === 0) {
      const productsDataPath = path.resolve(process.cwd(), 'src', 'data', 'productsData.js');
      if (fs.existsSync(productsDataPath)) {
        const fileContent = fs.readFileSync(productsDataPath, 'utf8');
        const match = fileContent.match(/export\s+const\s+PRODUCTS\s*=\s*(\[[\s\S]*?\]);\s*$/m);
        if (match) {
          try {
            const fn = new Function(`return ${match[1]};`);
            const loadedProducts = fn();
            db.products = loadedProducts.map((p, idx) => ({
              ...p,
              status: 'published',
              sortOrder: idx + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              variants: (p.colorOptions || []).map((colorName, cIdx) => ({
                id: `var_${p.id}_${cIdx}`,
                colorName,
                colorHex: colorName.toLowerCase().includes('black') ? '#111111' :
                          colorName.toLowerCase().includes('white') ? '#f4f4f4' :
                          colorName.toLowerCase().includes('grey') || colorName.toLowerCase().includes('charcoal') ? '#3a3a3a' :
                          colorName.toLowerCase().includes('olive') ? '#3d4533' :
                          colorName.toLowerCase().includes('navy') ? '#1a233a' : '#888888',
                image: p.gallery?.[cIdx] || p.image,
                sku: `${p.slug || p.id}-${colorName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`.slice(0, 30)
              }))
            }));
          } catch (e) {
            console.warn('[CMS Storage] Could not parse productsData.js:', e.message);
          }
        }
      }
    }

    // 2. Seed Blogs if empty
    if (!db.blogs || db.blogs.length === 0) {
      const blogDataPath = path.resolve(process.cwd(), 'src', 'data', 'blogData.js');
      if (fs.existsSync(blogDataPath)) {
        const fileContent = fs.readFileSync(blogDataPath, 'utf8');
        const match = fileContent.match(/export\s+const\s+BLOG_POSTS\s*=\s*(\[[\s\S]*?\]);\s*$/m);
        if (match) {
          try {
            const fn = new Function(`return ${match[1]};`);
            const loadedBlogs = fn();
            db.blogs = loadedBlogs.map((b, idx) => ({
              ...b,
              status: 'published',
              sortOrder: idx + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }));
          } catch (e) {
            console.warn('[CMS Storage] Could not parse blogData.js:', e.message);
          }
        }
      }
    }

    // 3. Seed Reviews if empty
    if (!db.reviews || db.reviews.length === 0) {
      const reviewsPath = path.resolve(process.cwd(), 'src', 'data', 'reviewsData.js');
      if (fs.existsSync(reviewsPath)) {
        const fileContent = fs.readFileSync(reviewsPath, 'utf8');
        const match = fileContent.match(/export\s+const\s+GOOGLE_REVIEWS\s*=\s*(\[[\s\S]*?\]);\s*$/m);
        if (match) {
          try {
            const fn = new Function(`return ${match[1]};`);
            const loadedReviews = fn();
            db.reviews = loadedReviews.map((r, idx) => ({
              ...r,
              status: 'published',
              sortOrder: idx + 1,
              createdAt: new Date().toISOString()
            }));
          } catch (e) {
            console.warn('[CMS Storage] Could not parse reviewsData.js:', e.message);
          }
        }
      }
    }

    // 4. Index Initial Media if empty
    if (!db.media || db.media.length === 0) {
      const mediaList = [];
      const mediaConfigPath = path.resolve(process.cwd(), 'src', 'data', 'mediaConfig.js');
      if (fs.existsSync(mediaConfigPath)) {
        const content = fs.readFileSync(mediaConfigPath, 'utf8');
        const urlMatches = content.matchAll(/["'](\/(?:media|images)\/[^"']+\.(?:jpg|jpeg|png|webp|svg|mp4))["']/g);
        const seenUrls = new Set();
        for (const m of urlMatches) {
          const url = m[1];
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            const filename = path.basename(url);
            const ext = path.extname(url).toLowerCase();
            const type = ext === '.mp4' ? 'video' : 'image';
            mediaList.push({
              id: `med_${Date.now()}_${mediaList.length}`,
              url,
              filename,
              extension: ext,
              type,
              alt: filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''),
              description: `Real GTT asset (${filename})`,
              locationTag: url.includes('/home/') ? 'homepage' :
                           url.includes('/services/') ? 'services' :
                           url.includes('/blanks/') ? 'blanks' :
                           url.includes('/products/') ? 'products' : 'general',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
      db.media = mediaList;
    }

    // 5. Seed existing inquiries from submissions directory
    if (!db.inquiries || db.inquiries.length === 0) {
      const submissionsDir = path.resolve(process.cwd(), 'submissions');
      if (fs.existsSync(submissionsDir)) {
        const walkSubmissions = (dir, type) => {
          if (!fs.existsSync(dir)) return;
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (f.endsWith('.json')) {
              try {
                const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
                db.inquiries.push({
                  id: rec.applicationId || rec.id || `inq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                  type: type,
                  status: 'unread',
                  createdAt: rec.timestamp || new Date().toISOString(),
                  data: rec
                });
              } catch (err) {}
            }
          }
        };
        walkSubmissions(path.join(submissionsDir, 'supplier-applications'), 'supplier_application');
        walkSubmissions(path.join(submissionsDir, 'product-ideas'), 'product_idea');
      }
    }
  } catch (err) {
    console.error('[CMS Storage] Seed error:', err);
  }
}

/**
 * Get the current database object
 */
export function getDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      inMemoryDb = JSON.parse(data);
      return inMemoryDb;
    } catch (err) {
      console.error('[CMS Storage] Error reading database file:', err);
    }
  }

  // Initialize brand new DB
  inMemoryDb = createInitialDb();
  seedExistingData(inMemoryDb);
  saveDbSync(inMemoryDb);
  return inMemoryDb;
}

/**
 * Save database state atomically (write to temp file then rename)
 */
export function saveDbSync(db) {
  db.lastUpdated = new Date().toISOString();
  inMemoryDb = db;
  const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[CMS Storage] Failed atomic database write:', err);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (e) {}
    }
    throw err;
  }
}

/**
 * Enqueued async save to prevent simultaneous write race conditions
 */
export async function saveDb(db) {
  return new Promise((resolve, reject) => {
    writeQueue.push({ db, resolve, reject });
    processWriteQueue();
  });
}

function processWriteQueue() {
  if (isWriting || writeQueue.length === 0) return;
  isWriting = true;
  const item = writeQueue.shift();

  try {
    saveDbSync(item.db);
    item.resolve(item.db);
  } catch (err) {
    item.reject(err);
  } finally {
    isWriting = false;
    if (writeQueue.length > 0) {
      process.nextTick(processWriteQueue);
    }
  }
}

/**
 * Create a timestamped backup of the database
 */
export function createBackup() {
  const currentDb = getDb();
  const backupFilename = `cms_backup_${Date.now()}.json`;
  const backupPath = path.join(BACKUPS_DIR, backupFilename);
  fs.writeFileSync(backupPath, JSON.stringify(currentDb, null, 2), 'utf8');

  const existingBackups = fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.startsWith('cms_backup_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (existingBackups.length > 15) {
    for (let i = 15; i < existingBackups.length; i++) {
      try {
        fs.unlinkSync(path.join(BACKUPS_DIR, existingBackups[i]));
      } catch (e) {}
    }
  }

  return { backupFilename, backupPath };
}

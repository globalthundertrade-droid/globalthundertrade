// ============================================================================
// GLOBAL THUNDER TRADE (GTT) — CENTRALIZED MEDIA CONFIGURATION
// ============================================================================
// Authentic commercial-use photography curated from verified sources.
// Every image is stored locally under /public/media/home/ with permanent
// high-resolution fallbacks and commercial-use license compliance.
// ============================================================================

// ----------------------------------------------------------------------------
// CENTRALIZED HOMEPAGE MEDIA (HOME_MEDIA)
// ----------------------------------------------------------------------------
export const HOME_MEDIA = {
  // 01 — HERO (Real apparel manufacturing & master tailor craftsmanship)
  hero: {
    video: "/media/home/hero/hero-video.mp4",
    poster: "/media/home/hero/hero-poster.jpg",
    fallbackImage: "/media/home/hero/hero-poster.jpg",
    alt: "GTT Industrial cut and sew apparel manufacturing facility",
    tagline: "FROM IDEA → PRODUCT",
    overlayOpacity: 0.15,
    source: "Authentic GTT Manufacturing Media"
  },

  // 02 — FROM IDEA TO MARKET (8 DISTINCT REAL STAGES)
  ideaToMarket: {
    "idea": {
      step: "01",
      phase: "CONCEPT",
      title: "IDEA",
      image: "/media/home/idea-to-market/01-idea.jpg",
      video: null,
      poster: "/media/home/idea-to-market/01-idea.jpg",
      fallbackImage: "/media/home/idea-to-market/01-idea.jpg",
      alt: "GTT Stage 01 - Idea & Concept Brief",
      source: "User supplied authentic photography"
    },
    "product-dev": {
      step: "02",
      phase: "ENGINEERING",
      title: "PRODUCT DEVELOPMENT",
      image: "/media/home/idea-to-market/02-product-development.jpg",
      video: null,
      poster: "/media/home/idea-to-market/02-product-development.jpg",
      fallbackImage: "/media/home/idea-to-market/02-product-development.jpg",
      alt: "GTT Stage 02 - Product Development & CAD Grading",
      source: "User supplied authentic photography"
    },
    "materials": {
      step: "03",
      phase: "FABRICATION",
      title: "MATERIAL & FABRIC",
      image: "/media/home/idea-to-market/03-material-and-fabric.jpg",
      video: null,
      poster: "/media/home/idea-to-market/03-material-and-fabric.jpg",
      fallbackImage: "/media/home/idea-to-market/03-material-and-fabric.jpg",
      alt: "GTT Stage 03 - Material & Fabric Milling",
      source: "User supplied authentic photography"
    },
    "sampling": {
      step: "04",
      phase: "PROTOTYPING",
      title: "SAMPLING",
      image: "/media/home/idea-to-market/04-sampling.jpg",
      video: null,
      poster: "/media/home/idea-to-market/04-sampling.jpg",
      fallbackImage: "/media/home/idea-to-market/04-sampling.jpg",
      alt: "GTT Stage 04 - Prototype Sampling & Refinement",
      source: "User supplied authentic photography"
    },
    "manufacturing": {
      step: "05",
      phase: "PRODUCTION",
      title: "MANUFACTURING",
      image: "/media/home/idea-to-market/05-manufacturing.jpg",
      video: null,
      poster: "/media/home/idea-to-market/05-manufacturing.jpg",
      fallbackImage: "/media/home/idea-to-market/05-manufacturing.jpg",
      alt: "GTT Stage 05 - Bulk Precision Manufacturing",
      source: "User supplied authentic photography"
    },
    "customization": {
      step: "06",
      phase: "BRANDING",
      title: "CUSTOMIZATION & BRANDING",
      image: "/media/home/idea-to-market/06-customization-and-branding.jpg",
      video: null,
      poster: "/media/home/idea-to-market/06-customization-and-branding.jpg",
      fallbackImage: "/media/home/idea-to-market/06-customization-and-branding.jpg",
      alt: "GTT Stage 06 - Customization & Brand Details",
      source: "User supplied authentic photography"
    },
    "digital": {
      step: "07",
      phase: "DIGITAL",
      title: "CONTENT & DIGITAL",
      image: "/media/home/idea-to-market/07-content-and-digital.jpg",
      video: null,
      poster: "/media/home/idea-to-market/07-content-and-digital.jpg",
      fallbackImage: "/media/home/idea-to-market/07-content-and-digital.jpg",
      alt: "GTT Stage 07 - Content & Digital Assets",
      source: "User supplied authentic photography"
    },
    "scale": {
      step: "08",
      phase: "EXPANSION",
      title: "LAUNCH & SCALE",
      image: "/media/home/idea-to-market/08-launch-and-scale.jpg",
      video: null,
      poster: "/media/home/idea-to-market/08-launch-and-scale.jpg",
      fallbackImage: "/media/home/idea-to-market/08-launch-and-scale.jpg",
      alt: "GTT Stage 08 - Global Launch & Scale Logistics",
      source: "User supplied authentic photography"
    }
  },

  // 03 — CATEGORIES (5 DISTINCT REAL PHOTOGRAPHS)
  categories: {
    "street-fashion": {
      id: "street-fashion",
      number: "01",
      title: "STREET & FASHION",
      image: "/streetwear and fasion/image.jpg",
      video: "/streetwear and fasion/video.mp4",
      fallbackImage: "/streetwear and fasion/image.jpg",
      alt: "Street & Fashion apparel collection",
      source: "User supplied authentic photography & video"
    },
    "leather-products": {
      id: "leather-products",
      number: "02",
      title: "LEATHER PRODUCTS",
      image: "/leather products/image.jpg",
      video: "/leather products/video.mp4",
      fallbackImage: "/leather products/image.jpg",
      alt: "Mastercrafted full-grain black leather biker motorcycle jacket with silver zippers",
      source: "User supplied authentic photography & video"
    },
    "medical-wear": {
      id: "medical-wear",
      number: "03",
      title: "MEDICAL WEAR",
      image: "/medical/image.jpg",
      video: "/medical/video.mp4",
      fallbackImage: "/medical/image.jpg",
      alt: "Technical medical scrubs and antimicrobial hospital wear",
      source: "User supplied authentic photography & video"
    },
    "premium-blanks": {
      id: "premium-blanks",
      number: "04",
      title: "PREMIUM BLANKS",
      image: "/blanks/image.jpg",
      video: "/blanks/video.mp4",
      fallbackImage: "/blanks/image.jpg",
      alt: "Premium wholesale blank apparel collection",
      source: "User supplied authentic photography & video"
    },
    "industrial-supplies": {
      id: "industrial-supplies",
      number: "05",
      title: "INDUSTRIAL SUPPLIES",
      image: "/industrial supplies/image.jpg",
      video: "/industrial supplies/video.mp4",
      fallbackImage: "/industrial supplies/image.jpg",
      alt: "Heavy-duty industrial supplies and protective workwear collection",
      source: "User supplied authentic photography & video"
    }
  },

  // 04 — BLANKS SECTION (4 DISTINCT REAL BLANK PHOTOGRAPHS)
  blanks: [
    {
      id: "blank-hoodie",
      name: "Heavyweight Boxy Blank Hoodie",
      gsm: "460 GSM (Configurable 380–500 GSM)",
      image: "/media/home/blanks/blank-hoodie.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
      alt: "Heavyweight boxy blank hoodie in pitch black",
      source: "Unsplash photo-1556905055-8f358a7a47b2"
    },
    {
      id: "blank-tee",
      name: "Vintage Drop-Shoulder Blank Tee",
      gsm: "280 GSM (Configurable 220–320 GSM)",
      image: "/media/home/blanks/blank-tee.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1000&q=85",
      alt: "Vintage drop shoulder blank t-shirt on wooden hanger",
      source: "Unsplash photo-1527719327859-c6ce80353573"
    },
    {
      id: "blank-sweatshirt",
      name: "Luxury French Terry Crewneck",
      gsm: "420 GSM (Configurable 360–480 GSM)",
      image: "/media/home/blanks/blank-sweatshirt.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      alt: "Luxury French terry blank crewneck sweatshirt",
      source: "Unsplash photo-1576566588028-4147f3842f27"
    },
    {
      id: "blank-sweatpants",
      name: "Baggy Fleece Sweat Pants",
      gsm: "440 GSM (Configurable 380–480 GSM)",
      image: "/media/home/blanks/blank-sweatpants.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=85",
      alt: "Baggy heavyweight fleece blank sweatpants",
      source: "Unsplash photo-1552902865-b72c031ac5ea"
    }
  ],

  // 05 — YOUR PRODUCT. YOUR RULES. (6 DISTINCT USER-SUPPLIED CUSTOMIZATION PHOTOGRAPHS)
  customization: {
    "embroidery": {
      id: "embroidery",
      category: "EMBROIDERY",
      image: "/media/home/customization/01-embroidery.jpg",
      video: null,
      poster: "/media/home/customization/01-embroidery.jpg",
      fallbackImage: "/media/home/customization/01-embroidery.jpg",
      alt: "Industrial tactile embroidery with micro-stitch fidelity - Global Thunder Trade",
      source: "User supplied authentic photography (INDUSTRIAL TACTILE EMBROIDERY.jfif)"
    },
    "dtf-printing": {
      id: "dtf-printing",
      category: "DTF PRINTING",
      image: "/media/home/customization/02-dtf-printing.jpg",
      video: null,
      poster: "/media/home/customization/02-dtf-printing.jpg",
      fallbackImage: "/media/home/customization/02-dtf-printing.jpg",
      alt: "High-definition direct-to-film heat transfer print - Global Thunder Trade",
      source: "User supplied authentic photography (HIGH-DEFINITION DIRECT-TO-FILM.jfif)"
    },
    "dtg-printing": {
      id: "dtg-printing",
      category: "DTG PRINTING",
      image: "/media/home/customization/03-dtg-printing.jpg",
      video: null,
      poster: "/media/home/customization/03-dtg-printing.jpg",
      fallbackImage: "/media/home/customization/03-dtg-printing.jpg",
      alt: "Soft-hand digital direct-to-garment pigment printing - Global Thunder Trade",
      source: "User supplied authentic photography (SOFT-HAND DIRECT-TO-GARMENT.jfif)"
    },
    "rhinestones": {
      id: "rhinestones",
      category: "RHINESTONES / EMBELLISHMENTS",
      image: "/media/home/customization/04-rhinestones.jpg",
      video: null,
      poster: "/media/home/customization/04-rhinestones.jpg",
      fallbackImage: "/media/home/customization/04-rhinestones.jpg",
      alt: "Precision Korean glass crystal rhinestones and hardware - Global Thunder Trade",
      source: "User supplied authentic photography (PRECISION GLASS CRYSTAL & HARDWARE.jfif)"
    },
    "labels-tags": {
      id: "labels-tags",
      category: "CUSTOM LABELS / TAGS",
      image: "/media/home/customization/05-labels-tags.jpg",
      video: null,
      poster: "/media/home/customization/05-labels-tags.jpg",
      fallbackImage: "/media/home/customization/05-labels-tags.jpg",
      alt: "Bespoke woven neck labels and luxury debossed hangtags - Global Thunder Trade",
      source: "User supplied authentic photography (BESPOKE BRANDING IDENTITY.jfif)"
    },
    "packaging": {
      id: "packaging",
      category: "CUSTOM PACKAGING",
      image: "/media/home/customization/06-packaging.jpg",
      video: null,
      poster: "/media/home/customization/06-packaging.jpg",
      fallbackImage: "/media/home/customization/06-packaging.jpg",
      alt: "Retail-ready luxury frosted ziplock and presentation packaging - Global Thunder Trade",
      source: "User supplied authentic photography (RETAIL-READY LUXURY PACKAGING.jfif)"
    }
  },

  // 06 — FACTORY FLOOR MINI-GRID
  factoryPreview: [
    { title: 'Pattern Cutting', img: '/media/homepage/factory-preview-cutting.jpg' },
    { title: 'Stitching', img: '/media/homepage/factory-preview-stitching.jpg' },
    { title: 'Printing Lab', img: '/media/homepage/factory-preview-printing.jpg' },
    { title: 'Embroidery', img: '/media/homepage/factory-preview-embroidery.jpg' },
    { title: 'Quality Control', img: '/media/homepage/factory-preview-qc.jpg' },
    { title: 'Custom Packaging', img: '/media/homepage/factory-preview-packaging.jpg' }
  ],

  // 07 — FINAL CTA
  finalCta: {
    image: '/media/homepage/homepage-cta.jpg',
    alt: 'Finished apparel by Global Thunder Trade'
  }
};

// ----------------------------------------------------------------------------
// BACKWARD-COMPATIBLE NAMED EXPORTS
// ----------------------------------------------------------------------------
export const HERO_MEDIA = HOME_MEDIA.hero;
export const MANUFACTURING_MEDIA = HOME_MEDIA.ideaToMarket;
export const CUSTOMIZATION_MEDIA = HOME_MEDIA.customization;
export const CATEGORIES_MEDIA = HOME_MEDIA.categories;

// ----------------------------------------------------------------------------
// SERVICES PILLARS MEDIA (Services Page)
// ----------------------------------------------------------------------------
export const SERVICES_MEDIA = {
  "manufacturing": {
    id: "manufacturing",
    number: "01",
    title: "PRODUCT DEVELOPMENT & MANUFACTURING",
    image: "/media/services/01-manufacturing.jpg",
    video: "/media/services/01-manufacturing.mp4",
    poster: "/media/services/01-manufacturing.jpg",
    fallbackImage: "/media/services/01-manufacturing.jpg",
    alt: "End-to-end garment engineering, textile milling, and bulk cut-and-sew manufacturing"
  },
  "content": {
    id: "content",
    number: "02",
    title: "CONTENT & PRODUCT PHOTOGRAPHY",
    image: "/media/services/02-photography.jpg",
    video: "/media/services/02-photography.mp4",
    poster: "/media/services/02-photography.jpg",
    fallbackImage: "/media/services/02-photography.jpg",
    alt: "Clean studio photography, macro fabric detail, and on-model editorial lookbooks"
  },
  "social-media": {
    id: "social-media",
    number: "03",
    title: "SOCIAL MEDIA & MARKETING",
    image: "/media/services/03-marketing.jpg",
    video: "/media/services/03-marketing.mp4",
    poster: "/media/services/03-marketing.jpg",
    fallbackImage: "/media/services/03-marketing.jpg",
    alt: "Instagram visual curation, drop calendars, and organic brand momentum"
  },
  "web-ecommerce": {
    id: "web-ecommerce",
    number: "04",
    title: "WEB & E-COMMERCE",
    image: "/media/services/04-web-ecommerce.jpg",
    video: "/media/services/04-web-ecommerce.mp4",
    poster: "/media/services/04-web-ecommerce.jpg",
    fallbackImage: "/media/services/04-web-ecommerce.jpg",
    alt: "Modern brand websites and high-converting Shopify stores"
  }
};

// ----------------------------------------------------------------------------
// INDUSTRIAL SUPPLIES MEDIA
// ----------------------------------------------------------------------------
export const INDUSTRIAL_SUPPLIES_MEDIA = {
  "leather-welding-gloves": {
    id: "leather-welding-gloves",
    name: "Leather Welding Gloves",
    image: "/media/products/leather-welding-gloves.jpg",
    fallbackImage: "/media/products/leather-welding-gloves.jpg",
    alt: "Heavy-duty heat-resistant split cowhide leather welding gloves with Kevlar stitching"
  },
  "working-gloves": {
    id: "working-gloves",
    name: "Working Gloves",
    image: "/media/products/working-gloves.jpg",
    fallbackImage: "/media/products/working-gloves.jpg",
    alt: "Reinforced industrial safety work gloves for heavy construction and handling"
  },
  "furniture-gloves": {
    id: "furniture-gloves",
    name: "Furniture Gloves",
    image: "/media/products/furniture-gloves.jpg",
    fallbackImage: "/media/products/furniture-gloves.jpg",
    alt: "Precision handling soft-grain leather furniture and upholstery work gloves"
  },
  "rescue-jackets": {
    id: "rescue-jackets",
    name: "Rescue Jackets",
    image: "/media/products/rescue-jackets.jpg",
    fallbackImage: "/media/products/rescue-jackets.jpg",
    alt: "High-visibility flame-retardant emergency and technical rescue outerwear"
  },
  "safety-jackets": {
    id: "safety-jackets",
    name: "Safety Jackets",
    image: "/media/products/safety-jackets.jpg",
    fallbackImage: "/media/products/safety-jackets.jpg",
    alt: "Certified fluorescent industrial safety jackets with 3M reflective tape"
  },
  "other-industrial": {
    id: "other-industrial",
    name: "Other Industrial / Safety Products",
    image: "/media/products/other-industrial.jpg",
    fallbackImage: "/media/products/other-industrial.jpg",
    alt: "Specialized industrial personal protective equipment and utility gear"
  }
};

export const REAL_PORTFOLIO_ITEMS = [
  {
    id: "noir-atelier",
    title: "Noir Atelier",
    image: "/media/portfolio/noir-atelier-store.jpg"
  },
  {
    id: "parallel-studios",
    title: "Parallel Studios",
    image: "/media/portfolio/parallel-studios-store.jpg"
  },
  {
    id: "kinetic-dept",
    title: "Kinetic Dept",
    image: "/media/portfolio/kinetic-dept-store.jpg"
  },
  {
    id: "archive-supply",
    title: "Archive Supply Co",
    image: "/media/portfolio/archive-supply-store.jpg"
  },
  {
    id: "system09",
    title: "System 09 Labs",
    image: "/media/portfolio/system09-store.jpg"
  }
];

export const BLANKS_MEDIA_BASE = "/media/blanks/";

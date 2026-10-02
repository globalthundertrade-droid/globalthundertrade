import { SERVICES_MEDIA, REAL_PORTFOLIO_ITEMS } from './mediaConfig';
// ============================================================================
// CENTRALIZED SERVICES DATA ARCHITECTURE — GLOBAL THUNDER TRADE
// ============================================================================
// Centralized configuration for all services, media slots, galleries,
// process flows, mockups, and decision paths.
// Replace any image URL, video path, or copy here without modifying components.
// ============================================================================

export const SERVICES_HERO_MEDIA = [
  {
    id: "factory-production",
    label: "FACTORY PRODUCTION",
    sub: "PRECISION CUT & STITCH",
    image: "/media/services/hero-factory.jpg",
    video: "/videos/services/factory-production.mp4"
  },
  {
    id: "product-photography",
    label: "STUDIO PHOTOGRAPHY",
    sub: "CLEAN DETAIL & E-COMMERCE",
    image: "/media/services/hero-photography.jpg",
    video: "/videos/services/product-photography.mp4"
  },
  {
    id: "model-shoots",
    label: "MODEL CAMPAIGNS",
    sub: "LIFESTYLE LOOKBOOKS",
    image: "/media/services/hero-models.jpg",
    video: "/videos/services/model-shoots.mp4"
  },
  {
    id: "ecommerce-web",
    label: "DIGITAL PRESENCE",
    sub: "SHOPIFY & CUSTOM WEB",
    image: "/media/services/hero-ecommerce.jpg",
    video: "/videos/services/ecommerce-web.mp4"
  }
];

export const SERVICE_PILLARS = [
  {
    id: "manufacturing",
    number: "01",
    title: "PRODUCT DEVELOPMENT & MANUFACTURING",
    shortTitle: "MANUFACTURING",
    anchor: "manufacturing",
    headline: "FROM IDEA TO FINISHED PRODUCT.",
    tagline: "End-to-end garment engineering, custom textile milling, and precision bulk manufacturing.",
    description: "Your brand does not have to settle for catalog limits. We guide yarn weights, shrinkage allowance, and custom construction from your first tech pack sketch to palletized delivery.",
    image: SERVICES_MEDIA["manufacturing"].image,
    video: SERVICES_MEDIA["manufacturing"].video,
    poster: SERVICES_MEDIA["manufacturing"].poster,
    fallbackImage: SERVICES_MEDIA["manufacturing"].fallbackImage,
    keyDeliverables: [
      "Custom Tech Pack & Pattern Grading",
      "Fabric Sourcing (200–550 GSM)",
      "Sampling & Fitting Adjustments",
      "Bulk Cut-and-Sew Production",
      "Industrial Printing & Embroidery",
      "Brand-Ready Packaging & Logistics"
    ]
  },
  {
    id: "content",
    number: "02",
    title: "CONTENT & PRODUCT PHOTOGRAPHY",
    shortTitle: "CONTENT & PHOTO",
    anchor: "content",
    headline: "YOUR PRODUCT DESERVES GOOD CONTENT.",
    tagline: "We don't just make the product. We can help you create the content that sells it.",
    description: "High-end studio photography, 4K detail videography, social-first reels, and on-model editorial lookbooks produced directly once your garments come off the production line.",
    image: SERVICES_MEDIA["content"].image,
    video: SERVICES_MEDIA["content"].video,
    poster: SERVICES_MEDIA["content"].poster,
    fallbackImage: SERVICES_MEDIA["content"].fallbackImage,
    keyDeliverables: [
      "Clean Studio E-Commerce Photography",
      "Macro Fabric & Stitch Detail Shots",
      "Short-Form Video & Viral Reels",
      "On-Model Fashion Campaign Shoots",
      "Behind-The-Scenes Factory Content",
      "Pre-Formatted Social Media Assets"
    ]
  },
  {
    id: "social-media",
    number: "03",
    title: "SOCIAL MEDIA & MARKETING",
    shortTitle: "SOCIAL MEDIA",
    anchor: "social-media",
    headline: "WE CAN HELP YOU SHOW UP TOO.",
    tagline: "Once the product is ready, your audience still needs to see it.",
    description: "Practical, aesthetic social media execution. We organize your content drop calendars, manage Instagram aesthetics, format stories and reels, and maintain consistent brand momentum.",
    image: SERVICES_MEDIA["social-media"].image,
    video: SERVICES_MEDIA["social-media"].video,
    poster: SERVICES_MEDIA["social-media"].poster,
    fallbackImage: SERVICES_MEDIA["social-media"].fallbackImage,
    keyDeliverables: [
      "Instagram Account Management",
      "Content Planning & Drop Calendars",
      "Reels & Story Production",
      "Brand Positioning & Visual Grid Curation",
      "Caption Copywriting & Hashtag Direction",
      "Pre-Launch Teaser Sequences"
    ]
  },
  {
    id: "web-ecommerce",
    number: "04",
    title: "WEB & E-COMMERCE",
    shortTitle: "WEB & SHOPIFY",
    anchor: "web-ecommerce",
    headline: "YOUR BRAND NEEDS A HOME.",
    tagline: "We build modern websites and clean Shopify stores that turn your products into a real digital storefront.",
    description: "From custom branded editorial websites to streamlined Shopify stores optimized for conversions, fast mobile checkout, and seamless inventory management.",
    image: SERVICES_MEDIA["web-ecommerce"].image,
    video: SERVICES_MEDIA["web-ecommerce"].video,
    poster: SERVICES_MEDIA["web-ecommerce"].poster,
    fallbackImage: SERVICES_MEDIA["web-ecommerce"].fallbackImage,
    keyDeliverables: [
      "Custom Brand Website Development",
      "Shopify Store Setup & Theme Styling",
      "Product Upload & Collection Curation",
      "Mobile-First Responsive Layouts",
      "Inquiry & Pre-Order Capture Forms",
      "Domain Setup & Launch Readiness"
    ]
  }
];

// 8-Step Manufacturing Process
export const MANUFACTURING_PROCESS = [
  {
    step: "01",
    title: "IDEA",
    subtitle: "CONCEPT ALIGNMENT",
    desc: "You send reference sketches, moodboards, or tech pack drafts. We assess silhouettes, target price points, and construction feasibility.",
    image: "/media/services/journey-01-idea.jpg",
    badge: "STAGE 01 // DRAFTING"
  },
  {
    step: "02",
    title: "DEVELOPMENT",
    subtitle: "MATERIAL & FIT ENGINEERING",
    desc: "We calibrate yarn GSM, fabric blends (combed cotton, French terry, fleece), ribbing ratios, and generate precision pattern curves.",
    image: "/media/services/journey-02-dev.jpg",
    badge: "STAGE 02 // GRADING"
  },
  {
    step: "03",
    title: "SAMPLE",
    subtitle: "PHYSICAL PROTOTYPE",
    desc: "Master sample machinists construct your 1-of-1 physical sample. Shipped directly to you for tactile fit, drape, and stitch inspection.",
    image: "/media/services/journey-03-sample.jpg",
    badge: "STAGE 03 // PROTOTYPE"
  },
  {
    step: "04",
    title: "REFINEMENT",
    subtitle: "SAMPLE FIT ADJUSTMENTS",
    desc: "Review sizing feedback, test garment wash behavior, refine print scales or embroidery density, and confirm golden production approval.",
    image: "/media/services/gallery-detail.jpg",
    badge: "STAGE 04 // REFINEMENT"
  },
  {
    step: "05",
    title: "PRODUCTION",
    subtitle: "INDUSTRIAL BULK STITCHING",
    desc: "Bulk fabric laser/shear cutting, multi-head embroidery, automated printing, and assembly-line stitching with strict in-line quality controls.",
    image: "/media/services/journey-04-mfg.jpg",
    badge: "STAGE 05 // BULK MANUFACTURING"
  },
  {
    step: "06",
    title: "FINISHING",
    subtitle: "TRIMS, LABELS & WASHES",
    desc: "Enzyme washes, silicone softeners, woven neck labels, custom metal eyelets, debossed hangtags, and industrial steam pressing.",
    image: "/media/products/side-products/custom-labels.jpg",
    badge: "STAGE 06 // BRAND TRIMS"
  },
  {
    step: "07",
    title: "PACKAGING",
    subtitle: "RETAIL-READY UNBOXING",
    desc: "Individual frosted ziplock polybagging, desiccant pouches, SKU barcode stickers, and heavy-duty double-wall master export cartons.",
    image: "/media/services/journey-09-launch.jpg",
    badge: "STAGE 07 // CUSTOM PACKAGING"
  },
  {
    step: "08",
    title: "DELIVERY",
    subtitle: "GLOBAL LOGISTICS",
    desc: "Door-to-door express air courier (DHL / FedEx) or sea cargo with full international customs clearance directly to your brand facility.",
    image: "/media/manufacturing/08-launch-scale.jpg",
    badge: "STAGE 08 // WORLDWIDE SHIPMENT"
  }
];

// Product Development Capabilities
export const APPAREL_CATEGORIES = [
  { name: "Streetwear Apparel", details: "Heavyweight hoodies (450–550 GSM), boxy drop-shoulder tees, sweatpants, cargos" },
  { name: "Fashion Wear", details: "Cut-and-sew outerwear, tailored trousers, poplin shirts, tracksuits, knitted essentials" },
  { name: "Leather Products", details: "Top-grain cowhide biker jackets, suede overshirts, genuine leather accessories & trims" },
  { name: "Medical & Uniforms", details: "Antibacterial medical scrubs, performance lab coats, durable industrial uniforms" },
  { name: "Luxury Blanks", details: "Pre-milled blanks ready for rapid screenprinting, DTF, and private relabeling drops" }
];

// Content & Photography Gallery
export const CONTENT_GALLERY = [
  {
    id: "g1",
    category: "product",
    categoryLabel: "PRODUCT PHOTOGRAPHY",
    title: "Clean E-Commerce Ghost Mannequin & Flat Lay",
    desc: "Neutral high-key background, accurate garment color fidelity, and crisp texture capture for e-commerce catalog pages.",
    image: "/media/services/gallery-product.jpg",
    tag: "CATALOG READY"
  },
  {
    id: "g2",
    category: "detail",
    categoryLabel: "DETAIL & MACRO",
    title: "Embroidery & Fabric Texture Close-Up",
    desc: "Macro lens photography highlighting yarn ribbing, 3D puff embroidery, metallic hardware, and precision needlework.",
    image: "/media/services/gallery-detail.jpg",
    tag: "MACRO SPEC"
  },
  {
    id: "g3",
    category: "model",
    categoryLabel: "MODEL LOOKBOOK",
    title: "Editorial On-Model Fashion Lookbook",
    desc: "Styled models wearing your clothing in studio and urban settings, showing authentic silhouette drape and styling combinations.",
    image: "/media/services/gallery-model.jpg",
    tag: "LOOKBOOK CAMPAIGN"
  },
  {
    id: "g4",
    category: "video",
    categoryLabel: "PRODUCT VIDEOGRAPHY",
    title: "Short-Form Video & Motion Reels",
    desc: "9:16 high-energy vertical reels and 16:9 cinematic videos showcasing movement, unboxing, and garment details.",
    image: "/media/services/gallery-video.jpg",
    tag: "4K SHORT-FORM"
  },
  {
    id: "g5",
    category: "bts",
    categoryLabel: "BEHIND THE SCENES",
    title: "Factory Craft & Production Documentation",
    desc: "Authentic footage of cutting tables, industrial embroidery, and assembly stitching that builds brand authenticity on social media.",
    image: "/media/services/gallery-bts.jpg",
    tag: "BRAND STORY"
  },
  {
    id: "g6",
    category: "model",
    categoryLabel: "MODEL CAMPAIGN",
    title: "Streetwear Lifestyle Campaign",
    desc: "High-contrast urban campaign photography highlighting fit, posture, and brand aesthetic for lookbook and billboard use.",
    image: "/media/services/gallery-campaign.jpg",
    tag: "CAMPAIGN SHOT"
  }
];

// Interactive Social Media Mock Posts (Product -> Content -> Post -> Reel -> Campaign)
export const SOCIAL_MOCK_JOURNEY = [
  {
    id: "sm-product",
    step: "01",
    phase: "PRODUCT",
    badge: "PHYSICAL FINISHED GARMENT",
    title: "Heavyweight 480 GSM French Terry Hoodie",
    caption: "Just pulled from final QC pressing. Custom washed, 3D puff embroidery, woven neck tag. Ready for the camera lens.",
    image: "/media/services/social-product.jpg",
    metrics: "Production Approved",
    format: "Garment Inspection"
  },
  {
    id: "sm-content",
    step: "02",
    phase: "CONTENT",
    badge: "STUDIO & MODEL SHOOT",
    title: "Raw 4K Editorial Shoot & Macro Stills",
    caption: "Captured in the GTT photo studio: clean ghost flat lays, styled on-model shots, and close-up stitch reels.",
    image: "/media/services/social-content.jpg",
    metrics: "24 Selects Delivered",
    format: "Photo & Video Capture"
  },
  {
    id: "sm-post",
    step: "03",
    phase: "POST",
    badge: "INSTAGRAM GRID POST",
    title: "Curated Feed Drop & Product Carousel",
    caption: "Engineered for luxury brands. 480 GSM fleece. Pre-shrunk cotton. Drops Friday 12:00 PM EST. Link in bio.",
    image: "/media/services/social-post.jpg",
    metrics: "Grid Curation Ready",
    format: "1080 × 1350 Portrait"
  },
  {
    id: "sm-reel",
    step: "04",
    phase: "REEL",
    badge: "HIGH-ENERGY SHORT FORM",
    title: "Behind-The-Stitch Motion Video",
    caption: "The making of a 120,000-stitch graphic. Watch the Tajima heads in motion. Audio synced for viral explore reach.",
    image: "/media/services/social-reel.jpg",
    metrics: "9:16 Vertical Format",
    format: "Reels / TikTok Sync"
  },
  {
    id: "sm-campaign",
    step: "05",
    phase: "CAMPAIGN",
    badge: "DROP DAY ROLLOUT",
    title: "Collection Launch Momentum",
    caption: "Coordinated teaser stories, product countdowns, influencer asset packs, and direct e-commerce swipe-ups.",
    image: "/media/services/social-campaign.jpg",
    metrics: "Full Drop Rollout",
    format: "Multi-Asset Drop"
  }
];

// Web Transformation Process
export const WEB_TRANSFORMATION_STEPS = [
  {
    id: "design",
    number: "01",
    phase: "DESIGN",
    title: "Art Direction & Wireframing",
    desc: "Editorial typography, dark/light aesthetic balance, product showcase layout, and seamless mobile navigation architecture.",
    deliverable: "Custom Figma prototype & style guide"
  },
  {
    id: "build",
    number: "02",
    phase: "BUILD",
    title: "Clean Modern Frontend Code",
    desc: "Lightweight, lightning-fast responsive code. Smooth micro-interactions, zero layout shifts, and SEO-optimized structures.",
    deliverable: "High-performance responsive web codebase"
  },
  {
    id: "product",
    number: "03",
    phase: "PRODUCT",
    title: "Interactive Catalog & Storytelling",
    desc: "High-res garment galleries, tech spec callouts, 3D interactive customizers, and clear direct brand inquiry pathways.",
    deliverable: "Product catalog & inquiry capture architecture"
  },
  {
    id: "launch",
    number: "04",
    phase: "LAUNCH",
    title: "Domain, SSL & Global Deployment",
    desc: "Custom domain connection, CDN speed optimization, analytics setup, and production launch ready for your brand traffic.",
    deliverable: "Live digital storefront connected to your brand"
  }
];

// Shopify Store Setup Features
export const SHOPIFY_FEATURES = [
  {
    title: "Clean Store Setup",
    desc: "Configuring store preferences, currency, tax profiles, and brand typography for an elevated direct-to-consumer store."
  },
  {
    title: "Collection & Product Structure",
    desc: "High-res imagery uploads, variants (Sizes XS–3XL, Colors), inventory tracking, and clear tech spec breakdowns."
  },
  {
    title: "High-Converting Product Pages",
    desc: "Editorial layout, size charts, fabric weight badges, accordion details, and fast sticky Add-to-Cart buttons."
  },
  {
    title: "Mobile-First Shopping",
    desc: "Over 80% of streetwear sales happen on mobile. Every template is strictly tested on iOS & Android for one-thumb checkout."
  },
  {
    title: "Brand Visual Customization",
    desc: "Monochrome luxury styling, custom announcement banners, drop countdown timers, and lookbook integration."
  },
  {
    title: "Launch Checklist & Handoff",
    desc: "Domain pointing, order notification emails, test transaction check, and clear walkthrough instructions for your team."
  }
];

// The 9-Step Complete Brand-Building Journey
export const BRAND_JOURNEY = [
  {
    step: "01",
    title: "IDEA",
    role: "Product & Concept",
    desc: "Every brand begins with a perspective. You bring the sketch, moodboard, or streetwear reference; we map the technical roadmap.",
    benefit: "Eliminates confusion on fabrics, trims, and target costs.",
    image: "/media/services/journey-01-idea.jpg"
  },
  {
    step: "02",
    title: "PRODUCT DEVELOPMENT",
    role: "Fabric & Pattern Engineering",
    desc: "We calibrate yarn GSM, fabric blends, rib tension, and grade patterns from XS to 3XL so your silhouettes stand out.",
    benefit: "Custom cuts tailored to your brand rather than off-the-shelf blanks.",
    image: "/media/services/journey-02-dev.jpg"
  },
  {
    step: "03",
    title: "SAMPLE",
    role: "Physical Prototype",
    desc: "Our machinists construct a physical sample for tactile evaluation of drape, stitch durability, print scales, and fits.",
    benefit: "Zero guesswork before committing to full production runs.",
    image: "/media/services/journey-03-sample.jpg"
  },
  {
    step: "04",
    title: "MANUFACTURING",
    role: "Industrial Bulk Production",
    desc: "Approved garments enter assembly line manufacturing with in-line quality controls, puff embroidery, DTF, and washes.",
    benefit: "Direct factory pricing, consistent sizing, and commercial durability.",
    image: "/media/services/journey-04-mfg.jpg"
  },
  {
    step: "05",
    title: "CONTENT",
    role: "Studio & Model Photography",
    desc: "While products are freshly pressed in the facility, our creative unit captures clean studio e-comm stills and styled on-model shots.",
    benefit: "You receive professional imagery before the boxes even arrive at your door.",
    image: "/media/services/journey-05-content.jpg"
  },
  {
    step: "06",
    title: "SOCIAL MEDIA",
    role: "Reels & Grid Curation",
    desc: "We turn raw production and photoshoot assets into pre-formatted Instagram reels, stories, and drop sequence posts.",
    benefit: "Consistent social presence without spending weeks editing alone.",
    image: "/media/services/journey-06-social.jpg"
  },
  {
    step: "07",
    title: "WEBSITE",
    role: "Digital Brand Platform",
    desc: "We build a modern, high-speed website showcasing your collection lookbook, brand story, and direct retail inquiry system.",
    benefit: "A professional digital presence that makes your brand look established.",
    image: "/media/services/journey-07-website.jpg"
  },
  {
    step: "08",
    title: "SHOPIFY",
    role: "E-Commerce Checkout",
    desc: "We configure your Shopify store with inventory tiers, size guides, clean mobile product pages, and seamless checkout.",
    benefit: "Zero technical friction when customers rush to buy on drop day.",
    image: "/media/services/journey-08-shopify.jpg"
  },
  {
    step: "09",
    title: "LAUNCH",
    role: "Collection Drop Day",
    desc: "Physical inventory delivered, media live, social buzzing, and website taking orders. Your brand is officially in the market.",
    benefit: "One cohesive execution instead of coordinating five different vendors.",
    image: "/media/services/journey-09-launch.jpg"
  }
];

// Interactive Decision Tool: "WHAT ARE YOU BUILDING?"
export const DECISION_OPTIONS = [
  {
    id: "idea",
    label: "I HAVE AN IDEA",
    headline: "CONCEPT & TECH PACK DEVELOPMENT",
    service: "Product Development & Tech Pack Consultation",
    desc: "Bring us your concept sketches, reference images, or rough moodboard. We'll refine the silhouettes, select suitable GSM fabrics, and engineer a production-ready tech pack.",
    deliverables: ["Tech pack generation", "Fabric & GSM selection", "Measurement specs", "Cost estimation"],
    ctaText: "DISCUSS YOUR IDEA",
    ctaLink: "/contact"
  },
  {
    id: "sample",
    label: "I NEED A SAMPLE",
    headline: "RAPID PHYSICAL PROTOTYPING",
    service: "Prototyping & Sample Machine Shop",
    desc: "You have a design ready and need a physical sample to test fit, fabric drape, and print quality before committing to bulk manufacturing.",
    deliverables: ["1-of-1 physical sample", "Embroidery/print testing", "Fit & wash testing", "Sample delivery via express air"],
    ctaText: "ORDER A SAMPLE",
    ctaLink: "/contact"
  },
  {
    id: "manufacturing",
    label: "I NEED MANUFACTURING",
    headline: "VOLUME GARMENT PRODUCTION",
    service: "Industrial Cut & Sew Manufacturing",
    desc: "You have your tech pack or approved sample and need reliable, high-volume production with custom trims, woven labels, and quality control.",
    deliverables: ["Bulk cut and sew", "Custom embroidery / DTF / screenprinting", "Woven labels & hangtags", "Palletized door-to-door delivery"],
    ctaText: "START MANUFACTURING",
    ctaLink: "/contact"
  },
  {
    id: "content",
    label: "I NEED CONTENT",
    headline: "PRODUCT PHOTOGRAPHY & VIDEOGRAPHY",
    service: "Studio Content & Lookbook Production",
    desc: "You have finished garments but need clean e-commerce photography, macro detail shots, on-model lookbooks, or viral reels to sell them.",
    deliverables: ["Clean ghost e-comm stills", "Styled on-model photoshoots", "4K video reels & motion clips", "Pre-formatted social exports"],
    ctaText: "BOOK CONTENT SHOOT",
    ctaLink: "/contact"
  },
  {
    id: "social",
    label: "I NEED SOCIAL MEDIA",
    headline: "INSTAGRAM EXECUTION & CONTENT PLANNING",
    service: "Social Media Account Handling & Rollout",
    desc: "You want a cohesive, luxury Instagram grid, structured content drop schedules, and consistent posting without wasting hours every week.",
    deliverables: ["Instagram grid planning", "Reel & story formatting", "Caption & hashtag copy", "Drop countdown execution"],
    ctaText: "DISCUSS SOCIAL STRATEGY",
    ctaLink: "/contact"
  },
  {
    id: "website",
    label: "I NEED A WEBSITE",
    headline: "CUSTOM BRAND DIGITAL HOME",
    service: "Modern Responsive Web Development",
    desc: "You need a sleek, editorial website that showcases your brand story, lookbooks, collection drops, and direct inquiry capture.",
    deliverables: ["Custom frontend design", "Collection catalog system", "Fast mobile responsiveness", "Custom domain & SSL setup"],
    ctaText: "BUILD YOUR WEBSITE",
    ctaLink: "/contact"
  },
  {
    id: "shopify",
    label: "I NEED A SHOPIFY STORE",
    headline: "PROFESSIONAL E-COMMERCE STOREFRONT",
    service: "Shopify Store Setup & Optimization",
    desc: "You need a high-converting Shopify store configured with clean product pages, variant tiers, inventory tracking, and smooth checkout.",
    deliverables: ["Shopify theme setup", "Product & variant upload", "Size guides & badge integration", "Checkout & domain testing"],
    ctaText: "LAUNCH SHOPIFY STORE",
    ctaLink: "/contact"
  },
  {
    id: "everything",
    label: "I NEED EVERYTHING",
    headline: "COMPLETE BRAND-BUILDING INCUBATION",
    service: "Full-Spectrum GTT Partnership",
    desc: "From your initial idea to physical manufacturing, photography, social media rollout, and Shopify e-commerce launch. One unified partner.",
    deliverables: ["End-to-end product development", "Full bulk manufacturing", "Complete studio & model content", "Shopify store + social rollout"],
    ctaText: "LAUNCH FULL BRAND WITH GTT",
    ctaLink: "/contact"
  }
];

// ============================================================================
// CLIENT BRANDS WE'VE HELPED BUILD (MARQUEE LOGOS)
// ============================================================================
// Centralized editable logo data structure.
// Easily swap out or add real client logos, brand names, and service tags.
export const CLIENT_BRANDS = [
  {
    id: "brand-1",
    name: "NOIR ATELIER",
    category: "Full Brand Incubation",
    tag: "SHOPIFY & MANUFACTURING",
    logoText: "NOIR ATELIER",
    logoSub: "EST. 2023 // PARIS - NYC",
    accent: "HEAVYWEIGHT FLEECE & E-COMM"
  },
  {
    id: "brand-2",
    name: "KINETIC DEPT",
    category: "Product Dev & Content",
    tag: "MANUFACTURING & REELS",
    logoText: "KINETIC DEPT.",
    logoSub: "ACTIVE TECHNICAL STREETWEAR",
    accent: "450 GSM FRENCH TERRY"
  },
  {
    id: "brand-3",
    name: "PARALLEL STUDIOS",
    category: "Web & E-Commerce",
    tag: "CUSTOM BRAND PLATFORM",
    logoText: "PARALLEL",
    logoSub: "CONTEMPORARY MENSWEAR",
    accent: "DIGITAL CATALOG & LOOKBOOK"
  },
  {
    id: "brand-4",
    name: "ARCHIVE SUPPLY",
    category: "Manufacturing & Trims",
    tag: "BULK CUT & SEW",
    logoText: "ARCHIVE CO.",
    logoSub: "MINIMALIST ESSENTIALS",
    accent: "PUFF EMBROIDERY & WOVEN LABELS"
  },
  {
    id: "brand-5",
    name: "DISTRICT NINE",
    category: "Content & Model Shoots",
    tag: "STUDIO PHOTOGRAPHY",
    logoText: "DISTRICT // 09",
    logoSub: "URBAN UTILITY APPAREL",
    accent: "4K EDITORIAL LOOKBOOK"
  },
  {
    id: "brand-6",
    name: "SYSTEM 09 LABS",
    category: "Shopify Store Setup",
    tag: "DTC SHOPIFY LAUNCH",
    logoText: "SYSTEM 09",
    logoSub: "MODULAR OUTERWEAR",
    accent: "ONE-THUMB MOBILE CHECKOUT"
  },
  {
    id: "brand-7",
    name: "CHRONO APPAREL",
    category: "Social Media & Packaging",
    tag: "INSTAGRAM & PACKAGING",
    logoText: "CHRONO",
    logoSub: "TIMELESS STREET SILHOUETTES",
    accent: "FROSTED POLYBAGS & REELS"
  },
  {
    id: "brand-8",
    name: "HEAVYWEIGHT SUPPLY",
    category: "Luxury Blank Program",
    tag: "PRE-MILLED BLANKS",
    logoText: "HEAVYWEIGHT.",
    logoSub: "500 GSM FLEECE BLANKS",
    accent: "RAPID RELABELING DROPS"
  }
];

// ============================================================================
// DIGITAL WORK / WEBSITES WE'VE BUILT (PORTFOLIO REEL)
// ============================================================================
// Centralized project data structure for digital storefronts and websites.
// Replace mockup screenshots, brand names, and live URLs here.
export const DIGITAL_PORTFOLIO = [
  {
    id: "proj-1",
    brand: "NOIR ATELIER",
    service: "Shopify Store Setup & Art Direction",
    category: "SHOPIFY E-COMMERCE",
    tag: "DIRECT-TO-CONSUMER",
    headline: "High-Converting Editorial Streetwear Storefront",
    summary: "Built on Shopify with custom Liquid styling, instant slide-out cart, drop countdown timer, and seamless mobile checkout for high-traffic collection launches.",
    image: "/media/portfolio/noir-atelier-store.jpg",
    stats: [
      { label: "Platform", value: "Shopify DTC" },
      { label: "Mobile Speed", value: "98/100" },
      { label: "Checkout", value: "Instant 1-Click" }
    ],
    features: ["Custom Drop Countdown", "Pre-Order Deposit Workflow", "Size Guide Accordion", "Curated Instagram Feed"],
    previewUrl: "https://noir-atelier.preview.gtt.trade"
  },
  {
    id: "proj-2",
    brand: "PARALLEL STUDIOS",
    service: "Custom Brand Website & Lookbook",
    category: "BRAND PLATFORM",
    tag: "CUSTOM WEB ARCHITECTURE",
    headline: "Runway-Grade Interactive Collection Showcase",
    summary: "A modern React-powered digital lookbook and catalog platform with fluid micro-interactions, high-definition zoom on garment weaves, and direct wholesale buyer inquiry forms.",
    image: "/media/portfolio/parallel-studios-store.jpg",
    stats: [
      { label: "Stack", value: "React / Vite / SSR" },
      { label: "Asset Quality", value: "4K Retina Ready" },
      { label: "Interaction", value: "Fluid Micro-motion" }
    ],
    features: ["Interactive Runway Video Hero", "Fabric Spec Macro Inspector", "Wholesale Line Sheet", "Buyer VIP Access"],
    previewUrl: "https://parallel-studios.preview.gtt.trade"
  },
  {
    id: "proj-3",
    brand: "KINETIC DEPT.",
    service: "Shopify Liquid Customization & Lookbook",
    category: "SHOPIFY E-COMMERCE",
    tag: "PERFORMANCE STREETWEAR",
    headline: "High-Energy Drop Site With Video Hero",
    summary: "Engineered for rapid flash drops. Features integrated background looping video, automated inventory countdowns, and bundle-builder discounts for matching hoodies and sweatpants.",
    image: "/media/portfolio/kinetic-dept-store.jpg",
    stats: [
      { label: "Platform", value: "Shopify Plus" },
      { label: "Drop Capacity", value: "10,000+ Concurrent" },
      { label: "Cart Type", value: "Slide Drawer Ajax" }
    ],
    features: ["Looped Background Video", "Drop Waitlist Capture", "Bundle Discount Rules", "Currency Switcher"],
    previewUrl: "https://kinetic-dept.preview.gtt.trade"
  },
  {
    id: "proj-4",
    brand: "ARCHIVE SUPPLY CO.",
    service: "Wholesale Portal & Product Catalog",
    category: "B2B WHOLESALE SYSTEM",
    tag: "PORTAL & CATALOG",
    headline: "Password-Protected Buyer Order System",
    summary: "Streamlined wholesale ordering portal with tiered volume pricing tables, swatch sample requests, live stock indicators, and automated purchase order generation.",
    image: "/media/portfolio/archive-supply-store.jpg",
    stats: [
      { label: "Type", value: "Private B2B Portal" },
      { label: "Tiers", value: "Sample to 5,000+ Units" },
      { label: "Invoicing", value: "Automated PO PDF" }
    ],
    features: ["Live Stock Matrix", "Tiered Quantity Pricing", "Swatch Sample Request", "Direct Factory Dispatch"],
    previewUrl: "https://archive-supply.preview.gtt.trade"
  },
  {
    id: "proj-5",
    brand: "SYSTEM 09 LABS",
    service: "Single-Drop Promotional Microsite",
    category: "CAMPAIGN MICROSITE",
    tag: "VIRAL DROP CAMPAIGN",
    headline: "3D Garment Rotation & SMS Access Gate",
    summary: "Built for a high-profile limited winter capsule drop. Incorporates interactive 3D model rotation, password-protected early access for SMS subscribers, and countdown reveal.",
    image: "/media/portfolio/system09-store.jpg",
    stats: [
      { label: "Feature", value: "3D Product Spin" },
      { label: "Gate", value: "SMS Verification" },
      { label: "Sellout Time", value: "14 Minutes" }
    ],
    features: ["3D Garment Inspector", "SMS Early Access Gate", "Live Sellout Countdown", "Global Express Shipping"],
    previewUrl: "https://system09.preview.gtt.trade"
  }
];


export { REAL_PORTFOLIO_ITEMS };

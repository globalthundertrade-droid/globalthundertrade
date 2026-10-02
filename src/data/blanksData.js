import { BLANKS_MEDIA_BASE } from './mediaConfig.js';

/**
 * CENTRALIZED BLANKS PRODUCT & CATALOGUE DATA — GLOBAL THUNDER TRADE (GTT)
 * 
 * 25 UNIQUE BLANK PRODUCT OPTIONS
 * - Single source of truth shared by both Homepage and dedicated /blanks page.
 * - Each product supports 5 to 7 distinct color variants with circular swatches.
 * - Configurable SAMPLE MOQ and BULK MOQ.
 * - High-resolution image zoom & pan support.
 * - Zero synthetic/AI placeholders; uses verified local imagery.
 */

export const BLANK_CATEGORIES = [
  "ALL",
  "HOODIES",
  "T-SHIRTS",
  "OVERSIZED TEES",
  "SWEATSHIRTS",
  "ZIP HOODIES",
  "BAGGY SWEAT PANTS",
  "SWEAT PANTS",
  "SHORTS",
  "JACKETS",
  "CROPPED & SLEEVELESS",
  "LONG SLEEVE",
  "MORE"
];

// Helper to normalize product object for backwards and modern API compatibility
function createBlankProduct({
  id,
  slug,
  name,
  category,
  gsm,
  fabric,
  fit,
  sampleMOQ = 3,
  bulkMOQ = 45,
  defaultColor,
  variants = [],
  description,
  features = [],
  customizationOptions = []
}) {
  // Normalize variants with fallback images
  const normalizedVariants = variants.map((v) => ({
    color: v.color,
    colorCode: v.colorCode || '#111111',
    image: v.image,
    zoomImage: v.zoomImage || v.image
  }));

  // Backwards compatibility format for colours
  const colours = normalizedVariants.map((v) => ({
    name: v.color,
    hex: v.colorCode,
    image: v.image,
    zoomImage: v.zoomImage
  }));

  const allImages = normalizedVariants.map((v) => v.image).filter(Boolean);
  const primaryImage = normalizedVariants[0]?.image || `${BLANKS_MEDIA_BASE}heavyweight-boxy-hoodie-main.jpg`;
  const secondaryImage = normalizedVariants[1]?.image || primaryImage;

  return {
    id,
    slug,
    name,
    category,
    gsm,
    fabric,
    fit,
    sampleMOQ,
    bulkMOQ,
    defaultColor: defaultColor || normalizedVariants[0]?.color || "Pitch Black",
    variants: normalizedVariants,
    colours,
    images: allImages.length > 0 ? allImages : [primaryImage, secondaryImage],
    mainImage: primaryImage,
    secondaryImage: secondaryImage,
    description,
    features,
    customizationOptions: customizationOptions.length > 0 ? customizationOptions : [
      "3D Puff & Flat Satin Embroidery",
      "Jumbo Screen Printing (Plastisol / Water-based)",
      "High-Definition Direct-To-Film (DTF)",
      "Custom Woven Neck Labels & Hem Tabs",
      "Vintage Mineral & Acid Wash Finishes",
      "Branded Frosted Polybag Packaging"
    ],
    available: true
  };
}

export const BLANK_PRODUCTS = [
  // --------------------------------------------------------------------------
  // 01. 460 GSM Heavyweight Boxy Blank Hoodie (HOODIES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-01",
    slug: "460-gsm-heavyweight-boxy-hoodie",
    name: "460 GSM Heavyweight Boxy Blank Hoodie",
    category: "HOODIES",
    gsm: "460 GSM",
    fabric: "100% Combed Ring-Spun Cotton Fleece (Customizable)",
    fit: "Oversized Streetwear Drop Shoulder",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#111111", image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg" },
      { color: "Bone Off-White", colorCode: "#f3f0e8", image: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#2c2c2c", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Vintage Olive", colorCode: "#353e32", image: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg" },
      { color: "Muted Clay", colorCode: "#5b433a", image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg" },
      { color: "Deep Navy", colorCode: "#1a2332", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Mocha Brown", colorCode: "#423229", image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg" }
    ],
    description: "An unbranded heavyweight streetwear silhouette engineered with structured drop shoulders, generous chest proportions, and an uncorded double-layer hood. Ready for high-density puff printing, direct embroidery, and custom relabeling.",
    features: [
      "Double-layered crossover hood without cord eyelets",
      "Thick 2x2 ribbed cuffs and hemband with shape retention",
      "Seamless front kangaroo pocket pouch with reinforced bar-tacks",
      "Tear-away satin neck label for private brand relabeling",
      "Enzyme-washed combed yarn for clean print adhesion"
    ]
  }),

  // --------------------------------------------------------------------------
  // 02. 400 GSM Classic Streetwear Pullover Hoodie (HOODIES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-02",
    slug: "400-gsm-classic-streetwear-pullover-hoodie",
    name: "400 GSM Classic Streetwear Pullover Hoodie",
    category: "HOODIES",
    gsm: "400 GSM",
    fabric: "100% Cotton 3-End French Terry Fleece",
    fit: "Relaxed Boxy Fit with Crossover Neck",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Jet Black",
    variants: [
      { color: "Jet Black", colorCode: "#0d0d0d", image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg" },
      { color: "Heather Grey", colorCode: "#8e8e89", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Optic White", colorCode: "#fcfcfc", image: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg" },
      { color: "Forest Green", colorCode: "#273628", image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg" },
      { color: "Washet Slate", colorCode: "#393d45", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Rust Terracotta", colorCode: "#7d4131", image: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-boxy-hoodie-alt.jpg" }
    ],
    description: "Versatile 400 GSM 3-end fleece hoodie engineered for year-round brand drops. Offers balanced body drape with reinforced shoulder tape and twin-needle armhole stitching.",
    features: [
      "Twin-needle coverstitching on neck, armholes, and waist",
      "Smooth tightly-knit face for photorealistic DTG and screen printing",
      "Pre-shrunk reactive-dyed fabric with colorfast guarantee",
      "Unbranded neck yoke designed for screen-printed size tags"
    ]
  }),

  // --------------------------------------------------------------------------
  // 03. 460 GSM Heavyweight Full-Zip Blank Hoodie (ZIP HOODIES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-03",
    slug: "460-gsm-heavyweight-full-zip-hoodie",
    name: "460 GSM Heavyweight Full-Zip Blank Hoodie",
    category: "ZIP HOODIES",
    gsm: "460 GSM",
    fabric: "100% Combed Cotton Heavy Fleece",
    fit: "Oversized Streetwear Drop Shoulder",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Onyx Black",
    variants: [
      { color: "Onyx Black", colorCode: "#111111", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" },
      { color: "Heather Grey", colorCode: "#8c8c87", image: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#2b2b2b", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" },
      { color: "Bone White", colorCode: "#f2efe9", image: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg" },
      { color: "Vintage Navy", colorCode: "#18202d", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" },
      { color: "Desert Khaki", colorCode: "#695945", image: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg" }
    ],
    description: "Full-zip heavyweight blank hoodie featuring custom chunky metal hardware, double-layered hood, and split kangaroo pockets with heavy bar-tacks.",
    features: [
      "Heavy gauge metal front zipper with anti-snag cotton tape",
      "Double-layered structured hood that holds its shape unzipped",
      "Split pouch pocket with bar-tack reinforcements",
      "Tear-away satin neck label ready for relabeling"
    ]
  }),

  // --------------------------------------------------------------------------
  // 04. 380 GSM Cropped Boxy Zip Hoodie (ZIP HOODIES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-04",
    slug: "380-gsm-cropped-boxy-zip-hoodie",
    name: "380 GSM Cropped Boxy Zip Blank Hoodie",
    category: "ZIP HOODIES",
    gsm: "380 GSM",
    fabric: "100% Ring-Spun Cotton French Terry",
    fit: "Wide-Body Cropped Length Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#101010", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" },
      { color: "Chalk White", colorCode: "#f9f8f5", image: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg" },
      { color: "Faded Washed Black", colorCode: "#272727", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" },
      { color: "Olive Drab", colorCode: "#394034", image: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-alt.jpg" },
      { color: "Heather Oatmeal", colorCode: "#d4cebe", image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg", zoomImage: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg" }
    ],
    description: "Modern cropped streetwear cut tailored with wide armholes, dropped shoulders, and a raw or banded cropped waistline. Built for high-waisted styling.",
    features: [
      "Cropped torso length with wide chest width",
      "Antiqued silver metal two-way zipper",
      "Wide rib cuffs with thumbhole option",
      "Uncorded minimal hood"
    ]
  }),

  // --------------------------------------------------------------------------
  // 05. 260 GSM Vintage Cut Heavy Blank T-Shirt (T-SHIRTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-05",
    slug: "260-gsm-vintage-cut-heavy-t-shirt",
    name: "260 GSM Vintage Cut Heavy Blank T-Shirt",
    category: "T-SHIRTS",
    gsm: "260 GSM",
    fabric: "100% Organic Open-End Cotton",
    fit: "Boxy Relaxed Torso & Elbow-Length Sleeves",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Jet Black",
    variants: [
      { color: "Jet Black", colorCode: "#141414", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Optic White", colorCode: "#f8f8f8", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Washed Slate Grey", colorCode: "#3e424b", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Raw Unbleached Ecru", colorCode: "#ebe6db", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Mocha Brown", colorCode: "#463830", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Vintage Navy", colorCode: "#1c2635", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Pine Green", colorCode: "#253828", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" }
    ],
    description: "Classic high-density knit blank t-shirt featuring a structured 1.25-inch ribbed collar that holds its neckline post-wash. Tailored with a wide relaxed torso and dropped armholes.",
    features: [
      "1.25-inch high-density ribbed neckband with twin-needle collar topstitch",
      "Pre-shrunk fabric to minimize post-wash dimensional shift",
      "Ultra-smooth single jersey surface optimized for screen and DTG prints",
      "Tear-away interior care label ready for screen-printed branding"
    ]
  }),

  // --------------------------------------------------------------------------
  // 06. 220 GSM Relaxed Everyday Blank T-Shirt (T-SHIRTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-06",
    slug: "220-gsm-relaxed-everyday-t-shirt",
    name: "220 GSM Relaxed Everyday Blank T-Shirt",
    category: "T-SHIRTS",
    gsm: "220 GSM",
    fabric: "100% Combed Compact Ring-Spun Cotton",
    fit: "Classic Street-Casual Relaxed Fit",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Core Black",
    variants: [
      { color: "Core Black", colorCode: "#121212", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Pure White", colorCode: "#ffffff", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Heather Grey", colorCode: "#91918c", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Muted Sage", colorCode: "#495746", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Faded Burgundy", colorCode: "#5e2b34", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Desert Sand", colorCode: "#d1c2a5", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Royal Navy", colorCode: "#172338", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" }
    ],
    description: "The ideal foundational mid-heavyweight tee. Soft handfeel with tight compact yarn knitting to resist pilling and deliver vibrant screen print ink saturation.",
    features: [
      "1-inch rib collar with bound back neck tape",
      "Blind-stitched sleeve cuffs and bottom hem",
      "Side-seam construction for superior fit retention",
      "High yarn count for soft luxury handfeel"
    ]
  }),

  // --------------------------------------------------------------------------
  // 07. 280 GSM Oversized Luxury Streetwear Tee (OVERSIZED TEES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-07",
    slug: "280-gsm-oversized-luxury-streetwear-tee",
    name: "280 GSM Oversized Luxury Streetwear Blank Tee",
    category: "OVERSIZED TEES",
    gsm: "280 GSM",
    fabric: "100% Combed Cotton Heavy Single Jersey",
    fit: "Exaggerated Drop-Shoulder & Wide Box Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#0f0f0f", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Chalk White", colorCode: "#f9f9f9", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" },
      { color: "Washed Ash Grey", colorCode: "#44464c", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Muted Sand", colorCode: "#d5c5ad", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#2e2e2e", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Dusty Olive", colorCode: "#3e4739", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" },
      { color: "Coffee Brown", colorCode: "#3f2e24", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" }
    ],
    description: "Exaggerated boxy streetwear silhouette with substantial body drape. Designed specifically for oversized graphics, back prints, and luxury private label programs.",
    features: [
      "Seamless drop shoulder cutting creating natural drape",
      "1.3-inch dense neck rib that maintains structure over time",
      "Quarter-turned body fabric to eliminate center crease lines",
      "Blind hem stitch finish for high-end aesthetic"
    ]
  }),

  // --------------------------------------------------------------------------
  // 08. 320 GSM Super Heavyweight Drop-Shoulder Tee (OVERSIZED TEES)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-08",
    slug: "320-gsm-super-heavyweight-drop-shoulder-tee",
    name: "320 GSM Super Heavyweight Blank Tee",
    category: "OVERSIZED TEES",
    gsm: "320 GSM",
    fabric: "100% Carded & Combed Double-Interlock Cotton",
    fit: "Architectural Ultra-Boxy Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Deep Black",
    variants: [
      { color: "Deep Black", colorCode: "#0a0a0a", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Bone Ecru", colorCode: "#f2ece0", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" },
      { color: "Vintage Slate", colorCode: "#373a42", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Washed Taupe", colorCode: "#857c72", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" },
      { color: "Forest Green", colorCode: "#243323", image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg" },
      { color: "Vintage Navy", colorCode: "#182130", image: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg", zoomImage: "/media/blanks/oversized-luxury-streetwear-tee-alt.jpg" }
    ],
    description: "Our heaviest t-shirt blank. Engineered with double-interlock knit construction that stands off the body without clinging, providing an architectural garment silhouette.",
    features: [
      "Ultra-dense 320 GSM double interlock knit",
      "High-neck 1.4-inch ribbed collar",
      "Reinforced twin-needle shoulder seam tape",
      "Heavily enzyme washed for smooth zero-fuzz surface"
    ]
  }),

  // --------------------------------------------------------------------------
  // 09. 400 GSM Loopback Heavy Blank Crewneck (SWEATSHIRTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-09",
    slug: "400-gsm-loopback-heavy-crewneck",
    name: "400 GSM Loopback Heavy Blank Crewneck",
    category: "SWEATSHIRTS",
    gsm: "400 GSM",
    fabric: "100% French Terry Loopback Cotton",
    fit: "Classic Athletic Boxy Fit",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#111111", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Heather Grey", colorCode: "#8c8c88", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Bone White", colorCode: "#f1ede4", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Vintage Navy", colorCode: "#1b2533", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Olive Green", colorCode: "#3b4539", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Washed Charcoal", colorCode: "#2a2a2a", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" }
    ],
    description: "Unbranded premium loopback French terry crewneck with flatlock seams and underarm diamond gusseting. Form-retaining structure with comfortable breathability.",
    features: [
      "Underarm diamond gusset ribbing for flexible mobility",
      "Flatlock twin-needle structural stitching throughout",
      "Enzyme-washed loopback interior for soft skin contact",
      "Clean unbranded interior collar ready for heat-seal or woven labels"
    ]
  }),

  // --------------------------------------------------------------------------
  // 10. 450 GSM Brushed Fleece Raglan Sweatshirt (SWEATSHIRTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-10",
    slug: "450-gsm-brushed-fleece-raglan-sweatshirt",
    name: "450 GSM Brushed Fleece Raglan Sweatshirt",
    category: "SWEATSHIRTS",
    gsm: "450 GSM",
    fabric: "100% Combed Cotton Brushed Back Fleece",
    fit: "Vintage Raglan Sleeve Athletic Cut",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Carbon Black",
    variants: [
      { color: "Carbon Black", colorCode: "#141414", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Athletic Grey", colorCode: "#858580", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Oatmeal Heather", colorCode: "#dfd9cc", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Deep Maroon", colorCode: "#53222a", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" },
      { color: "Washed Olive", colorCode: "#373e34", image: "/media/blanks/loopback-blank-crewneck-main.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-main.jpg" },
      { color: "Vintage Navy", colorCode: "#192231", image: "/media/blanks/loopback-blank-crewneck-alt.jpg", zoomImage: "/media/blanks/loopback-blank-crewneck-alt.jpg" }
    ],
    description: "Heritage raglan-sleeve blank crewneck sweatshirt crafted from thick brushed cotton fleece. Featuring a V-insert neck triangle and heavy 2x2 ribbing.",
    features: [
      "Traditional raglan sleeve diagonal seams",
      "V-stitch triangle ribbed neck insert",
      "Plush brushed-back fleece interior",
      "Reinforced flatlock seam durability"
    ]
  }),

  // --------------------------------------------------------------------------
  // 11. 420 GSM Heavy Fleece Baggy Sweat Pants (BAGGY SWEAT PANTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-11",
    slug: "420-gsm-heavy-fleece-baggy-sweat-pants",
    name: "420 GSM Heavy Fleece Baggy Sweat Pants",
    category: "BAGGY SWEAT PANTS",
    gsm: "420 GSM",
    fabric: "100% Combed Cotton Heavy Fleece",
    fit: "Wide-Leg Relaxed Baggy Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#121212", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Bone Off-White", colorCode: "#f0ece3", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#292929", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Dark Olive", colorCode: "#2d362b", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Vintage Navy", colorCode: "#1b2432", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Mocha Brown", colorCode: "#3f3027", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" }
    ],
    description: "Engineered specifically for luxury streetwear brands seeking an authentic wide-leg drape without tapered ankle cuffs. Features deep welt pockets, a thick gathered waistband, and heavy cotton drawcords.",
    features: [
      "Deep front welt pockets with reinforced jersey pocket bags",
      "Concealed rear welt pocket with bar-tack reinforcement",
      "Heavy elastic waistband with internal/external tonal drawcords",
      "Open wide-leg bottom hem with premium drape",
      "Dye-lot matched to GTT Heavyweight Blank Hoodies"
    ]
  }),

  // --------------------------------------------------------------------------
  // 12. 380 GSM Wide-Leg Open-Hem Sweat Pants (BAGGY SWEAT PANTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-12",
    slug: "380-gsm-wide-leg-open-hem-sweat-pants",
    name: "380 GSM Wide-Leg Open-Hem Sweat Pants",
    category: "BAGGY SWEAT PANTS",
    gsm: "380 GSM",
    fabric: "100% French Terry Loopback Cotton",
    fit: "Fluid Wide-Leg Drape with Raw/Clean Hem",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Jet Black",
    variants: [
      { color: "Jet Black", colorCode: "#101010", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Heather Grey", colorCode: "#8f8f8b", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Raw Ecru", colorCode: "#ebe4d8", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Faded Washed Black", colorCode: "#272727", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Vintage Sage", colorCode: "#4a5446", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Navy Blue", colorCode: "#172130", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" }
    ],
    description: "Lighter French terry wide-leg sweat pants designed for breathable indoor/outdoor layering. Styled with a loose floor-pooling hem and flat braided drawcords.",
    features: [
      "Open straight leg bottom cuff for clean sneaker stacking",
      "Seamless side construction for uninhibited graphic prints",
      "Internal flat drawcord with brass metal eyelets",
      "Breathable unbrushed loopback back"
    ]
  }),

  // --------------------------------------------------------------------------
  // 13. 360 GSM Cuffed Heavy Fleece Jogger Pants (SWEAT PANTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-13",
    slug: "360-gsm-cuffed-heavy-fleece-jogger-pants",
    name: "360 GSM Cuffed Heavy Fleece Jogger Pants",
    category: "SWEAT PANTS",
    gsm: "360 GSM",
    fabric: "80% Cotton / 20% Polyester Anti-Pilling Fleece",
    fit: "Tapered Streetwear Fit with Elastic Cuffs",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#111111", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Athletic Grey", colorCode: "#8b8b86", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Charcoal Heather", colorCode: "#323232", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Bone White", colorCode: "#f3f0e8", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Navy", colorCode: "#1b2533", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Olive", colorCode: "#343d31", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" }
    ],
    description: "Classic fitted athletic jogger with heavy ribbed ankle cuffs and gusseted crotch paneling for enhanced flexibility.",
    features: [
      "2.5-inch elasticated ribbed ankle cuffs",
      "Ergonomic saddle crotch gusset",
      "Zippered right rear security pocket",
      "Chunky ribbed waistband with tonal drawcord"
    ]
  }),

  // --------------------------------------------------------------------------
  // 14. 400 GSM Double-Knee Heavy Sweat Pants (SWEAT PANTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-14",
    slug: "400-gsm-double-knee-heavy-sweat-pants",
    name: "400 GSM Double-Knee Heavy Sweat Pants",
    category: "SWEAT PANTS",
    gsm: "400 GSM",
    fabric: "100% Heavy Combed Cotton Fleece with Reinforced Twill Panels",
    fit: "Relaxed Workwear-Street Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#0f0f0f", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Washed Charcoal", colorCode: "#2d2d2d", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Dark Moss Green", colorCode: "#293226", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" },
      { color: "Raw Canvas Ecru", colorCode: "#ede6d8", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-alt.jpg" },
      { color: "Vintage Brown", colorCode: "#48362b", image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg", zoomImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg" }
    ],
    description: "Workwear-inspired blank sweat pants engineered with double-layer reinforced knee panels and utility hammer loop detailing.",
    features: [
      "Reinforced double-knee topstitched panel overlay",
      "Heavy-duty cotton drill pocket bags",
      "Utility tool pocket on right thigh",
      "Custom metal rivets at stress points"
    ]
  }),

  // --------------------------------------------------------------------------
  // 15. 380 GSM Heavy French Terry Blank Shorts (SHORTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-15",
    slug: "380-gsm-heavy-french-terry-shorts",
    name: "380 GSM Heavy French Terry Blank Shorts",
    category: "SHORTS",
    gsm: "380 GSM",
    fabric: "100% Combed French Terry Cotton",
    fit: "Relaxed Above-Knee Streetwear Cut",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Onyx Black",
    variants: [
      { color: "Onyx Black", colorCode: "#131313", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" },
      { color: "Vintage Heather Grey", colorCode: "#949490", image: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg" },
      { color: "Raw Ecru", colorCode: "#ebe6dc", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" },
      { color: "Vintage Washed Navy", colorCode: "#1d2532", image: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg" },
      { color: "Olive", colorCode: "#3b4437", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" },
      { color: "Washed Clay", colorCode: "#6b4a3f", image: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg" }
    ],
    description: "Heavyweight warm-weather streetwear blank shorts crafted with premium diagonal loopback terry. Designed with an above-the-knee silhouette, deep side welt pockets, and reinforced side slits.",
    features: [
      "Heavy gathered ribbed waistband with round cotton drawstrings",
      "Dual deep side welt pockets and right-rear patch pocket",
      "Twin-needle bottom hem with subtle side seam slit",
      "Durable loopback construction resistant to pilling"
    ]
  }),

  // --------------------------------------------------------------------------
  // 16. 340 GSM Raw-Edge Fleece Drop Shorts (SHORTS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-16",
    slug: "340-gsm-raw-edge-fleece-drop-shorts",
    name: "340 GSM Raw-Edge Fleece Drop Shorts",
    category: "SHORTS",
    gsm: "340 GSM",
    fabric: "100% Combed Cotton Brushed Back Fleece",
    fit: "Dropped Inseam with Raw Cut Hem",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Jet Black",
    variants: [
      { color: "Jet Black", colorCode: "#111111", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" },
      { color: "Oatmeal Heather", colorCode: "#ded7c8", image: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg" },
      { color: "Washed Slate", colorCode: "#3b3f49", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" },
      { color: "Bone Off-White", colorCode: "#f2ece0", image: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-alt.jpg" },
      { color: "Faded Olive", colorCode: "#3d4637", image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg", zoomImage: "/media/blanks/french-terry-heavyweight-shorts-main.jpg" }
    ],
    description: "Relaxed streetwear fleece shorts featuring an unhemmed raw-edge leg opening with safety lockstitch to prevent fraying past the intended aesthetic.",
    features: [
      "Lockstitched raw edge hem designed to roll naturally",
      "Extra-long cream drawcords with dipped silicone tips",
      "Deep front pockets suitable for oversized smartphones",
      "Soft brushed interior fleece"
    ]
  }),

  // --------------------------------------------------------------------------
  // 17. 250 GSM Cropped Sleeveless Boxy Shirt (CROPPED & SLEEVELESS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-17",
    slug: "250-gsm-cropped-sleeveless-boxy-shirt",
    name: "250 GSM Cropped Sleeveless Boxy Blank Shirt",
    category: "CROPPED & SLEEVELESS",
    gsm: "250 GSM",
    fabric: "100% Heavy Combed Cotton Jersey",
    fit: "Wide-Shoulder Cropped Boxy Cut",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Onyx Black",
    variants: [
      { color: "Onyx Black", colorCode: "#111111", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" },
      { color: "Optic White", colorCode: "#fbfbfb", image: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#2f2f2f", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" },
      { color: "Faded Olive", colorCode: "#3a4136", image: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg" },
      { color: "Raw Ecru", colorCode: "#ede6da", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" },
      { color: "Vintage Slate", colorCode: "#3a3d46", image: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg" }
    ],
    description: "Contemporary fashion-forward cropped muscle tee featuring wide shoulder caps, relaxed armholes, and a modern cropped waistline designed for high-waisted styling and layering.",
    features: [
      "Extended shoulder coverage with clean bound armholes",
      "Relaxed ribbed crew neckline",
      "Slightly cropped waistline with clean double-needle hem",
      "Pre-washed combed cotton jersey with zero side twist"
    ]
  }),

  // --------------------------------------------------------------------------
  // 18. 240 GSM Raw Cut Heavy Muscle Tank (CROPPED & SLEEVELESS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-18",
    slug: "240-gsm-raw-cut-heavy-muscle-tank",
    name: "240 GSM Raw Cut Heavy Blank Muscle Tank",
    category: "CROPPED & SLEEVELESS",
    gsm: "240 GSM",
    fabric: "100% Combed Single Jersey Cotton",
    fit: "Relaxed Muscle Cut with Deep Armholes",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Deep Black",
    variants: [
      { color: "Deep Black", colorCode: "#0d0d0d", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" },
      { color: "Bone White", colorCode: "#f3efe6", image: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg" },
      { color: "Washed Ash", colorCode: "#4a4b50", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" },
      { color: "Earth Brown", colorCode: "#4c392c", image: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-alt.jpg" },
      { color: "Vintage Navy", colorCode: "#1a2434", image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg", zoomImage: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg" }
    ],
    description: "Athletic bodybuilding & streetwear muscle tank featuring dropped raw armholes and a curved droptail hemline.",
    features: [
      "Low-cut armholes for complete mobility",
      "Coverstitched crew neckline with back neck tape",
      "Curved front and rear droptail hem",
      "Single jersey knit with reactive dyeing"
    ]
  }),

  // --------------------------------------------------------------------------
  // 19. 280 GSM Heavyweight Drop-Shoulder Long Sleeve Shirt (LONG SLEEVE)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-19",
    slug: "280-gsm-heavyweight-drop-shoulder-long-sleeve",
    name: "280 GSM Heavyweight Drop-Shoulder Long Sleeve",
    category: "LONG SLEEVE",
    gsm: "280 GSM",
    fabric: "100% Combed Cotton Heavy Jersey",
    fit: "Oversized Streetwear Boxy Long Sleeve",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Jet Black",
    variants: [
      { color: "Jet Black", colorCode: "#121212", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Optic White", colorCode: "#f8f8f8", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Washed Charcoal", colorCode: "#313131", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Vintage Navy", colorCode: "#192230", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Sand Ecru", colorCode: "#ebe4d5", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Faded Olive", colorCode: "#384133", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" }
    ],
    description: "Heavyweight long sleeve blank shirt with structured 2x2 ribbed sleeve cuffs and a thick crew collar. Built for heavy forearm and sleeve screen printing.",
    features: [
      "Heavy 2x2 ribbed wrist cuffs that retain elasticity",
      "Seamless tubular body option or tailored side seams",
      "Drop shoulder design creating relaxed sleeve stacks",
      "Reinforced collar tape preventing neckline deformation"
    ]
  }),

  // --------------------------------------------------------------------------
  // 20. 320 GSM Mock Neck Heavy Long Sleeve Tee (LONG SLEEVE)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-20",
    slug: "320-gsm-mock-neck-heavy-long-sleeve",
    name: "320 GSM Mock Neck Heavy Long Sleeve Blank",
    category: "LONG SLEEVE",
    gsm: "320 GSM",
    fabric: "100% Double-Knit Interlock Cotton",
    fit: "High-Neck Boxy Architectural Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#0f0f0f", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Chalk White", colorCode: "#faf8f4", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Washed Slate Grey", colorCode: "#3a3d46", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Mocha Brown", colorCode: "#433328", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Deep Navy", colorCode: "#151e2b", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" }
    ],
    description: "Elevated streetwear mock neck blank with a 2-inch standing collar and dense interlock knit body. Delivers high-end editorial presence under jackets and vests.",
    features: [
      "2-inch standing ribbed mock neck collar with elastane",
      "Double-needle sleeve and body hems",
      "Clean minimalist appearance without exterior branding",
      "Dense, substantial weight providing cold-weather warmth"
    ]
  }),

  // --------------------------------------------------------------------------
  // 21. 300 GSM Heavyweight Thermal Waffle Long Sleeve (LONG SLEEVE)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-21",
    slug: "300-gsm-heavyweight-thermal-waffle-long-sleeve",
    name: "300 GSM Heavy Thermal Waffle Blank Shirt",
    category: "LONG SLEEVE",
    gsm: "300 GSM",
    fabric: "100% Combed Cotton Honeycomb Waffle Knit",
    fit: "Relaxed Thermal Layering Fit",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Core Black",
    variants: [
      { color: "Core Black", colorCode: "#101010", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Natural Ecru", colorCode: "#ede6d7", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Heather Grey", colorCode: "#8e8e89", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Vintage Olive", colorCode: "#394134", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Charcoal", colorCode: "#2b2b2b", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Navy", colorCode: "#192333", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" }
    ],
    description: "Chunky textured waffle-knit blank long sleeve thermal. Traps heat while offering rich surface texture for garment dyeing, mineral washing, and chest embroidery.",
    features: [
      "Deep 3D honeycomb waffle knit structure",
      "Wide rib cuffs and collar with shape recovery",
      "Pre-shrunk cotton yarn ensuring minimal thermal shrinkage",
      "Clean flatlock seam finishing"
    ]
  }),

  // --------------------------------------------------------------------------
  // 22. 380 GSM Minimalist Zip Canvas Blank Jacket (JACKETS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-22",
    slug: "380-gsm-minimalist-zip-canvas-jacket",
    name: "380 GSM Minimalist Zip Canvas Blank Jacket",
    category: "JACKETS",
    gsm: "380 GSM / 12 oz",
    fabric: "100% Heavy Cotton Duck Canvas",
    fit: "Relaxed Boxy Workwear Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Pitch Black",
    variants: [
      { color: "Pitch Black", colorCode: "#101010", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Washed Espresso Brown", colorCode: "#32231b", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Desert Tan", colorCode: "#6c5844", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Vintage Navy", colorCode: "#1a222f", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Dark Olive", colorCode: "#2d352b", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" }
    ],
    description: "An unbranded minimalist workwear jacket blank built with heavy combed cotton duck canvas, solid metal YKK zip closure, and unbranded interior lining prepared for client embroidery or patch application.",
    features: [
      "Chunky metal two-way center zipper (YKK or custom hardware)",
      "Point collar with heavy interfacing",
      "Deep dual slant hand pockets and interior chest pocket",
      "Adjustable snap-button cuffs and waistband tabs",
      "Unbranded neck yoke ready for leather or woven brand patch"
    ]
  }),

  // --------------------------------------------------------------------------
  // 23. 340 GSM Snap-Button Nylon Coach Jacket Blank (JACKETS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-23",
    slug: "340-gsm-snap-button-nylon-coach-jacket",
    name: "340 GSM Snap-Button Nylon Blank Coach Jacket",
    category: "JACKETS",
    gsm: "340 GSM Composite",
    fabric: "High-Density Taslan Nylon Shell with Cotton Jersey Lining",
    fit: "Relaxed Streetwear Windbreaker Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Matte Black",
    variants: [
      { color: "Matte Black", colorCode: "#131313", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Forest Green", colorCode: "#202e21", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Deep Navy", colorCode: "#16202e", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Burgundy Maroon", colorCode: "#491c24", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Slate Grey", colorCode: "#434751", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" }
    ],
    description: "Classic streetwear coach jacket featuring a water-resistant matte taslan shell, soft cotton jersey interior lining, color-matched snap buttons, and bottom hem drawcords.",
    features: [
      "Matte water-repellent windproof taslan nylon",
      "Dye-matched enamel metal snap button closure",
      "Elasticated wrist cuffs and adjustable drawstring waistband",
      "Internal chest embroidery zipper access port"
    ]
  }),

  // --------------------------------------------------------------------------
  // 24. 420 GSM Heavy Cotton Twill Workwear Overshirt (JACKETS)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-24",
    slug: "420-gsm-heavy-cotton-twill-workwear-overshirt",
    name: "420 GSM Heavy Cotton Twill Blank Overshirt",
    category: "JACKETS",
    gsm: "420 GSM",
    fabric: "100% Heavy Combed Cotton Twill",
    fit: "Boxy Layering Shacket Cut",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Coal Black",
    variants: [
      { color: "Coal Black", colorCode: "#111111", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Khaki Sand", colorCode: "#a39379", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Washed Navy", colorCode: "#1b2535", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" },
      { color: "Olive Drab", colorCode: "#373e33", image: "/media/blanks/minimal-zip-work-jacket-alt.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-alt.jpg" },
      { color: "Tobacco Brown", colorCode: "#533e2b", image: "/media/blanks/minimal-zip-work-jacket-main.jpg", zoomImage: "/media/blanks/minimal-zip-work-jacket-main.jpg" }
    ],
    description: "Substantial workwear shacket blank equipped with dual chest flap pockets with concealed button closures, structured point collar, and heavy twin-needle topstitching.",
    features: [
      "Dual chest patch pockets with reinforced flap closures",
      "Durable heavyweight twill weave resistant to tearing",
      "Heavy horn-style buttons with reinforced stitch anchors",
      "Straight boxy hem suitable for overshirt layering"
    ]
  }),

  // --------------------------------------------------------------------------
  // 25. 260 GSM Heavy Knit Boxy Polo Shirt (MORE)
  // --------------------------------------------------------------------------
  createBlankProduct({
    id: "gtt-blank-25",
    slug: "260-gsm-heavy-knit-boxy-polo-shirt",
    name: "260 GSM Heavy Knit Boxy Blank Polo Shirt",
    category: "MORE",
    gsm: "260 GSM",
    fabric: "100% Combed Pique / Interlock Cotton",
    fit: "Boxy Modern Streetwear Polo Silhouette",
    sampleMOQ: 3,
    bulkMOQ: 45,
    defaultColor: "Onyx Black",
    variants: [
      { color: "Onyx Black", colorCode: "#121212", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Bone White", colorCode: "#f3efe8", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Vintage Navy", colorCode: "#182131", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" },
      { color: "Forest Green", colorCode: "#243224", image: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-alt.jpg" },
      { color: "Mocha Brown", colorCode: "#433429", image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg", zoomImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg" }
    ],
    description: "Contemporary fashion-forward blank polo tailored with a relaxed open Johnny collar or minimal button placket, drop shoulders, and side split hemline.",
    features: [
      "High-density cotton knit that drapes cleanly",
      "Minimalist knit collar that lays flat without curling",
      "Clean side split seams with internal herringbone tape reinforcement",
      "Ready for subtle chest embroidery or direct private relabeling"
    ]
  })
];

// Backwards compatibility catalogue alias for any legacy consumers
export const BLANKS_CATALOG = BLANK_PRODUCTS.map(p => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  gsm: p.gsm,
  composition: p.fabric,
  fit: p.fit,
  sampleMOQ: p.sampleMOQ,
  bulkMOQ: p.bulkMOQ,
  features: p.features,
  colors: p.colours.map(c => c.name),
  image: p.colours[0]?.image || p.images[0]
}));

export const BLANK_SERVICES = [
  { title: "Custom Relabeling", desc: "Precision stitching of your woven neck labels, care tags, and hem clamp tabs." },
  { title: "Screen & DTF Printing", desc: "High-density puff, water-based, plastisol, and DTF printing prior to packaging." },
  { title: "Custom Packaging", desc: "Folding, barcode labeling, and insertion into custom branded zip polybags." },
  { title: "Fast Sample Turnaround", desc: "Stock blanks are prepared and dispatched with expedited sampling timelines." }
];

export const BLANK_TRANSFORMATION_STAGES = [
  {
    step: "01",
    id: "blank",
    title: "BLANK",
    eyebrow: "STAGE 01 // SILHOUETTE SELECTION",
    heading: "Start with the Perfect Blank",
    description: "Select your desired silhouette from our extensive blanks collection. Choose from heavyweight boxy hoodies, vintage-cut tees, or baggy sweat pants engineered with premium drape and unbranded construction.",
    highlight: "Unbranded Garment Base",
    actionLabel: "Choose Silhouette",
    visualTone: "Natural Unbleached Cotton / Raw Blank State",
    image: "/media/blanks/stage-01-blank.jpg"
  },
  {
    step: "02",
    id: "colour",
    title: "CHOOSE YOUR COLOUR",
    eyebrow: "STAGE 02 // COLOURWAY & DYE",
    heading: "Custom Pantone & Stock Shades",
    description: "Every GTT blank is available across our curated stock monochrome palette, or can be lab-dip dyed to your exact Pantone specification or vintage wash treatment.",
    highlight: "Infinite Palette & Lab Dips",
    actionLabel: "Select Colour",
    visualTone: "Rich Saturated Tones & Mineral Washes",
    image: "/media/blanks/stage-02-colour.jpg"
  },
  {
    step: "03",
    id: "branding",
    title: "ADD YOUR BRANDING",
    eyebrow: "STAGE 03 // GRAPHICS & APPLICATION",
    heading: "High-Density Prints & Embroidery",
    description: "Apply your logos, typography, and artwork. Choose between 3D puff embroidery, high-definition DTF transfers, jumbo screen prints, or subtle tonal micro-embroidery.",
    highlight: "Precision Print & Stitch Fidelity",
    actionLabel: "Apply Artwork",
    visualTone: "Industrial Tajima Embroidery & Micro Detail",
    image: "/media/blanks/stage-03-branding.jpg"
  },
  {
    step: "04",
    id: "details",
    title: "ADD DETAILS",
    eyebrow: "STAGE 04 // TRIMS & LABELS",
    heading: "Private Label Hardware & Tags",
    description: "Replace standard tear-away tags with your custom high-density woven neck labels, satin wash tags, branded metal aglets, embossed leather patches, and custom hangtags.",
    highlight: "100% Private Label Specification",
    actionLabel: "Add Trims",
    visualTone: "Woven Damask Labels & Custom Hangtags",
    image: "/media/blanks/stage-04-details.jpg"
  },
  {
    step: "05",
    id: "package",
    title: "PACKAGE IT",
    eyebrow: "STAGE 05 // RETAIL PACKAGING",
    heading: "Retail-Ready Packaging & Presentation",
    description: "Each garment is professionally steam-pressed, folded, tagged with your branded hangtag and barcode, and sealed into frosted ziplock polybags ready for boutique retail or 3PL e-commerce fulfillment.",
    highlight: "E-Commerce & Retail Ready",
    actionLabel: "Brand Packaging",
    visualTone: "Custom Frosted Zip Bags & Barcode Labels",
    image: "/media/blanks/stage-05-package.jpg"
  },
  {
    step: "06",
    id: "launch",
    title: "READY TO LAUNCH",
    eyebrow: "STAGE 06 // MARKET ROLLOUT",
    heading: "Your Finished Branded Product",
    description: "What began as an unbranded blank is now an original, fully branded product ready to photograph, market, drop, and sell to your audience.",
    highlight: "Complete Brand Experience",
    actionLabel: "Launch Collection",
    visualTone: "Finished Lookbook & High-Fashion Launch",
    image: "/media/blanks/blanks-hero-bg.jpg"
  }
];

export const BLANK_EDITORIAL_FEATURES = [
  {
    number: "01",
    title: "START WITH THE RIGHT BLANK",
    description: "Choose the exact silhouette, weight, and cut that aligns with your product vision—without compromising on drape or construction."
  },
  {
    number: "02",
    title: "MAKE IT YOURS",
    description: "Add your custom colours, prints, embroidery, bespoke labels, and branded hardware with factory direct precision."
  },
  {
    number: "03",
    title: "BUILD A COMPLETE PRODUCT",
    description: "Turn an unbranded blank into a fully finished, high-end retail garment tailored to your brand's exacting standards."
  },
  {
    number: "04",
    title: "READY TO LAUNCH",
    description: "Seamlessly connect your products with custom packaging, barcode labeling, and global logistics ready for customer delivery."
  }
];

export const WHY_GTT_BLANKS = [
  {
    title: "25+ FOUNDATIONAL SILHOUETTES",
    desc: "From 460 GSM boxy hoodies to vintage tees, wide-leg sweat pants, and minimal canvas workwear jackets, access every blank silhouette."
  },
  {
    title: "CURATED MULTI-COLOUR PALETTES",
    desc: "Every blank product supports 5 to 7 rich earth tones, neutrals, and deep shades, backed by custom Pantone dye milling."
  },
  {
    title: "LOW MINIMUM ORDER QUANTITIES",
    desc: "Sample MOQ from 3 pieces for physical fit and print testing; bulk production from 45 pieces per style/colorway."
  },
  {
    title: "HIGH-RESOLUTION FABRIC FIDELITY",
    desc: "Inspect needle count, French terry loop density, rib elasticity, and collar tape construction before placing orders."
  },
  {
    title: "FULL PRIVATE LABEL FINISHING",
    desc: "Tear-away satin tags, custom woven neck tags, hem tabs, branded drawcords, and custom frosted zip packaging."
  }
];

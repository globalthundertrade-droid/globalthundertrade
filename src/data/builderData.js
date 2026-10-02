/**
 * CENTRALIZED PRODUCT CONFIGURATOR DATA — GLOBAL THUNDER TRADE
 * 
 * Each product defines:
 * - Product-specific silhouette metadata
 * - Relevant customization controls (dynamic display per product)
 * - Specific fabric compositions, GSM weights, fit silhouettes, and color palettes
 * - Specialized finishing (embroidery, printing, hardware, patches, washes, packaging)
 */

export const BUILDER_PRODUCTS = [
  {
    id: "hoodie",
    name: "Heavyweight Hoodie",
    category: "Streetwear",
    tagline: "460 GSM Boxy Drop-Shoulder Fleece",
    baseColor: "#111111",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "embellishments", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["460 GSM Diagonal French Terry", "420 GSM 100% Combed Fleece", "500 GSM Ultra-Heavy Cotton Fleece", "Organic Heavy French Terry"],
    availableGsm: ["380 GSM Mid-Heavy", "420 GSM Heavyweight", "460 GSM Luxury Standard", "500 GSM Double-Faced"],
    availableFits: ["Oversized Boxy", "Relaxed Drop Shoulder", "True To Size Athletic"],
    availableColors: [
      { name: "Onyx Black", hex: "#111111" },
      { name: "Bone White", hex: "#f3f0e8" },
      { name: "Charcoal Grey", hex: "#2b2b2b" },
      { name: "Vintage Washed Navy", hex: "#1c2533" },
      { name: "Army Olive", hex: "#343d31" },
      { name: "Muted Clay", hex: "#63473b" }
    ],
    availablePrint: ["None", "Jumbo Front Screen Print", "DTF Chest & Back Print", "3D Puff Screen Print (Chest)", "Water-Based Discharge Print"],
    availableEmbroidery: ["None", "3D Puff Embroidery (Center Chest)", "Flat Satin Stitch (Left Chest)", "Arch Hood Embroidery", "Tonal Sleeve Monogram"],
    availableEmbellishments: ["None", "Hotfix Rhinestones (Chest/Sleeve)", "Distressed Edge Grinding", "Kangaroo Pocket Metal Rivets"],
    availableLabels: ["Custom High-Density Woven Neck Label", "Woven Hem Clamp Label", "Heat Transfer Printed Tag"],
    availableTags: ["Matte Black 700 GSM Hangtag", "Embossed Cardstock with Safety Pin", "Foil-Stamped Specialty Tag"],
    availableWashes: ["Raw Factory Finish", "Vintage Acid Wash", "Enzyme Silicone Wash", "Sun-Bleached Faded Wash"],
    availablePackaging: ["Frosted Branded Ziplock Polybag", "Custom Heavy Kraft Gift Box", "Recycled Biodegradable Bag"],
    mockupImage: "/media/blanks/heavyweight-boxy-hoodie-main.jpg"
  },
  {
    id: "tshirt",
    name: "Boxy Vintage T-Shirt",
    category: "Streetwear",
    tagline: "280 GSM Single Jersey with 1.25\" Ribbed Collar",
    baseColor: "#151515",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["280 GSM Combed Single Jersey", "240 GSM Open-End Heavy Cotton", "320 GSM Interlock Double Knit", "Organic Ring-Spun Cotton"],
    availableGsm: ["240 GSM Everyday Heavy", "280 GSM Luxury Streetwear", "320 GSM Structure Heavy"],
    availableFits: ["Boxy Drop Shoulder Cut", "Wide Boxy Cropped", "Classic Regular Fit"],
    availableColors: [
      { name: "Jet Black", hex: "#151515" },
      { name: "Crisp Optical White", hex: "#f8f8f8" },
      { name: "Washed Slate Grey", hex: "#3e424b" },
      { name: "Desert Sand Beige", hex: "#d8c7a8" },
      { name: "Vintage Forest Green", hex: "#263529" }
    ],
    availablePrint: ["Jumbo Front Screen Print", "DTG High-Detail Full Color", "DTF Vibrant Chest Graphic", "Vintage Cracked Plastisol Ink"],
    availableEmbroidery: ["None", "Micro-Chest Tonal Stitch", "Back Collar Monogram", "Sleeve Hem Mini Embroidery"],
    availableLabels: ["Woven Damask Neck Tag", "Tear-Away Retail Care Tag", "Subtle Side Flag Label"],
    availableTags: ["Custom Die-Cut Hangtag", "Embossed 600 GSM Card with Cord"],
    availableWashes: ["Enzyme Mineral Wash", "Sun Bleached Fade Wash", "Pre-Shrunk Plain Finish"],
    availablePackaging: ["Frosted Self-Adhesive Polybag", "Individual Retail Polybag with Barcode"],
    mockupImage: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg"
  },
  {
    id: "sweatshirt",
    name: "Luxury Crewneck Sweatshirt",
    category: "Streetwear",
    tagline: "440 GSM Brushed Fleece with V-Stitch Ribbing",
    baseColor: "#202020",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["440 GSM Brushed Heavy Fleece", "400 GSM French Terry Loopback", "100% Organic Heavy Cotton"],
    availableGsm: ["400 GSM French Terry", "440 GSM Heavy Fleece", "480 GSM Double Face"],
    availableFits: ["Relaxed Boxy Drop Shoulder", "Classic Tailored Crew", "Slightly Cropped Streetwear"],
    availableColors: [
      { name: "Heather Charcoal", hex: "#202020" },
      { name: "Off-White Bone", hex: "#ece8df" },
      { name: "Deep Royal Navy", hex: "#182232" },
      { name: "Washed Espresso", hex: "#322722" },
      { name: "Sage Green", hex: "#3b483c" }
    ],
    availablePrint: ["None", "Subtle Chest Logo Screen Print", "Back Neck Screen Print", "Puff Print Typography"],
    availableEmbroidery: ["None", "Flat Satin Center Chest Embroidery", "3D Puff Chest Lettering", "Left Wrist Minimalist Monogram"],
    availableLabels: ["High-Density Woven Neck Label", "Woven Hem Tab", "Printed Satin Tag"],
    availableTags: ["Heavy Textured Cardstock Tag", "Foil-Debossed Hangtag"],
    availableWashes: ["Silicone Softening Wash", "Acid Vintage Wash", "Raw Clean Factory Finish"],
    availablePackaging: ["Frosted Branded Ziplock Polybag", "Custom Gift Box"],
    mockupImage: "/media/products/streetwear-sweatshirts.jpg"
  },
  {
    id: "jacket",
    name: "Artisan Leather & Varsity Jacket",
    category: "Leather Products",
    tagline: "Full-Grain Cowhide or Wool Body with Precision YKK Zips",
    baseColor: "#0d0d0d",
    relevantControls: ["color", "fit", "fabric", "zippers", "buttons", "patches", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["1.2mm Full-Grain Drum-Dyed Cowhide", "0.9mm Supple Nappa Sheepskin", "Heavy Melton Wool with Leather Sleeves", "Technical Nylon Twill (Bomber)"],
    availableGsm: ["1.2mm Heavy Hide", "0.9mm Soft Hand", "550 GSM Melton Wool"],
    availableFits: ["Biker / Moto Slim Fit", "Oversized Boxy Varsity", "Classic Pilot Bomber Fit"],
    availableColors: [
      { name: "Midnight Black", hex: "#0d0d0d" },
      { name: "Distressed Espresso Brown", hex: "#271b15" },
      { name: "Oxblood Burgundy", hex: "#351014" },
      { name: "Cognac Tan", hex: "#5b371b" }
    ],
    availableZippers: ["YKK #10 Chunky Silver Asymmetric Zip", "YKK #8 Antique Brass Heavy Zip", "Gunmetal Matte Double Slider"],
    availableButtons: ["Engraved Metal Snap Buttons", "Heavy Antique Brass Rivet Snaps", "Horn Buttons (Wool Jackets)"],
    availablePatches: ["None", "Chenille Letterman Chest Patch", "Debossed Leather Back Patch", "Embroidered Arm Badges"],
    availableEmbroidery: ["None", "Direct Needle Leather Embroidery", "Chainstitch Back Arc Lettering"],
    availableLabels: ["Embossed Real Leather Collar Patch", "Woven Damask Interior Label"],
    availableTags: ["Debossed Leather Swatch Hangtag", "Wax-Sealed Certificate Card"],
    availableWashes: ["Hand-Rubbed Vintage Patina", "Tumbled Drum Leather Wash", "Clean Semi-Gloss Finish"],
    availablePackaging: ["Non-Woven Breathable Garment Cover", "Heavy Rigid Black Presentation Box"],
    mockupImage: "/media/products/leather-moto-jacket.jpg"
  },
  {
    id: "jeans",
    name: "Selvedge Denim Jeans",
    category: "Fashion Wear",
    tagline: "14 oz Raw & Washed Denim with Solid Brass Rivets",
    baseColor: "#192434",
    relevantControls: ["color", "fit", "fabric", "gsm", "buttons", "washes", "labels", "tags", "packaging"],
    availableFabrics: ["14 oz 100% Cotton Selvedge Denim", "13 oz Stretch Rigid Denim", "15.5 oz Heavyweight Kuroki Style Denim"],
    availableGsm: ["13 oz Medium-Heavy", "14 oz Authentic Selvedge", "15.5 oz Heavy Armor"],
    availableFits: ["Straight Leg Classic", "Wide Baggy 90s Silhouette", "Relaxed Tapered Fit"],
    availableColors: [
      { name: "Deep Indigo Raw", hex: "#192434" },
      { name: "Vintage Mid-Wash Blue", hex: "#354a64" },
      { name: "Faded Washed Black", hex: "#222326" },
      { name: "Dirty Tint Stone Wash", hex: "#4a4941" }
    ],
    availableButtons: ["Custom Engraved Donut Button Fly", "YKK Heavy Duty Locking Brass Zipper"],
    availableWashes: ["Raw Unwashed (Rigid)", "Enzyme Stone Wash with Whisker Fade", "Heavy Acid Bleach Wash", "Hand-Distressed Knee Shreds"],
    availableLabels: ["Embossed Genuine Leather Waistband Patch", "Interior Pocket Bag Screen Print", "Selvedge Coin Pocket ID"],
    availableTags: ["Pocket Flasher Cardstock Tag", "Debossed Cardboard Belt Loop Tag"],
    availablePackaging: ["Heavy Duty Rolled Kraft Band", "Frosted Branded Ziplock Polybag"],
    mockupImage: "/media/products/streetwear-jeans.jpg"
  },
  {
    id: "baggy-sweat-pants",
    name: "Heavy Fleece Baggy Sweat Pants",
    category: "Streetwear",
    tagline: "420 GSM Wide-Leg Open Hem with Deep Welt Pockets",
    baseColor: "#121212",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["420 GSM Heavyweight Combed Fleece", "400 GSM French Terry Loopback", "Organic Heavy Cotton"],
    availableGsm: ["380 GSM Mid-Heavy", "420 GSM Luxury Heavyweight", "480 GSM Dense Armor"],
    availableFits: ["Wide Leg Baggy Streetwear Drape", "Relaxed Straight Open Hem", "Stacking Wide Silhouette"],
    availableColors: [
      { name: "Pitch Black", hex: "#121212" },
      { name: "Bone Off-White", hex: "#f0ece3" },
      { name: "Washed Charcoal", hex: "#292929" },
      { name: "Vintage Olive", hex: "#2d362b" },
      { name: "Washed Navy", hex: "#1d2532" }
    ],
    availablePrint: ["None", "Vertical Thigh Screen Print", "Subtle Calf Graphic", "3D Puff Print Logo"],
    availableEmbroidery: ["None", "Pocket Lip Minimalist Monogram", "Tonal Thigh Stitching"],
    availableLabels: ["Interior Waistband Woven Label", "Side Seam Woven Flag Tab"],
    availableTags: ["Matte Black Hangtag with Cord", "Embossed Cardstock Tag"],
    availableWashes: ["Enzyme Silicone Wash", "Mineral Vintage Fade Wash", "Clean Pre-Shrunk Finish"],
    availablePackaging: ["Frosted Custom Ziplock Bag", "Individual Recycled Polybag"],
    mockupImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg"
  },
  {
    id: "joggers",
    name: "Heavy Fleece Baggy Sweat Pants",
    category: "Streetwear",
    tagline: "420 GSM Wide-Leg Open Hem with Deep Welt Pockets",
    baseColor: "#131313",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["420 GSM Heavyweight Fleece", "400 GSM French Terry", "Organic Heavy Cotton"],
    availableGsm: ["380 GSM", "420 GSM Luxury Heavy", "480 GSM"],
    availableFits: ["Wide Leg Baggy Cut", "Relaxed Straight-Leg Open Hem", "Stacking Streetwear Silhouette"],
    availableColors: [
      { name: "Pitch Black", hex: "#131313" },
      { name: "Bone Melange", hex: "#eeeae2" },
      { name: "Charcoal Heather", hex: "#282828" },
      { name: "Vintage Washed Navy", hex: "#1d2634" },
      { name: "Dark Olive", hex: "#30392e" }
    ],
    availablePrint: ["None", "Vertical Thigh Screen Print", "Subtle Calf Graphic", "3D Puff Print Logo"],
    availableEmbroidery: ["None", "Thigh Minimalist Monogram", "Pocket Edge Tonal Stitch"],
    availableLabels: ["Interior Waistband Woven Label", "Side Seam Woven Flag Tab"],
    availableTags: ["Matte Black Hangtag with Cord"],
    availableWashes: ["Enzyme Silicone Wash", "Mineral Vintage Fade Wash", "Clean Pre-Shrunk Finish"],
    availablePackaging: ["Frosted Custom Ziplock Bag"],
    mockupImage: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg"
  },
  {
    id: "oversized-tee",
    name: "Oversized Heavyweight Tee",
    category: "Streetwear",
    tagline: "280 GSM Exaggerated Drop Shoulder Boxy Jersey",
    baseColor: "#0f0f0f",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["280 GSM Combed Single Jersey", "300 GSM Heavy Vintage Cotton", "Organic Ring-Spun Cotton"],
    availableGsm: ["240 GSM Everyday Heavy", "280 GSM Luxury Streetwear", "320 GSM Structural Heavy"],
    availableFits: ["Exaggerated Drop Shoulder Boxy Cut", "Wide Boxy Cropped Cut", "Classic Relaxed Cut"],
    availableColors: [
      { name: "Pitch Black", hex: "#0f0f0f" },
      { name: "Chalk White", hex: "#f9f9f9" },
      { name: "Washed Ash Grey", hex: "#44464c" },
      { name: "Muted Sand", hex: "#d5c5ad" }
    ],
    availablePrint: ["Jumbo All-Over Screen Print", "High-Density Puff Print", "DTG Photoprint", "Discharge Vintage Print"],
    availableEmbroidery: ["None", "Center Chest Micro Embroidery", "Left Sleeve Monogram"],
    availableLabels: ["High-Density Woven Neck Label", "Tear-Away Care Label", "Hem Clamp Label"],
    availableTags: ["Custom Die-Cut Hangtag", "Embossed 700 GSM Cardstock"],
    availableWashes: ["Vintage Mineral Wash", "Sun-Bleached Fade", "Pre-Shrunk Plain Finish"],
    availablePackaging: ["Frosted Self-Adhesive Polybag", "Custom Gift Box"],
    mockupImage: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg"
  },
  {
    id: "shorts",
    name: "Heavy French Terry Shorts",
    category: "Streetwear",
    tagline: "380 GSM Loopback Terry with Deep Pockets & Side Slits",
    baseColor: "#131313",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["380 GSM Diagonal French Terry", "340 GSM Combed Loopback", "100% Organic Heavy Cotton"],
    availableGsm: ["340 GSM Mid-Weight", "380 GSM Streetwear Standard", "440 GSM Dense Fleece"],
    availableFits: ["Relaxed Above-Knee Cut", "Boxy Streetwear Fit", "Standard Athletic Fit"],
    availableColors: [
      { name: "Onyx Black", hex: "#131313" },
      { name: "Vintage Heather Grey", hex: "#949490" },
      { name: "Raw Ecru", hex: "#ebe6dc" },
      { name: "Vintage Washed Navy", hex: "#1d2532" }
    ],
    availablePrint: ["Left Leg Screen Print", "High-Density 3D Puff Logo", "None"],
    availableEmbroidery: ["None", "Tonal Hem Embroidery", "Pocket Edge Stitch"],
    availableLabels: ["Interior Waistband Woven Label", "Side Seam Woven Flag Tab"],
    availableTags: ["Matte Black Hangtag with Cord"],
    availableWashes: ["Enzyme Silicone Wash", "Raw Clean Finish"],
    availablePackaging: ["Frosted Custom Ziplock Bag"],
    mockupImage: "/media/products/streetwear-shorts.jpg"
  },
  {
    id: "cropped-sleeveless",
    name: "Cropped Sleeveless Boxy Shirt",
    category: "Streetwear",
    tagline: "250 GSM Extended Shoulder Muscle Cut",
    baseColor: "#111111",
    relevantControls: ["color", "fit", "fabric", "gsm", "print", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["250 GSM Heavy Combed Cotton Jersey", "220 GSM Single Jersey", "Organic Ring-Spun Cotton"],
    availableGsm: ["220 GSM Mid-Heavy", "250 GSM Heavy Cut", "280 GSM Dense Jersey"],
    availableFits: ["Wide-Shoulder Cropped Boxy Cut", "Relaxed Muscle Cut", "Standard Tank Fit"],
    availableColors: [
      { name: "Onyx Black", hex: "#111111" },
      { name: "Optic White", hex: "#fbfbfb" },
      { name: "Washed Charcoal", hex: "#2f2f2f" },
      { name: "Faded Olive", hex: "#3a4136" }
    ],
    availablePrint: ["Center Chest Graphic Screen Print", "Full Back DTF Print", "None"],
    availableEmbroidery: ["None", "Micro Satin Chest Embroidery", "Back Neck Monogram"],
    availableLabels: ["Custom Woven Neck Tag", "Tear-Away Satin Label"],
    availableTags: ["Matte Black Hangtag with Pin"],
    availableWashes: ["Vintage Enzyme Wash", "Pre-Shrunk Plain Finish"],
    availablePackaging: ["Frosted Self-Adhesive Polybag"],
    mockupImage: "/media/products/streetwear-tees.jpg"
  },
  {
    id: "medical-scrubs",
    name: "Performance Stretch Scrubs",
    category: "Medical Wear",
    tagline: "4-Way Poly/Rayon Stretch Twill with Liquid Barrier",
    baseColor: "#1a2c42",
    relevantControls: ["color", "fit", "fabric", "gsm", "embroidery", "labels", "tags", "washes", "packaging"],
    availableFabrics: ["4-Way Poly/Rayon/Spandex Twill", "Antimicrobial Liquid Barrier Weave", "Breathable Mechanical Stretch"],
    availableGsm: ["200 GSM Performance Weave", "230 GSM Structured Twill"],
    availableFits: ["Athletic Modern Ergonomic Fit", "Relaxed Classic Medical Cut"],
    availableColors: [
      { name: "Hospital Navy", hex: "#1a2c42" },
      { name: "Ceil Blue", hex: "#5a82a6" },
      { name: "Clinical Black", hex: "#161616" },
      { name: "Hunter Green", hex: "#234032" },
      { name: "Wine Burgundy", hex: "#441a24" }
    ],
    availableEmbroidery: ["Doctor / Department Name Embroidery", "Clinic Logo Monogram (Left Chest)", "None"],
    availableLabels: ["Tagless Heat-Transfer Neck Stamp", "High-Density Woven Hem Label"],
    availableTags: ["Antimicrobial & Fluid Barrier Spec Hangtag"],
    availableWashes: ["Autoclave Industrial Wash Certified (100+ Cycles)"],
    availablePackaging: ["Sanitized Heat-Sealed Medical Pack", "Individual Polybag with Barcode"],
    mockupImage: "/media/products/medical-scrubs.jpg"
  }
];

export const CONFIGURATOR_MODES = [
  { id: "manual", label: "BUILD MANUALLY", desc: "Select fabrics, GSM, cuts, prints, and trims using visual controls." },
  { id: "prompt", label: "DESCRIBE YOUR PRODUCT", desc: "Type your product concept in natural language. Our AI parser maps it directly to factory specs." }
];

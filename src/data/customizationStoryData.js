// ============================================================================
// CENTRALIZED DATA CONFIGURATION: "YOUR PRODUCT. YOUR RULES." SCROLL STORY
// ============================================================================
// Images are mapped directly to authentic photography provided in the project
// via src/data/customizationMediaMapping.js
// Exactly 9 stages per Requirement 17:
// 01 EMBROIDERY, 02 RHINESTONES, 03 SCREEN PRINTING, 04 DTF PRINTING,
// 05 DTG PRINTING, 06 CUSTOM LABELS, 07 CUSTOM TAGS, 08 WASHES & FINISHING,
// 09 CUSTOM PACKAGING
// ============================================================================
import { CUSTOMIZATION_STAGE_IMAGES } from './customizationMediaMapping';

export const CUSTOMIZATION_STORY_DATA = [
  {
    id: "embroidery",
    number: "01",
    total: "09",
    category: "EMBROIDERY",
    headline: "INDUSTRIAL TACTILE EMBROIDERY",
    subheadline: "Precision multi-head Tajima machinery with micro-stitch fidelity",
    description: "From 3D puff embroidery on 500+ GSM heavyweight fleece to ultra-dense flat satin stitching and vintage chainstitch scripts. Engineered with high-tensile polyester and metallic lurex threads that withstand commercial washing without puckering.",
    specs: [
      { label: "Stitch Density", value: "Up to 120,000 stitches/garment" },
      { label: "Techniques", value: "3D Puff / Flat Satin / Micro-Text / Chainstitch" },
      { label: "Thread Options", value: "Matte Poly / Metallic Lurex / Glow-in-Dark" },
      { label: "Placement", value: "Chest, Hood Cuffs, Back Panels, Neck Arch" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["embroidery"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["embroidery"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["embroidery"].alt,
    badge: "TECHNIQUE 01 // PRECISION EMBROIDERY"
  },
  {
    id: "rhinestones",
    number: "02",
    total: "09",
    category: "RHINESTONES",
    headline: "PRECISION GLASS CRYSTAL & HARDWARE",
    subheadline: "Architectural heat-set crystal typography and metallic stud arrays",
    description: "Elevate your streetwear pieces with faceted Grade-A Korean glass rhinestones, metallic dome studs, metal eyelets, and silicone 3D appliques. Applied using calibrated pneumatic heat presses to guarantee permanent crystal adhesion through heavy wear.",
    specs: [
      { label: "Materials", value: "Korean Grade-AAA Glass / Dome Studs / Spikes" },
      { label: "Crystal Sizes", value: "SS6 (2mm) to SS30 (6.5mm) Multi-Scale" },
      { label: "Colorways", value: "Clear Diamond, Jet Black, Aurora Borealis, Gunmetal" },
      { label: "Adhesion Test", value: "Pneumatic 180°C Cured / Pull-Tested to 15N" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["rhinestones"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["rhinestones"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["rhinestones"].alt,
    badge: "TECHNIQUE 02 // RHINESTONES & EMBELLISHMENTS"
  },
  {
    id: "screen-printing",
    number: "03",
    total: "09",
    category: "SCREEN PRINTING",
    headline: "HIGH-DENSITY INDUSTRIAL SCREEN PRINTING",
    subheadline: "Automatic carousel printing with plastisol, discharge & water-base inks",
    description: "Our industrial automated screen printing carousels handle oversized jumbo prints, specialty cracked inks, ultra-soft discharge printing, and high-density puff inks with razor-sharp registration across bulk production runs.",
    specs: [
      { label: "Ink Systems", value: "Plastisol, Discharge, Water-Based, Puff, Glow" },
      { label: "Max Print Size", value: "Up to 20 × 28 in (50 × 70 cm) Jumbo Format" },
      { label: "Color Capacity", value: "Up to 12 Spot Colors with Micro-Registration" },
      { label: "Wash Resistance", value: "Grade 4+ Colorfastness Cured in Gas Dryers" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["screen-printing"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["screen-printing"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["screen-printing"].alt,
    badge: "TECHNIQUE 03 // SCREEN PRINTING"
  },
  {
    id: "dtf-printing",
    number: "04",
    total: "09",
    category: "DTF PRINTING",
    headline: "HIGH-DEFINITION DIRECT-TO-FILM",
    subheadline: "Vibrant photo-realistic transfers with zero color-count restrictions",
    description: "Direct-to-Film (DTF) technology allows photorealistic clarity, microscopic gradients, and opaque white underbases across any fabric composition. Cured with flexible polyurethane hot-melt powder for exceptional stretch recovery and 60+ wash longevity.",
    specs: [
      { label: "Color Gamut", value: "CMYK + High-Density Double White Underbase" },
      { label: "Resolution", value: "1440 × 1440 DPI Micro-Precision" },
      { label: "Durability", value: "60+ Machine Wash Cycles Tested" },
      { label: "Stretch Index", value: "Elastic Polyurethane Heat-Bonded Membrane" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["dtf-printing"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["dtf-printing"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["dtf-printing"].alt,
    badge: "TECHNIQUE 04 // DIRECT-TO-FILM"
  },
  {
    id: "dtg-printing",
    number: "05",
    total: "09",
    category: "DTG PRINTING",
    headline: "SOFT-HAND DIRECT-TO-GARMENT",
    subheadline: "Pigment inks deeply infused into natural combed cotton fibers",
    description: "Kornit and Brother industrial DTG digital engines spray water-based eco-certified pigment inks directly into the garment weave. Leaves zero rubbery texture, maintaining the natural breathability and luxurious soft drape of your combed jersey tees.",
    specs: [
      { label: "Hand Feel", value: "Zero-Hand Breathable Finish" },
      { label: "Ink Quality", value: "OEKO-TEX Standard 100 Water-Based Pigments" },
      { label: "Optimal Fabric", value: "100% Combed Ring-Spun Cotton (240–340 GSM)" },
      { label: "Max Print Area", value: "16 × 20 in (40 × 50 cm) Giant Format" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["dtg-printing"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["dtg-printing"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["dtg-printing"].alt,
    badge: "TECHNIQUE 05 // DIRECT-TO-GARMENT"
  },
  {
    id: "custom-labels",
    number: "06",
    total: "09",
    category: "CUSTOM LABELS",
    headline: "WOVEN DAMASK & SATIN LABELS",
    subheadline: "High-density woven damask neck labels and soft hem clamps",
    description: "Establish signature brand authority with ultra-fine 50D woven damask neck labels, laser-cut satin labels, and custom woven hem clamp tags. Produced with non-scratch ultrasonic sealed edges for all-day skin comfort.",
    specs: [
      { label: "Weave Density", value: "Ultra-Fine 50D High-Density Woven Damask" },
      { label: "Finishing", value: "Ultrasonic Heat Cut (Zero Skin Irritation)" },
      { label: "Styles", value: "End Fold, Center Fold, Miter Fold, Hem Clamps" },
      { label: "Care Compliance", value: "Integrated Sizing & International Care Symbols" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["custom-labels"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["custom-labels"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["custom-labels"].alt,
    badge: "TECHNIQUE 06 // CUSTOM LABELS"
  },
  {
    id: "custom-tags",
    number: "07",
    total: "09",
    category: "CUSTOM TAGS",
    headline: "BESPOKE DEBOSSED HANGTAGS",
    subheadline: "Heavyweight 700 GSM cardstock, blind embossing & safety pin cords",
    description: "Transform your garments into authentic luxury retail goods with customized exterior hangtags. We craft 600–800 GSM textured paper stocks, blind letterpress debossing, matte metallic hot foil stamping, and custom dyed cords with wax or metal safety seals.",
    specs: [
      { label: "Paper Stock", value: "600–800 GSM FSC Certified Duplexed Board" },
      { label: "Finishes", value: "Deep Deboss, Metallic Foil Stamping, Spot UV" },
      { label: "Fasteners", value: "Wax Seals, Matte Gunmetal Safety Pins, Twisted Cord" },
      { label: "Barcodes", value: "Retail-Ready SKU Barcode Printing" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["custom-tags"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["custom-tags"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["custom-tags"].alt,
    badge: "TECHNIQUE 07 // CUSTOM TAGS"
  },
  {
    id: "washes-finishing",
    number: "08",
    total: "09",
    category: "WASHES & FINISHING",
    headline: "VINTAGE WASHES & HAND DISTRESSING",
    subheadline: "Acid wash, enzyme stone wash, mineral fades & artisan distressing",
    description: "Master artisanal garment dyeing and washing protocols. From vintage enzyme stonewashes and mineral sun-bleached fades to selective hand grinding along collar ribs, cuffs, and pocket seams for an authentic lived-in patina.",
    specs: [
      { label: "Wash Protocols", value: "Enzyme Stone Wash, Acid Wash, Sun-Fade, Pigment Dye" },
      { label: "Hand Treatments", value: "Micro-Collar Grinding, Fraying, Pin-Point Distress" },
      { label: "Touch Feel", value: "Silicone Softening & Pre-Shrunk Dimensional Setting" },
      { label: "Shrinkage Control", value: "Under 3% Residual Shrinkage Guaranteed" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["washes-finishing"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["washes-finishing"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["washes-finishing"].alt,
    badge: "TECHNIQUE 08 // WASHES & FINISHING"
  },
  {
    id: "packaging",
    number: "09",
    total: "09",
    category: "CUSTOM PACKAGING",
    headline: "RETAIL-READY LUXURY PACKAGING",
    subheadline: "Frosted ziplock polybags, rigid presentation boxes & retail barcode labeling",
    description: "First impressions begin at unboxing. Every garment is individually folded, desiccant-protected, and sealed inside custom frosted matte EVA ziplock bags or rigid debossed presentation boxes with SKU barcode labeling ready for fulfillment centers.",
    specs: [
      { label: "Polybags", value: "100 Micron Frosted Matte EVA with Air Release Valve" },
      { label: "Closure", value: "Branded Slider Ziplock / Heavy Duty Resealable" },
      { label: "Boxes", value: "Rigid Two-Piece Matte Black Presentation Gift Boxes" },
      { label: "Logistics", value: "Pre-Barcoded SKU Stickers & Master Export Cartons" }
    ],
    video: null,
    poster: CUSTOMIZATION_STAGE_IMAGES["packaging"].image,
    image: CUSTOMIZATION_STAGE_IMAGES["packaging"].image,
    alt: CUSTOMIZATION_STAGE_IMAGES["packaging"].alt,
    badge: "TECHNIQUE 09 // CUSTOM PACKAGING"
  }
];

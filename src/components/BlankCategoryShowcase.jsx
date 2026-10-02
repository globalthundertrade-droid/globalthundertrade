import React from 'react';
import { ArrowRight } from 'lucide-react';

const CATEGORY_SHOWCASE_DATA = [
  {
    category: "HOODIES",
    name: "Heavyweight Boxy Hoodies",
    desc: "Luxury 460+ GSM fleece, double-layer crossover hoods & drop-shoulder streetwear drape.",
    image: "/media/blanks/heavyweight-boxy-hoodie-main.jpg"
  },
  {
    category: "T-SHIRTS",
    name: "Vintage Cut Blank T-Shirts",
    desc: "Dense single jersey, snug 1.25\" non-sag rib collar & relaxed torso proportions.",
    image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg"
  },
  {
    category: "SWEATSHIRTS",
    name: "Loopback Crewnecks",
    desc: "400 GSM French terry with underarm gusseting & flatlock twin-needle stitching.",
    image: "/media/blanks/loopback-blank-crewneck-main.jpg"
  },
  {
    category: "BAGGY SWEAT PANTS",
    name: "Heavy Fleece Baggy Sweat Pants",
    desc: "Authentic wide-leg open-hem cut with deep welt pockets and zero tapered cuffing.",
    image: "/media/blanks/heavy-fleece-baggy-sweat-pants-main.jpg"
  },
  {
    category: "SHORTS",
    name: "Heavy French Terry Shorts",
    desc: "380 GSM diagonal loopback terry with above-knee cut and reinforced side slits.",
    image: "/media/blanks/french-terry-heavyweight-shorts-main.jpg"
  },
  {
    category: "OVERSIZED TEES",
    name: "Oversized Luxury Tees",
    desc: "Exaggerated boxy streetwear silhouette with substantial body drape for jumbo prints.",
    image: "/media/blanks/oversized-luxury-streetwear-tee-main.jpg"
  },
  {
    category: "ZIP HOODIES",
    name: "Heavyweight Zip Hoodies",
    desc: "460 GSM fleece with chunky metal two-way front zip and structured double-layer hood.",
    image: "/media/blanks/heavyweight-zip-up-hoodie-main.jpg"
  },
  {
    category: "CROPPED & SLEEVELESS",
    name: "Cropped & Sleeveless Shirts",
    desc: "Modern muscle silhouette with extended shoulder coverage and cropped waistline.",
    image: "/media/blanks/cropped-sleeveless-boxy-shirt-main.jpg"
  },
  {
    category: "LONG SLEEVE",
    name: "Heavyweight Long Sleeve Shirts",
    desc: "280–320 GSM dense knits with structured 2x2 ribbed cuffs and mock neck options.",
    image: "/media/blanks/vintage-cut-heavy-t-shirt-main.jpg"
  },
  {
    category: "JACKETS",
    name: "Minimalist Canvas Blank Jackets",
    desc: "Heavy 12 oz duck canvas with metal YKK front zip and blank interior ready for lining.",
    image: "/media/blanks/minimal-zip-work-jacket-main.jpg"
  }
];

export default function BlankCategoryShowcase({ onSelectCategory }) {
  return (
    <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line-light)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--gray-dark)' }}>
              CORE SILHOUETTES
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', marginTop: 8, letterSpacing: '-.03em' }}>
              BLANK PRODUCT RANGE
            </h2>
          </div>
          <p style={{ color: 'var(--gray-dark)', fontSize: 14, maxWidth: 440, lineHeight: 1.6 }}>
            Browse GTT's foundational blank apparel catalogue. Every silhouette is unbranded, customizable, and ready for private label manufacturing.
          </p>
        </div>

        <div className="blanks-showcase-grid">
          {CATEGORY_SHOWCASE_DATA.map((item, idx) => (
            <div
              key={idx}
              className="blanks-showcase-card"
              onClick={() => onSelectCategory(item.category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(item.category);
                }
              }}
              aria-label={`Filter catalogue by ${item.name}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="blanks-showcase-img color-img"
                loading="lazy"
              />
              <div className="blanks-showcase-overlay">
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: '#b0b0a8', fontWeight: 800, marginBottom: 4 }}>
                  {item.category}
                </div>
                <h3 className="blanks-showcase-title">
                  {item.name}
                </h3>
                <p className="blanks-showcase-desc">
                  {item.desc}
                </p>
                <div className="blanks-showcase-link">
                  <span>EXPLORE BLANKS</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

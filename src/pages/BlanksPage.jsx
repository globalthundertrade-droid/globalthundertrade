import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BLANK_CATEGORIES, 
  BLANK_PRODUCTS, 
  BLANK_SERVICES, 
  BLANK_EDITORIAL_FEATURES, 
  WHY_GTT_BLANKS 
} from '../data/blanksData';
import BlankCard from '../components/BlankCard';
import BlankFilters from '../components/BlankFilters';
import BlankScrollTransform from '../components/BlankScrollTransform';
import BlankCategoryShowcase from '../components/BlankCategoryShowcase';
import { ArrowRight, Check, ArrowDown, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function BlanksPage() {
  const navigate = useNavigate();
  const catalogueRef = useRef(null);
  const { products: cmsProducts } = useCms();

  // Combine static blanks with any blanks added or modified via Admin CMS
  const allBlanks = useMemo(() => {
    const list = [...BLANK_PRODUCTS];
    if (cmsProducts && Array.isArray(cmsProducts)) {
      const blanksFromCms = cmsProducts.filter(p => 
        p.category === 'premium-blanks' || 
        p.category === 'blanks' || 
        p.isCustomBlank ||
        (p.category && p.category.toLowerCase().includes('blank'))
      );
      blanksFromCms.forEach(cb => {
        let colours = cb.colours || cb.colors;
        if (!colours && cb.variants && Array.isArray(cb.variants)) {
          colours = cb.variants.map(v => ({
            name: v.name || v.color || 'Standard',
            hex: v.colorHex || '#111111',
            image: v.image || cb.image
          }));
        }
        if (!colours || colours.length === 0) {
          colours = [{ name: 'Standard', hex: '#111111', image: cb.image }];
        }

        const normalized = {
          ...cb,
          colours,
          category: (cb.blankCategory || cb.category || 'HOODIES').toUpperCase(),
          gsm: cb.gsm || (cb.specifications?.gsm) || '460 GSM',
          fit: cb.fit || (cb.specifications?.fit) || 'Oversized Boxy',
          fabric: cb.fabric || (cb.specifications?.fabric) || '100% Cotton Fleece',
          moq: cb.moq || 25,
          leadTime: cb.leadTime || '7–10 Days'
        };

        const existingIdx = list.findIndex(item => item.id === cb.id || item.slug === cb.slug);
        if (existingIdx >= 0) {
          list[existingIdx] = { ...list[existingIdx], ...normalized };
        } else {
          list.unshift(normalized);
        }
      });
    }
    return list;
  }, [cmsProducts]);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filters, setFilters] = useState({
    color: '',
    fit: '',
    fabric: '',
    gsm: ''
  });

  // Dynamic filter options extraction from real product data
  const availableOptions = useMemo(() => {
    const colors = new Set();
    const fits = new Set();
    const fabrics = new Set();
    const gsms = new Set();

    allBlanks.forEach(p => {
      p.colours?.forEach(c => colors.add(c.name));
      if (p.fit) fits.add(p.fit);
      if (p.fabric) fabrics.add(p.fabric);
      if (p.gsm) gsms.add(p.gsm);
    });

    return {
      colors: Array.from(colors).sort(),
      fits: Array.from(fits).sort(),
      fabrics: Array.from(fabrics).sort(),
      gsms: Array.from(gsms).sort()
    };
  }, [allBlanks]);

  // Filter products based on active category & selected criteria
  const filteredProducts = useMemo(() => {
    return allBlanks.filter(p => {
      // Category match
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'MORE') {
          const primaryCats = [
            'HOODIES', 'T-SHIRTS', 'OVERSIZED TEES', 'SWEATSHIRTS', 'ZIP HOODIES', 
            'BAGGY SWEAT PANTS', 'SWEAT PANTS', 'SHORTS', 'JACKETS', 'CROPPED & SLEEVELESS', 'LONG SLEEVE'
          ];
          if (primaryCats.includes(p.category)) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Colour match
      if (filters.color) {
        const hasCol = p.colours?.some(c => c.name.toLowerCase() === filters.color.toLowerCase());
        if (!hasCol) return false;
      }

      // Fit match
      if (filters.fit && p.fit !== filters.fit) {
        return false;
      }

      // Fabric match
      if (filters.fabric && p.fabric !== filters.fabric) {
        return false;
      }

      // GSM match
      if (filters.gsm && p.gsm !== filters.gsm) {
        return false;
      }

      return true;
    });
  }, [allBlanks, selectedCategory, filters]);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const handleClearFilters = () => {
    setSelectedCategory('ALL');
    setFilters({ color: '', fit: '', fabric: '', gsm: '' });
  };

  const scrollToCatalogue = () => {
    if (catalogueRef.current) {
      catalogueRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectShowcaseCategory = (cat) => {
    setSelectedCategory(cat);
    scrollToCatalogue();
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead />
      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section className="blanks-hero section-dark">
        <div className="blanks-hero-bg">
          <img
            src="/media/blanks/blanks-hero-bg.jpg"
            alt="GTT Premium Blank Garment Studio Composition"
            className="blanks-hero-img-backdrop color-img"
          />
          <div className="blanks-hero-overlay" />
        </div>

        <div className="wrap blanks-hero-content">
          <div className="blanks-hero-badge">
            <span className="blanks-hero-badge-dot" />
            <span>GLOBAL THUNDER TRADE // BLANKS PROGRAM</span>
          </div>

          <h1 className="blanks-hero-title">
            PREMIUM BLANKS.<br />
            READY FOR YOUR BRAND.
          </h1>

          <p className="blanks-hero-desc">
            A wide range of premium blank apparel, available in multiple colours and ready to customize, brand, and make your own.
          </p>

          <div className="blanks-hero-actions">
            <button
              type="button"
              onClick={scrollToCatalogue}
              className="btn btn-primary"
            >
              EXPLORE BLANKS <ArrowDown size={14} />
            </button>

            <Link to="/contact" className="btn btn-ghost">
              REQUEST CUSTOM SAMPLES <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INTRO / BRAND STATEMENT */}
      {/* ============================================================== */}
      <section className="blanks-statement-sec">
        <div className="wrap blanks-statement-grid">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gray-dark)' }}>
              FOUNDATIONAL ARCHITECTURE
            </p>
            <h2 className="blanks-statement-heading">
              BLANK TODAY.<br />
              YOUR BRAND TOMORROW.
            </h2>
          </div>

          <div className="blanks-statement-steps">
            <div className="blanks-statement-step">
              <span className="blanks-statement-step-num">01 //</span>
              <span>Start with the garment.</span>
            </div>
            <div className="blanks-statement-step">
              <span className="blanks-statement-step-num">02 //</span>
              <span>Choose the colour.</span>
            </div>
            <div className="blanks-statement-step">
              <span className="blanks-statement-step-num">03 //</span>
              <span>Choose the fit.</span>
            </div>
            <div className="blanks-statement-step">
              <span className="blanks-statement-step-num">04 //</span>
              <span>Add your branding.</span>
            </div>
            <div className="blanks-statement-step">
              <span className="blanks-statement-step-num">05 //</span>
              <span>Create your product.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CATEGORY NAVIGATION & FILTER SYSTEM */}
      {/* ============================================================== */}
      <div className="blanks-nav-sticky-wrapper" ref={catalogueRef}>
        <div className="wrap">
          {/* Horizontal Category Navigation */}
          <nav className="blanks-category-scroller" aria-label="Blank Apparel Categories">
            {BLANK_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`blanks-category-pill ${isActive ? 'active' : ''}`}
                  aria-pressed={isActive}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </nav>

          {/* Filtering and Count Ribbon */}
          <BlankFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableOptions={availableOptions}
            filteredCount={filteredProducts.length}
            totalCount={BLANK_PRODUCTS.length}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. PRODUCT CATALOGUE COLLECTION */}
      {/* ============================================================== */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="wrap">
          {filteredProducts.length > 0 ? (
            <div className="blanks-catalogue-grid">
              {filteredProducts.map((item) => (
                <BlankCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--off-white)', borderRadius: 2 }}>
              <h3 style={{ fontSize: 22, textTransform: 'uppercase', marginBottom: 12 }}>
                No Blanks Match Your Selected Criteria
              </h3>
              <p style={{ color: 'var(--gray-dark)', fontSize: 14, maxWidth: 460, margin: '0 auto 24px' }}>
                Try clearing or adjusting your active color, fit, fabric, or GSM filters to view available garments.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. BLANK → BRANDED PRODUCT TRANSFORMATION */}
      {/* ============================================================== */}
      <BlankScrollTransform />

      {/* ============================================================== */}
      {/* 6. BUILT FOR BRAND OWNERS */}
      {/* ============================================================== */}
      <section className="section" style={{ background: 'var(--off-white)', borderTop: '1px solid var(--line-light)' }}>
        <div className="wrap">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gray-dark)' }}>
              THE GTT ADVANTAGE
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4.8vw, 56px)', marginTop: 8, letterSpacing: '-.03em' }}>
              BUILT FOR BRAND OWNERS.
            </h2>
          </div>

          <div className="blanks-pillars-grid">
            {BLANK_EDITORIAL_FEATURES.map((p, idx) => (
              <div key={idx} className="blanks-pillar-card">
                <span className="blanks-pillar-num">// {p.number}</span>
                <h3 className="blanks-pillar-title">{p.title}</h3>
                <p className="blanks-pillar-desc">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. MORE THAN A BLANK */}
      {/* ============================================================== */}
      <section className="blanks-workflow-wrap section-dark">
        <div className="wrap">
          <div style={{ maxWidth: 800 }}>
            <p className="eyebrow" style={{ color: 'var(--gray)' }}>
              END-TO-END DEVELOPMENT
            </p>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginTop: 10, letterSpacing: '-.03em' }}>
              MORE THAN A BLANK.
            </h2>
            <p style={{ color: '#aaa', fontSize: 17, marginTop: 16, lineHeight: 1.6 }}>
              Your blank can be the beginning of the entire product. From unbranded cotton fleece to commercial retail unboxing, GTT powers every stage of production.
            </p>
          </div>

          <div className="blanks-workflow-flow">
            {[
              { step: "PHASE 01", title: "BLANK", desc: "Select high-drape garment base" },
              { step: "PHASE 02", title: "CUSTOMIZATION", desc: "Fabrics, GSM, washes & Pantone dye" },
              { step: "PHASE 03", title: "BRANDING", desc: "3D puff embroidery, DTF & screen print" },
              { step: "PHASE 04", title: "CONTENT", desc: "Factory lookbook & garment visuals" },
              { step: "PHASE 05", title: "PACKAGING", desc: "Frosted zip polybags & barcoding" },
              { step: "PHASE 06", title: "LAUNCH", desc: "Delivered ready for market drop" }
            ].map((node, i) => (
              <div key={i} className="blanks-workflow-node">
                <div className="blanks-workflow-step">{node.step}</div>
                <h4 className="blanks-workflow-title">{node.title}</h4>
                <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 6, lineHeight: 1.45 }}>
                  {node.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="blanks-workflow-actions">
            <Link to="/contact" className="btn btn-primary">
              DEVELOP CUSTOM ORDER &rarr;
            </Link>
            <Link to="/services" className="btn btn-ghost">
              VIEW MANUFACTURING CAPABILITIES
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. PRODUCT RANGE / CATEGORY SHOWCASE */}
      {/* ============================================================== */}
      <BlankCategoryShowcase onSelectCategory={handleSelectShowcaseCategory} />

      {/* ============================================================== */}
      {/* 9. WHY GTT BLANKS */}
      {/* ============================================================== */}
      <section className="section" style={{ background: 'var(--off-white)', borderTop: '1px solid var(--line-light)' }}>
        <div className="wrap">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gray-dark)' }}>
              STANDARDS &amp; INFRASTRUCTURE
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 50px)', marginTop: 8, letterSpacing: '-.03em' }}>
              WHY GTT BLANKS
            </h2>
          </div>

          <div className="blanks-why-grid">
            {WHY_GTT_BLANKS.map((item, idx) => (
              <div key={idx} className="blanks-why-item">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. FINAL DRAMATIC CTA */}
      {/* ============================================================== */}
      <section className="blanks-final-cta section-dark">
        <div 
          className="blanks-final-cta-bg"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            backgroundImage: 'url(/media/blanks/blanks-cta-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1)',
            pointerEvents: 'none'
          }}
        />
        <div className="wrap" style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}>
          <p className="eyebrow" style={{ color: 'var(--gray)' }}>
            START PRODUCTION DIRECT
          </p>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 76px)', lineHeight: 0.96, marginTop: 14, letterSpacing: '-.04em' }}>
            FOUND YOUR BLANK?
          </h2>
          <p style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: '#d0d0cc', marginTop: 10, fontWeight: 700, letterSpacing: '-.02em' }}>
            Now make it yours.
          </p>

          <div className="blanks-final-cta-actions">
            <Link to="/contact" className="btn btn-primary">
              REQUEST WHOLESALE SAMPLES &rarr;
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              TALK TO GTT &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

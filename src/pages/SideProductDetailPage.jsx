import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SIDE_PRODUCTS } from '../data/sideProductsData';
import { useCms } from '../context/CmsContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpRight, 
  Check, 
  ShieldCheck, 
  Layers, 
  Package, 
  Sparkles, 
  ChevronRight,
  Hammer,
  HelpCircle,
  Eye
} from 'lucide-react';

export default function SideProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { content } = useCms();

  // Find product by slug or id
  const rawProduct = SIDE_PRODUCTS.find(p => p.slug === slug || p.id === slug);
  const cmsDetail = rawProduct ? content?.homepage?.detailsMatter?.[rawProduct.id] : null;
  const product = rawProduct ? {
    ...rawProduct,
    image: cmsDetail?.image || rawProduct.image,
    name: cmsDetail?.title || rawProduct.name,
    tagline: cmsDetail?.tagline || rawProduct.tagline
  } : null;

  // Active gallery image
  const [activeImage, setActiveImage] = useState(
    product ? (product.gallery?.[0] || product.image) : ''
  );

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      document.title = `${product.name} | GTT Side Products & Hardware`;
      setActiveImage(product.gallery?.[0] || product.image);
    }
  }, [slug, product?.name, product?.image]);

  // If product not found
  if (!product) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 500 }}>
          <span className="eyebrow" style={{ color: 'var(--gray-dark)' }}>404 // NOT FOUND</span>
          <h1 style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', margin: '16px 0' }}>
            SPECIFICATION NOT FOUND
          </h1>
          <p style={{ color: 'var(--gray-dark)', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            The requested side product or trim component does not exist in our active catalogue.
          </p>
          <Link to="/side-products" className="btn btn-primary">
            <ArrowLeft size={14} /> BACK TO SIDE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  // Related products (from same category or related tags, excluding current)
  const relatedProducts = SIDE_PRODUCTS.filter(
    p => p.id !== product.id && (p.category === product.category || (p.tags && product.tags && p.tags.some(t => product.tags.includes(t))))
  ).slice(0, 3);

  // Navigation handlers
  const handleRequestProduct = () => {
    navigate('/contact', {
      state: {
        sideProductSpec: {
          product: product.name,
          category: product.categoryLabel,
          materials: product.materials,
          finishes: product.colours,
          customizationOptions: product.customizationOptions
        }
      }
    });
  };

  const handleCustomizeWithProduct = () => {
    navigate('/contact', {
      state: {
        sideProductSpec: {
          product: product.name,
          category: product.category,
          materials: product.materials,
          finishes: product.finishes,
          customizationOptions: product.customizationOptions
        }
      }
    });
  };

  return (
    <div className="spd-page" style={{ paddingTop: 'var(--nav-h)' }}>
      {/* ============================================================== */}
      {/* BREADCRUMB HEADER */}
      {/* ============================================================== */}
      <section className="spd-breadcrumb-bar">
        <div className="wrap">
          <div className="spd-breadcrumbs">
            <Link to="/" className="spd-crumb-link">HOME</Link>
            <ChevronRight size={12} className="spd-crumb-sep" />
            <Link to="/side-products" className="spd-crumb-link">SIDE PRODUCTS</Link>
            <ChevronRight size={12} className="spd-crumb-sep" />
            <span className="spd-crumb-link" style={{ textTransform: 'uppercase' }}>{product.categoryLabel}</span>
            <ChevronRight size={12} className="spd-crumb-sep" />
            <span className="spd-crumb-active">{product.name}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MAIN PRODUCT DETAIL VIEW */}
      {/* ============================================================== */}
      <section className="spd-main-section">
        <div className="wrap">
          <div className="spd-layout-grid">
            {/* LEFT: GALLERY & MACRO INSPECTION */}
            <div className="spd-gallery-col">
              <div className="spd-main-media">
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="spd-main-img color-img"
                />
                <span className="spd-media-badge">
                  {product.categoryLabel}
                </span>
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="spd-thumbs-row">
                  {product.gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`spd-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                    >
                      <img src={imgUrl} alt={`Thumbnail 0${i + 1}`} className="spd-thumb-img color-img" />
                    </button>
                  ))}
                </div>
              )}

              {/* Technical Inspection Note */}
              <div className="spd-inspection-note">
                <div className="spd-note-icon"><ShieldCheck size={18} /></div>
                <div>
                  <h4 className="spd-note-title">FACTORY DIRECT TOLERANCE</h4>
                  <p className="spd-note-p">
                    All components are manufactured to strict industrial standards with custom mold proofs, pantone-matched dye dips, and ultrasonic clean cuts.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: SPECIFICATIONS & ACTION PANEL */}
            <div className="spd-info-col">
              <div className="spd-meta-top">
                <span className="spd-meta-id">SPEC ID: {product.id.toUpperCase()}</span>
                <span className="spd-meta-status">CUSTOM MANUFACTURE</span>
              </div>

              <h1 className="spd-title">{product.name}</h1>

              <p className="spd-tagline">{product.tagline}</p>

              <p className="spd-desc">{product.description}</p>

              {/* Specification Grid */}
              <div className="spd-specs-container">
                {/* Materials */}
                <div className="spd-spec-block">
                  <span className="spd-spec-heading">AVAILABLE MATERIALS &amp; COMPOSITIONS</span>
                  <div className="spd-pill-wrap">
                    {product.materials?.map((mat, i) => (
                      <span key={i} className="spd-pill">{mat}</span>
                    ))}
                  </div>
                </div>

                {/* Finishes / Colours */}
                <div className="spd-spec-block">
                  <span className="spd-spec-heading">FINISHES &amp; COLOUR COMBINATIONS</span>
                  <div className="spd-pill-wrap">
                    {product.colours?.map((col, i) => (
                      <span key={i} className="spd-pill">{col}</span>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="spd-spec-block">
                  <span className="spd-spec-heading">FABRICATION &amp; BRANDING OPTIONS</span>
                  <div className="spd-pill-wrap">
                    {product.customizationOptions?.map((opt, i) => (
                      <span key={i} className="spd-pill spd-pill-accent">{opt}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="spd-actions-area">
                <button
                  type="button"
                  onClick={handleRequestProduct}
                  className="btn btn-primary spd-btn-main"
                >
                  REQUEST THIS PRODUCT <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleCustomizeWithProduct}
                  className="btn btn-ghost spd-btn-secondary"
                >
                  ADD TO YOUR PRODUCT <ArrowUpRight size={14} />
                </button>
              </div>

              {/* Integration Banner */}
              <div className="spd-integration-box">
                <div className="spd-int-head">
                  <Layers size={16} />
                  <span>READY TO INTEGRATE WITH GTT BLANKS</span>
                </div>
                <p className="spd-int-p">
                  This component can be supplied as a standalone bulk trim order or pre-assembled directly onto GTT blank hoodies, oversized t-shirts, jackets, or trousers during bulk garment production.
                </p>
                <div className="spd-int-links">
                  <Link to="/blanks" className="spd-int-link">
                    BROWSE MATCHING BLANKS <ChevronRight size={13} />
                  </Link>
                  <span className="spd-int-sep">·</span>
                  <Link to="/contact" className="spd-int-link">
                    REQUEST SAMPLE / QUOTE <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRODUCTION & SAMPLE PROCESS */}
      {/* ============================================================== */}
      <section className="spd-process-section section-dark">
        <div className="wrap">
          <div className="spd-process-head">
            <span className="eyebrow" style={{ color: 'var(--gray)' }}>SAMPLING &amp; PRODUCTION</span>
            <h2 className="spd-process-title">FROM TECH PACK TO FINISHED HARDWARE.</h2>
          </div>

          <div className="spd-process-grid">
            <div className="spd-proc-card">
              <span className="spd-proc-num">01</span>
              <h3 className="spd-proc-title">DIGITAL TOOLING &amp; 3D PROOFS</h3>
              <p className="spd-proc-desc">
                Submit vector artwork, 3D CAD files, or reference photos. Our engineers prepare exact mold tooling drawings with precise draft angles and laser depths.
              </p>
            </div>

            <div className="spd-proc-card">
              <span className="spd-proc-num">02</span>
              <h3 className="spd-proc-title">PRE-PRODUCTION SAMPLING</h3>
              <p className="spd-proc-desc">
                We produce physical strike-offs, ultrasonic cut test labels, or cast metal sample pulls for your touch, weight, and fit approval before mass manufacturing.
              </p>
            </div>

            <div className="spd-proc-card">
              <span className="spd-proc-num">03</span>
              <h3 className="spd-proc-title">INTEGRATED BULK ASSEMBLY</h3>
              <p className="spd-proc-desc">
                Once approved, items are either bulk packaged in protective cartons or directly stitched, attached, riveted, and polybagged with your primary garment production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* RELATED PRODUCTS */}
      {/* ============================================================== */}
      {relatedProducts.length > 0 && (
        <section className="spd-related-section">
          <div className="wrap">
            <div className="spd-related-head">
              <div>
                <span className="eyebrow">COMPLEMENTARY SPECIFICATIONS</span>
                <h2 className="spd-related-title">MATCHING TRIMS &amp; HARDWARE.</h2>
              </div>
              <Link to="/side-products" className="spd-view-all-link">
                VIEW ALL 36 PRODUCTS <ArrowRight size={13} />
              </Link>
            </div>

            <div className="spd-related-grid">
              {relatedProducts.map(rp => (
                <article key={rp.id} className="spd-rel-card">
                  <Link to={`/side-products/${rp.slug}`} className="spd-rel-media">
                    <img src={rp.image} alt={rp.name} className="spd-rel-img color-img" />
                    <span className="spd-rel-badge">{rp.categoryLabel}</span>
                  </Link>
                  <div className="spd-rel-body">
                    <h3 className="spd-rel-name">
                      <Link to={`/side-products/${rp.slug}`}>{rp.name}</Link>
                    </h3>
                    <p className="spd-rel-tagline">{rp.tagline}</p>
                    <Link to={`/side-products/${rp.slug}`} className="spd-rel-link">
                      VIEW SPECIFICATION <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* SCOPED COMPONENT STYLES */}
      {/* ============================================================== */}
      <style>{`
        .spd-page {
          background: var(--white);
          color: var(--black);
        }

        /* BREADCRUMBS */
        .spd-breadcrumb-bar {
          background: var(--off-white);
          border-bottom: 1px solid var(--line-light);
          padding: 14px 0;
        }

        .spd-breadcrumbs {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .spd-crumb-link {
          color: var(--gray-dark);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .spd-crumb-link:hover {
          color: var(--black);
        }

        .spd-crumb-sep {
          color: var(--gray);
        }

        .spd-crumb-active {
          color: var(--black);
          text-transform: uppercase;
        }

        /* MAIN SECTION */
        .spd-main-section {
          padding: 70px 0 100px;
        }

        .spd-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: flex-start;
        }

        /* GALLERY COLUMN */
        .spd-gallery-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .spd-main-media {
          position: relative;
          aspect-ratio: 1/1;
          background: #f0f0f0;
          border: 1px solid var(--line-light);
          overflow: hidden;
        }

        .spd-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .spd-media-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--white);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 10px;
        }

        .spd-thumbs-row {
          display: flex;
          gap: 12px;
        }

        .spd-thumb-btn {
          width: 80px;
          height: 80px;
          border: 1px solid var(--line-light);
          padding: 0;
          background: #f0f0f0;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .spd-thumb-btn.active {
          border-color: var(--black);
          border-width: 2px;
        }

        .spd-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .spd-inspection-note {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px;
          background: var(--off-white);
          border: 1px solid var(--line-light);
          margin-top: 10px;
        }

        .spd-note-icon {
          color: var(--black);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .spd-note-title {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .spd-note-p {
          font-size: 12.5px;
          line-height: 1.6;
          color: var(--gray-dark);
          margin: 0;
        }

        /* INFO COLUMN */
        .spd-info-col {
          display: flex;
          flex-direction: column;
        }

        .spd-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: var(--gray-dark);
          margin-bottom: 12px;
        }

        .spd-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .spd-tagline {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.5;
          color: var(--black);
          margin-bottom: 20px;
        }

        .spd-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--gray-dark);
          margin-bottom: 34px;
        }

        .spd-specs-container {
          border-top: 1px solid var(--line-light);
          padding-top: 28px;
          margin-bottom: 34px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .spd-spec-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .spd-spec-heading {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--black);
        }

        .spd-pill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .spd-pill {
          display: inline-block;
          padding: 6px 14px;
          background: var(--off-white);
          border: 1px solid var(--line-light);
          font-size: 12px;
          font-weight: 600;
          color: var(--black);
        }

        .spd-pill-accent {
          background: #ffffff;
          border-color: var(--black);
        }

        /* ACTIONS */
        .spd-actions-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 36px;
        }

        .spd-btn-main {
          width: 100%;
          justify-content: center;
          padding: 16px 24px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .spd-btn-secondary {
          width: 100%;
          justify-content: center;
          padding: 16px 24px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        /* INTEGRATION BOX */
        .spd-integration-box {
          background: var(--off-white);
          border: 1px solid var(--line-light);
          padding: 24px;
        }

        .spd-int-head {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .spd-int-p {
          font-size: 13px;
          line-height: 1.6;
          color: var(--gray-dark);
          margin-bottom: 16px;
        }

        .spd-int-links {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .spd-int-link {
          color: var(--black);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .spd-int-link:hover {
          text-decoration: underline;
        }

        .spd-int-sep {
          color: var(--gray);
        }

        /* PROCESS SECTION */
        .spd-process-section {
          padding: 90px 0;
          background: #0d0d0d;
        }

        .spd-process-head {
          margin-bottom: 48px;
        }

        .spd-process-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--white);
          text-transform: uppercase;
          margin-top: 10px;
        }

        .spd-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .spd-proc-card {
          background: #151515;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px;
        }

        .spd-proc-num {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--gray);
          display: block;
          margin-bottom: 16px;
        }

        .spd-proc-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--white);
          margin-bottom: 12px;
        }

        .spd-proc-desc {
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--gray);
        }

        /* RELATED SECTION */
        .spd-related-section {
          padding: 90px 0 110px;
          background: var(--white);
        }

        .spd-related-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--line-light);
          padding-bottom: 24px;
        }

        .spd-related-title {
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-top: 8px;
        }

        .spd-view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--black);
          text-decoration: none;
        }

        .spd-view-all-link:hover {
          text-decoration: underline;
        }

        .spd-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .spd-rel-card {
          border: 1px solid var(--line-light);
          background: var(--white);
          display: flex;
          flex-direction: column;
        }

        .spd-rel-media {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #f0f0f0;
          display: block;
        }

        .spd-rel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .spd-rel-card:hover .spd-rel-img {
          transform: scale(1.05);
        }

        .spd-rel-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(0, 0, 0, 0.85);
          color: var(--white);
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 4px 8px;
        }

        .spd-rel-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .spd-rel-name {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .spd-rel-name a {
          color: var(--black);
          text-decoration: none;
        }

        .spd-rel-name a:hover {
          color: var(--gray-dark);
        }

        .spd-rel-tagline {
          font-size: 13px;
          line-height: 1.5;
          color: var(--gray-dark);
          margin-bottom: 18px;
          flex-grow: 1;
        }

        .spd-rel-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--black);
          text-decoration: none;
          border-top: 1px solid var(--line-light);
          padding-top: 14px;
        }

        .spd-rel-link:hover {
          text-decoration: underline;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .spd-layout-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .spd-process-grid {
            grid-template-columns: 1fr;
          }

          .spd-related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .spd-related-grid {
            grid-template-columns: 1fr;
          }

          .spd-related-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .spd-main-section {
            padding: 40px 0 70px;
          }
        }
      `}</style>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SIDE_PRODUCTS } from '../data/sideProductsData';
import { ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export default function SideProductsPage() {
  const { content } = useCms();

  useEffect(() => {
    document.title = 'Side Products & Custom Hardware | Global Thunder Trade';
    window.scrollTo(0, 0);
  }, []);

  const activeSideProducts = SIDE_PRODUCTS.map((sp) => {
    const cmsDetail = content?.homepage?.detailsMatter?.[sp.id];
    return {
      ...sp,
      image: cmsDetail?.image || sp.image,
      name: cmsDetail?.title || sp.name,
      tagline: cmsDetail?.tagline || sp.tagline
    };
  });

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="eyebrow">CUSTOM HARDWARE &amp; FINISHING</p>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', marginTop: 20, letterSpacing: '-0.02em', textTransform: 'uppercase', fontWeight: 900 }}>
            SIDE PRODUCTS &amp; TRIMS.
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 17, maxWidth: 660, marginTop: 18, lineHeight: 1.65 }}>
            The details separate a generic stock item from a luxury collector garment. We manufacture bespoke cast metal hardware, garment chains, tactile chenille patches, woven damask labels, custom packaging, and authentic YKK zippers.
          </p>

          <div style={{ marginTop: 36 }}>
            <Link to="/contact" className="btn btn-primary">
              Order Custom Hardware Samples <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Side Products Catalogue Grid */}
      <section className="section" style={{ background: 'var(--white)', padding: '80px 0 120px' }}>
        <div className="wrap">
          <div className="sp-grid">
            {activeSideProducts.map((sp, idx) => (
              <div key={sp.id} className="sp-card">
                <div className="sp-card-media">
                  <img 
                    src={sp.image} 
                    alt={sp.name} 
                    className="sp-card-img"
                  />
                </div>

                <div className="sp-card-body">
                  <span className="sp-card-index">
                    0{idx + 1 < 10 ? `0${idx + 1}` : idx + 1} &middot; TRIM SPEC
                  </span>

                  <h3 className="sp-card-title">
                    {sp.name}
                  </h3>

                  <p className="sp-card-desc">
                    {sp.description}
                  </p>

                  <div className="sp-card-action">
                    <Link 
                      to={`/contact?inquiry=${encodeURIComponent(sp.name)}`}
                      className="sp-card-link"
                    >
                      <span>Inquire Custom {sp.name}</span>
                      <ArrowRight size={13} className="sp-card-arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="section section-dark" style={{ textAlign: 'center', borderTop: '1px solid var(--line-dark)' }}>
        <div className="wrap" style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--gray)' }}>TURNKEY BESPOKE PRODUCTION</p>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 900, textTransform: 'uppercase', marginTop: 14, letterSpacing: '-0.02em' }}>
            ELEVATE YOUR APPAREL WITH CUSTOM TRIMS.
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, lineHeight: 1.65, marginTop: 16, marginBottom: 32 }}>
            All side products and trims can be ordered as standalone bulk components or pre-assembled directly onto your custom garment production runs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              Start Custom Order <ArrowRight size={14} />
            </Link>
            <Link to="/cost-calculator" className="btn btn-ghost">
              Calculate Production Cost <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* PRODUCT GRID */
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          align-items: stretch;
        }

        /* CARD CONTAINER */
        .sp-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid var(--line-light);
          border-radius: 2px;
          overflow: hidden;
          background: var(--white);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .sp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
          border-color: var(--black);
        }

        /* CARD MEDIA */
        .sp-card-media {
          aspect-ratio: 1 / 1;
          width: 100%;
          overflow: hidden;
          background: var(--off-white);
        }

        .sp-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .sp-card:hover .sp-card-img {
          transform: scale(1.04);
        }

        /* CARD BODY */
        .sp-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .sp-card-index {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: var(--gray-dark);
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 8px;
        }

        .sp-card-title {
          font-size: 19px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--black);
          line-height: 1.25;
          margin: 0;
          min-height: 24px;
        }

        .sp-card-desc {
          font-size: 13.5px;
          color: var(--gray-dark);
          margin: 10px 0 0;
          line-height: 1.6;
          flex-grow: 1;
        }

        /* CARD ACTION */
        .sp-card-action {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--line-light);
        }

        .sp-card-link {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--black);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sp-card-link:hover {
          color: var(--gray-dark);
        }

        .sp-card-arrow {
          transition: transform 0.2s ease;
        }

        .sp-card:hover .sp-card-arrow {
          transform: translateX(4px);
        }

        /* RESPONSIVE BREAKPOINTS: DESKTOP 4 COLS, TABLET 2 COLS, MOBILE 1 COL */
        @media (max-width: 1024px) {
          .sp-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .sp-card-body {
            padding: 20px;
          }
        }

        @media (max-width: 640px) {
          .sp-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .sp-card-body {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}

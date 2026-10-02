import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/productsData';
import { CATEGORIES } from '../data/categoriesData';
import { ArrowRight, Check, Sparkles, Layers, Box, Tag, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function ProductDetailPage() {
  const { category: categorySlug, productId } = useParams();
  const { products: cmsProducts } = useCms();
  const allProducts = cmsProducts && cmsProducts.length > 0 ? cmsProducts : PRODUCTS;

  // Find product by slug or id
  const product = allProducts.find(
    p => (p.slug === productId || p.id === productId) && p.category === categorySlug
  ) || allProducts.find(p => p.slug === productId || p.id === productId) || allProducts[0];

  const category = CATEGORIES.find(c => c.slug === product.category) || CATEGORIES[0];
  const [activeImage, setActiveImage] = useState(product.gallery?.[0] || product.image);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead
        title={`${product.name} — Custom Manufacturing`}
        description={product.description || product.lead || product.tagline}
        product={product}
      />
      {/* Breadcrumb Navigation */}
      <section style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--line-light)', padding: '16px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'inherit' }}>Products</Link>
          <span>/</span>
          <Link to={`/products/${category.slug}`} style={{ color: 'inherit' }}>{category.title}</Link>
          <span>/</span>
          <span style={{ color: 'var(--black)', fontWeight: 700 }}>{product.name}</span>
        </div>
      </section>

      {/* Main Product Stage */}
      <section className="section" style={{ padding: '60px 0' }}>
        <div 
          className="wrap p-detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 60,
            alignItems: 'flex-start'
          }}
        >
          {/* Left: Product Photography Gallery */}
          <div>
            <div 
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                borderRadius: 2,
                overflow: 'hidden',
                background: 'var(--off-white)',
                border: '1px solid var(--line-light)'
              }}
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span 
                style={{
                  position: 'absolute',
                  left: 20,
                  bottom: 20,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 14px',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase'
                }}
              >
                {product.type} SPECIFICATION
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    style={{
                      width: 80,
                      height: 96,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: activeImage === imgUrl ? '2px solid var(--black)' : '1px solid var(--line-light)',
                      opacity: activeImage === imgUrl ? 1 : 0.6,
                      cursor: 'pointer',
                      transition: 'all .2s ease'
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Customization Matrix */}
          <div>
            <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 800 }}>
              {category.title} &middot; {product.type}
            </span>

            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 8, letterSpacing: '-.02em' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: 16, color: 'var(--black)', fontWeight: 600, marginTop: 12, lineHeight: 1.5 }}>
              {product.tagline}
            </p>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--gray-dark)', marginTop: 16 }}>
              {product.description}
            </p>

            {/* Interactive Colorway Variants Picker (if variants configured) */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ margin: '24px 0', padding: '16px 20px', background: 'var(--off-white)', borderRadius: 2, border: '1px solid var(--line-light)' }}>
                <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800, color: 'var(--black)', marginBottom: 10 }}>
                  COLORWAY SPECIFICATIONS ({product.variants.length} OPTIONS)
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (v.image) setActiveImage(v.image);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 14px',
                        borderRadius: 20,
                        border: activeImage === v.image ? '2px solid var(--black)' : '1px solid var(--line-light)',
                        background: 'var(--white)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all .2s ease'
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: v.colorHex || '#000000',
                          border: '1px solid rgba(0,0,0,0.15)'
                        }}
                      />
                      <span>{v.colorName}</span>
                      {v.sku && <span style={{ fontSize: 10, color: 'var(--gray-dark)' }}>({v.sku})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, margin: '34px 0 40px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 32px' }}>
                Send Your Mockup <ArrowRight size={14} />
              </Link>
              <Link to="/blanks" className="btn btn-ghost" style={{ padding: '16px 28px' }}>
                Explore Ready Blanks
              </Link>
            </div>

            {/* Specifications Matrix Accordion / Grid */}
            <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: 26 }}>
              <h3 style={{ fontSize: 16, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                CONFIGURABLE MANUFACTURING OPTIONS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Fabrics */}
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                    FABRIC COMPOSITION
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {product.fabrics?.map((f, i) => (
                      <span key={i} style={{ background: 'var(--off-white)', padding: '6px 12px', borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GSM Options */}
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                    GSM / WEIGHT OPTIONS
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {product.gsmOptions?.map((g, i) => (
                      <span key={i} style={{ background: 'var(--off-white)', padding: '6px 12px', borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fit Options */}
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                    FIT &amp; SILHOUETTES
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {product.fitOptions?.map((fit, i) => (
                      <span key={i} style={{ background: 'var(--off-white)', padding: '6px 12px', borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                        {fit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Printing & Embroidery */}
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                    PRINTING &amp; EMBROIDERY METHODS
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {product.printOptions?.map((p, i) => (
                      <span key={i} style={{ background: 'var(--off-white)', padding: '6px 12px', borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                        {p}
                      </span>
                    ))}
                    {product.embroideryOptions?.map((e, i) => (
                      <span key={i} style={{ background: 'var(--off-white)', padding: '6px 12px', borderRadius: 2, fontSize: 12, fontWeight: 600 }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trims, Labels & Packaging */}
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                    TRIMS, LABELS, WASHE &amp; PACKAGING
                  </span>
                  <ul style={{ listStyle: 'none', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--gray-dark)' }}>
                    <li><strong>Labels:</strong> {product.labels?.join(', ')}</li>
                    <li><strong>Hangtags:</strong> {product.tags?.join(', ')}</li>
                    <li><strong>Hardware/Zippers:</strong> {product.zippers?.join(', ') || 'N/A'}</li>
                    <li><strong>Garment Washes:</strong> {product.washes?.join(', ')}</li>
                    <li><strong>Packaging:</strong> {product.packaging?.join(', ')}</li>
                  </ul>
                </div>

                {/* MOQ Notice */}
                <div style={{ padding: '16px 20px', background: 'var(--off-white)', borderRadius: 2, marginTop: 10 }}>
                  <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800, color: 'var(--black)' }}>
                    MINIMUM ORDER QUANTITY (MOQ)
                  </span>
                  <p style={{ fontSize: 13.5, color: 'var(--gray-dark)', marginTop: 4 }}>
                    {product.moqNotice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .p-detail-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLANK_PRODUCTS } from '../data/blanksData';
import SafeImage from '../components/SafeImage';
import SafeVideo from '../components/SafeVideo';
import ImageZoomModal from '../components/ImageZoomModal';
import { 
  ArrowRight, Check, Sliders, Layers, Sparkles, Box, ShieldCheck, 
  ChevronRight, ArrowLeft, RefreshCw, MessageSquare, ZoomIn 
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function BlankDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products: cmsProducts } = useCms();

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

  // Locate blank product by slug or id
  const product = allBlanks.find(p => p.slug === slug || p.id === slug) || allBlanks[0];

  const [selectedColor, setSelectedColor] = useState(
    product.colours?.[0] || { name: 'Default', hex: '#111111' }
  );
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Active gallery image
  const [activeImage, setActiveImage] = useState(
    selectedColor.image || product.images?.[0] || product.image
  );

  // When product or slug changes, reset defaults
  useEffect(() => {
    if (product) {
      const initialColor = product.colours?.[0] || { name: 'Default', hex: '#111111' };
      setSelectedColor(initialColor);
      setActiveImage(initialColor.image || product.images?.[0] || product.image);
    }
  }, [product]);

  // Handle color change and update main image if color image exists
  const handleColorSelect = (col) => {
    setSelectedColor(col);
    if (col.image) {
      setActiveImage(col.image);
    }
  };

  // Send blank into customization inquiry
  const handleCustomizeBlank = () => {
    navigate('/contact', {
      state: {
        blankSpec: {
          product: product.name,
          category: product.category,
          color: selectedColor.name,
          colorHex: selectedColor.hex,
          fit: product.fit,
          fabric: product.fabric,
          gsm: product.gsm,
          slug: product.slug,
          isCustom: true
        }
      }
    });
  };

  // Send blank into inquiry
  const handleRequestBlank = () => {
    navigate('/contact', {
      state: {
        blankSpec: {
          product: product.name,
          category: product.category,
          color: selectedColor.name,
          colorHex: selectedColor.hex,
          fit: product.fit,
          fabric: product.fabric,
          gsm: product.gsm,
          slug: product.slug
        }
      }
    });
  };

  return (
    <div className="blank-detail-wrap">
      <SEOHead 
        title={`${product.name} | GTT Premium Wholesale Blanks`}
        description={`Direct factory wholesale ${product.name}. ${product.fabric} in ${product.gsm}, engineered with ${product.fit} silhouette. Complete relabeling and custom finishing available.`}
        ogImage={product.image}
      />
      {/* Breadcrumbs Header */}
      <section style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--line-light)', padding: '16px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
          <ChevronRight size={12} />
          <Link to="/blanks" style={{ color: 'inherit' }}>Blanks</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--gray-dark)' }}>{product.category}</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--black)', fontWeight: 800 }}>{product.name}</span>
        </div>
      </section>

      {/* Main Product Stage */}
      <section className="section">
        <div className="wrap blank-detail-grid">
          
          {/* Left: Product Gallery */}
          <div className="blank-gallery-container">
            <div className="blank-gallery-main">
              {product.video && activeImage === 'VIDEO' ? (
                <SafeVideo
                  src={product.video}
                  poster={product.poster || product.images?.[0]}
                  fallbackImage={product.images?.[0]}
                  alt={`${product.name} Video Preview`}
                  controls={true}
                  autoPlay={true}
                  muted={true}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <SafeImage
                  src={activeImage}
                  fallbackSrc={product.images?.[0] || product.image}
                  alt={`${product.name} in ${selectedColor.name}`}
                  className="color-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {/* Zoom Inspection Trigger Button */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(10, 10, 10, 0.85)',
                  color: 'var(--white)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  zIndex: 6,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  transition: 'transform .2s ease'
                }}
                title="Inspect fabric & stitching (High-Res Zoom)"
              >
                <ZoomIn size={17} />
              </button>
              <div 
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  background: 'rgba(10, 10, 10, 0.85)',
                  color: 'var(--white)',
                  padding: '6px 12px',
                  borderRadius: 2,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                  zIndex: 4
                }}
              >
                {activeImage === 'VIDEO' ? 'PRODUCT VIDEO' : `COLOUR: ${selectedColor.name}`}
              </div>
            </div>

            {/* Thumbnail Rail */}
            {product.images && product.images.length > 1 && (
              <div className="blank-gallery-thumbs" role="tablist" aria-label="Product image thumbnails">
                {product.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={activeImage === imgUrl}
                    className={`blank-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={`Show view ${i + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="color-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Specifications & Actions */}
          <div className="blank-detail-sidebar">
            <div className="blank-detail-eyebrow">
              {product.category} &middot; UNBRANDED BLANK
            </div>
            
            <h1 className="blank-detail-title">
              {product.name}
            </h1>

            <p style={{ color: 'var(--gray-dark)', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
              {product.description}
            </p>

            {/* Colour Selector */}
            {product.colours && product.colours.length > 0 && (
              <div className="blank-detail-swatches-wrap">
                <div className="blank-detail-swatch-label">
                  SELECT SHADE: <span style={{ color: 'var(--black)' }}>{selectedColor.name}</span>
                </div>
                <div className="blank-detail-swatches">
                  {product.colours.map((col, idx) => {
                    const isActive = selectedColor.name === col.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleColorSelect(col)}
                        className={`blank-detail-swatch-item ${isActive ? 'active' : ''}`}
                        title={col.name}
                      >
                        <span className="blank-detail-swatch-circle" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="blank-detail-specs-table">
              {product.fit && (
                <div className="blank-detail-spec-row">
                  <span className="blank-detail-spec-key">Garment Fit</span>
                  <span className="blank-detail-spec-val">{product.fit}</span>
                </div>
              )}
              {product.fabric && (
                <div className="blank-detail-spec-row">
                  <span className="blank-detail-spec-key">Fabric Composition</span>
                  <span className="blank-detail-spec-val">{product.fabric}</span>
                </div>
              )}
              {product.gsm && (
                <div className="blank-detail-spec-row">
                  <span className="blank-detail-spec-key">Fabric Weight / GSM</span>
                  <span className="blank-detail-spec-val">{product.gsm}</span>
                </div>
              )}
              <div className="blank-detail-spec-row">
                <span className="blank-detail-spec-key">Sample MOQ</span>
                <span className="blank-detail-spec-val" style={{ fontWeight: 800 }}>{product.sampleMOQ || 3} PCS</span>
              </div>
              <div className="blank-detail-spec-row">
                <span className="blank-detail-spec-key">Bulk Production MOQ</span>
                <span className="blank-detail-spec-val" style={{ fontWeight: 800 }}>{product.bulkMOQ || 45} PCS</span>
              </div>
              <div className="blank-detail-spec-row">
                <span className="blank-detail-spec-key">Status &amp; Availability</span>
                <span className="blank-detail-spec-val">Sample Production Ready</span>
              </div>
              <div className="blank-detail-spec-row">
                <span className="blank-detail-spec-key">Labeling Format</span>
                <span className="blank-detail-spec-val">Tear-Away Satin Neck Tag</span>
              </div>
            </div>

            {/* Garment Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ margin: '16px 0 24px' }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                  CONSTRUCTION HIGHLIGHTS
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--gray-dark)' }}>
                  {product.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={14} style={{ color: 'var(--black)', flexShrink: 0, marginTop: 3 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customization Capabilities */}
            {product.customizationOptions && product.customizationOptions.length > 0 && (
              <div style={{ background: 'var(--off-white)', padding: '20px 22px', borderRadius: 2, border: '1px solid var(--line-light)', margin: '14px 0 24px' }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                  AVAILABLE BRANDING TECHNIQUES
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.customizationOptions.map((opt, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 10px',
                        background: 'var(--white)',
                        border: '1px solid var(--line-light)',
                        borderRadius: 2,
                        textTransform: 'uppercase'
                      }}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="blank-detail-actions">
              <button
                type="button"
                onClick={handleCustomizeBlank}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: 13 }}
              >
                CUSTOMIZE THIS BLANK &rarr;
              </button>

              <button
                type="button"
                onClick={handleRequestBlank}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: 13 }}
              >
                REQUEST WHOLESALE SAMPLE &rarr;
              </button>
            </div>

            {/* Back link */}
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link to="/blanks" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray-dark)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={13} /> Back to All Blanks
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* High-Resolution Zoom Lightbox for the Selected Color */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        src={selectedColor.zoomImage || selectedColor.image || activeImage}
        alt={`${product.name} - ${selectedColor.name}`}
        productName={product.name}
        colorName={selectedColor.name}
      />
    </div>
  );
}

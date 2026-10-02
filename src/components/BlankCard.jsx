import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sliders, ZoomIn, Eye } from 'lucide-react';
import SafeImage from './SafeImage';
import UniversalMedia from './UniversalMedia';
import ImageZoomModal from './ImageZoomModal';

/**
 * BlankCard Component
 * - Displays unique blank product with circular colour swatches.
 * - Selecting a swatch immediately switches the product card image.
 * - Displays configurable SAMPLE MOQ and BULK MOQ.
 * - Clicking the image or inspect icon opens the High-Resolution Zoom Lightbox for the selected colour.
 * - Links to the dedicated blank details page /blanks/:slug.
 */
export default function BlankCard({ product }) {
  const navigate = useNavigate();

  // Normalize variant options from product.variants or product.colours
  const rawVariants = product.variants && product.variants.length > 0 
    ? product.variants.map(v => ({
        name: v.color || v.name,
        colorCode: v.colorCode || v.hex || '#111111',
        image: v.image,
        zoomImage: v.zoomImage || v.image
      }))
    : (product.colours || []).map(c => ({
        name: c.name,
        colorCode: c.hex || '#111111',
        image: c.image,
        zoomImage: c.zoomImage || c.image
      }));

  const initialVariant = rawVariants[0] || {
    name: product.defaultColor || 'Default',
    colorCode: '#111111',
    image: product.images?.[0] || product.image,
    zoomImage: product.images?.[0] || product.image
  };

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Active image based on selected variant
  const activeImage = selectedVariant.image || product.images?.[0] || product.image;
  const activeZoomImage = selectedVariant.zoomImage || activeImage;

  // Helper to detect very light colors that need a distinct border
  const isLightColor = (hex) => {
    if (!hex) return false;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return false;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    // Perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 210;
  };

  const handleOpenZoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZoomOpen(true);
  };

  const handleCustomize = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigate('/contact', {
      state: {
        blankSpec: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          fit: product.fit,
          fabric: product.fabric,
          gsm: product.gsm,
          color: selectedVariant.name,
          colorHex: selectedVariant.colorCode,
          isCustom: true
        }
      }
    });
  };

  return (
    <>
      <article className="blank-card">
        {/* Product Visual Area with Hover Zoom Button */}
        <div className="blank-card-img-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
          <Link 
            to={`/blanks/${product.slug}`} 
            aria-label={`View details for ${product.name}`}
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <UniversalMedia
              media={{
                image: activeImage,
                video: product.video,
                mode: product.mediaMode || (product.video ? 'hover_video' : 'image_only'),
                mobileMode: product.mobileMediaMode || 'image_only',
                poster: activeImage,
                alt: `${product.name} - ${selectedVariant.name}`
              }}
              fallbackImage={product.images?.[0] || product.image}
              className="blank-card-img color-img"
              objectFit="cover"
            />
          </Link>

          {/* Category Tag */}
          <div className="blank-card-category-tag">
            {product.category}
          </div>

          {/* High-Resolution Zoom Trigger Button */}
          <button
            type="button"
            onClick={handleOpenZoom}
            className="blank-card-zoom-btn"
            title="Inspect fabric & stitching (High-Res Zoom)"
            aria-label="Inspect fabric & stitching"
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 6,
              background: 'rgba(10, 10, 10, 0.82)',
              color: 'var(--white)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'all .25s var(--ease)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
            }}
          >
            <ZoomIn size={15} />
          </button>
        </div>

        <div className="blank-card-body">
          {/* Circular Colour Swatches */}
          {rawVariants && rawVariants.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div 
                className="blank-card-selected-color" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontSize: 10.5, 
                  fontWeight: 700, 
                  letterSpacing: '.08em', 
                  textTransform: 'uppercase', 
                  color: 'var(--gray-dark)',
                  marginBottom: 8 
                }}
              >
                <span>COLOUR: <strong style={{ color: 'var(--black)' }}>{selectedVariant.name}</strong></span>
                <span style={{ fontSize: 10, color: 'var(--gray)' }}>{rawVariants.length} COLOURS</span>
              </div>

              {/* Perfectly round circular swatches */}
              <div 
                className="blank-card-swatches" 
                role="radiogroup" 
                aria-label="Available Colours"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap'
                }}
              >
                {rawVariants.map((col, idx) => {
                  const isActive = selectedVariant.name === col.name;
                  const isLight = isLightColor(col.colorCode);

                  return (
                    <button
                      key={idx}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`Select ${col.name}`}
                      title={col.name}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariant(col);
                      }}
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: '50%',
                        backgroundColor: col.colorCode,
                        border: isLight ? '1.5px solid rgba(0, 0, 0, 0.28)' : '1px solid rgba(0, 0, 0, 0.15)',
                        cursor: 'pointer',
                        padding: 0,
                        position: 'relative',
                        transform: isActive ? 'scale(1.22)' : 'scale(1)',
                        boxShadow: isActive 
                          ? '0 0 0 2px var(--white), 0 0 0 3.5px var(--black)' 
                          : 'none',
                        transition: 'transform .2s var(--ease), box-shadow .2s var(--ease)',
                        outline: 'none'
                      }}
                      className="blank-color-dot"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Product Name */}
          <h3 className="blank-card-name" style={{ marginTop: 2 }}>
            <Link to={`/blanks/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Technical Specifications */}
          <div className="blank-card-specs">
            {product.gsm && (
              <div className="blank-card-spec-row">
                <span className="blank-card-spec-label">Weight</span>
                <span className="blank-card-spec-val" title={product.gsm}>{product.gsm}</span>
              </div>
            )}
            {product.fabric && (
              <div className="blank-card-spec-row">
                <span className="blank-card-spec-label">Fabric</span>
                <span className="blank-card-spec-val" title={product.fabric}>{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="blank-card-spec-row">
                <span className="blank-card-spec-label">Fit</span>
                <span className="blank-card-spec-val" title={product.fit}>{product.fit}</span>
              </div>
            )}
          </div>

          {/* MOQ DISPLAY BADGE — Configurable per product */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              padding: '10px 12px',
              background: 'var(--off-white)',
              borderRadius: 2,
              border: '1px solid var(--line-light)',
              marginBottom: 16,
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '.06em',
              textTransform: 'uppercase'
            }}
          >
            <div>
              <span style={{ display: 'block', color: 'var(--gray-dark)', fontSize: 9.5, fontWeight: 700 }}>SAMPLE MOQ</span>
              <span style={{ color: 'var(--black)', fontSize: 11 }}>{product.sampleMOQ || 3} PCS</span>
            </div>
            <div style={{ borderLeft: '1px solid var(--line-light)', paddingLeft: 8 }}>
              <span style={{ display: 'block', color: 'var(--gray-dark)', fontSize: 9.5, fontWeight: 700 }}>BULK MOQ</span>
              <span style={{ color: 'var(--black)', fontSize: 11 }}>{product.bulkMOQ || 45} PCS</span>
            </div>
          </div>

          {/* Card Actions */}
          <div className="blank-card-actions">
            <Link to={`/blanks/${product.slug}`} className="blank-card-view-btn">
              <span>VIEW BLANK</span>
              <ArrowRight size={13} className="arrow-icon" />
            </Link>

            <button
              type="button"
              className="blank-card-custom-btn"
              onClick={handleCustomize}
              title="Build custom collection using this blank"
            >
              <Sliders size={12} style={{ display: 'inline', marginRight: 4 }} />
              CUSTOMIZE
            </button>
          </div>
        </div>
      </article>

      {/* High-Resolution Zoom Lightbox for the Selected Color */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        src={activeZoomImage}
        alt={`${product.name} - ${selectedVariant.name}`}
        productName={product.name}
        colorName={selectedVariant.name}
      />
    </>
  );
}

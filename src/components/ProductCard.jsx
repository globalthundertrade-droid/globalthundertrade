import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import UniversalMedia from './UniversalMedia';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/products/${product.category}/${product.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'var(--white)',
        border: '1px solid var(--line-light)',
        transition: 'transform .4s cubic-bezier(.16, .84, .32, 1), box-shadow .4s ease'
      }}
      className="p-card-item"
    >
      <div 
        style={{
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          background: 'var(--off-white)'
        }}
      >
        <UniversalMedia 
          media={{
            image: product.image,
            video: product.video,
            mode: product.mediaMode || (product.video ? 'hover_video' : 'image_only'),
            mobileMode: product.mobileMediaMode || 'image_only',
            poster: product.image,
            alt: product.name
          }}
          fallbackImage={product.fallbackImage || product.gallery?.[0] || product.image}
          isHovered={isHovered}
          objectFit="cover"
          objectPosition="center center"
          className="p-card-img"
        />

        <div 
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            padding: '5px 10px',
            fontSize: 10,
            letterSpacing: '.12em',
            fontWeight: 700,
            textTransform: 'uppercase',
            borderRadius: 2,
            color: 'var(--black)',
            zIndex: 2
          }}
        >
          {product.type}
        </div>
      </div>

      <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <h3 style={{ fontSize: 17, textTransform: 'uppercase', letterSpacing: '-.01em', fontWeight: 800 }}>
            {product.name}
          </h3>
          <ArrowUpRight size={16} className="p-card-icon" style={{ transition: 'transform .3s ease', flexShrink: 0 }} />
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray-dark)', marginTop: 8, lineHeight: 1.5, flexGrow: 1 }}>
          {product.tagline}
        </p>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line-light)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-dark)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          <span>{product.gsmOptions?.[0] || 'Custom Spec'}</span>
          <span>{product.fitOptions?.[0] || 'Custom Fit'}</span>
        </div>
      </div>

      <style>{`
        .p-card-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.06);
        }
        .p-card-item:hover .p-card-img {
          transform: scale(1.05);
        }
        .p-card-item:hover .p-card-icon {
          transform: translate(3px, -3px);
        }
      `}</style>
    </Link>
  );
}

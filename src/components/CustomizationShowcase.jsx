import React, { useState } from 'react';
import { COMPANY } from '../data/companyData';
import { ArrowUpRight } from 'lucide-react';

export default function CustomizationShowcase() {
  const options = COMPANY.customizationOptions;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOption = options[activeIndex];

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center',
        marginTop: 40
      }}
      className="custom-showcase-grid"
    >
      {/* Left Column: Interactive List */}
      <div>
        <ul style={{ listStyle: 'none' }}>
          {options.map((opt, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                style={{
                  borderTop: '1px solid var(--line-dark)',
                  padding: '16px 8px',
                  fontSize: 'clamp(18px, 2.4vw, 30px)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-.01em',
                  color: isActive ? 'var(--white)' : 'var(--gray)',
                  cursor: 'pointer',
                  paddingLeft: isActive ? 16 : 0,
                  transition: 'all .3s var(--ease)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{opt.label}</span>
                {isActive && <ArrowUpRight size={18} color="var(--white)" />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Column: High-Res Dynamic Visual */}
      <div 
        style={{
          position: 'relative',
          aspectRatio: '1/1',
          overflow: 'hidden',
          borderRadius: 3,
          background: 'var(--charcoal)',
          border: '1px solid var(--line-dark)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
        }}
      >
        <img 
          key={activeOption.image}
          src={activeOption.image} 
          alt={activeOption.label} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(0.6) contrast(1.15)',
            transition: 'opacity 0.4s ease'
          }}
        />

        {/* Overlay Details Box */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.88) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 30
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
            TECHNIQUE SPECIFICATION
          </span>
          <h3 style={{ fontSize: 24, color: 'var(--white)', marginTop: 4 }}>
            {activeOption.label}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--gray)', marginTop: 6, lineHeight: 1.5, maxWidth: 440 }}>
            {activeOption.desc}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .custom-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}

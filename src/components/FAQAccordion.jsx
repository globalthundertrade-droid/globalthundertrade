import React, { useState } from 'react';
import { FAQS } from '../data/faqsData';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ items = FAQS, isDark = false }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ width: '100%' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx}
            style={{
              borderTop: isDark ? '1px solid var(--line-dark)' : '1px solid var(--line-light)',
              borderBottom: idx === items.length - 1 ? (isDark ? '1px solid var(--line-dark)' : '1px solid var(--line-light)') : 'none'
            }}
          >
            <button
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 4px',
                textAlign: 'left',
                gap: 20
              }}
            >
              <h3 
                style={{ 
                  fontSize: 'clamp(16px, 1.8vw, 19px)', 
                  fontWeight: 700, 
                  textTransform: 'none', 
                  letterSpacing: '-.01em',
                  color: isDark ? 'var(--white)' : 'var(--black)'
                }}
              >
                {item.q}
              </h3>
              <ChevronDown 
                size={18} 
                style={{ 
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform .35s var(--ease)',
                  color: isDark ? 'var(--gray)' : 'var(--gray-dark)',
                  flexShrink: 0
                }} 
              />
            </button>

            <div 
              style={{
                maxHeight: isOpen ? 400 : 0,
                overflow: 'hidden',
                transition: 'max-height .45s var(--ease)'
              }}
            >
              <p 
                style={{ 
                  fontSize: 15, 
                  lineHeight: 1.65, 
                  color: isDark ? 'var(--gray)' : 'var(--gray-dark)', 
                  padding: '0 4px 26px',
                  maxWidth: 720
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

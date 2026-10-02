import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GOOGLE_REVIEWS } from '../data/reviewsData';
import { useCms } from '../context/CmsContext';
import { Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function ReviewCarousel() {
  const { reviews: cmsReviews } = useCms();
  const reviews = (cmsReviews && cmsReviews.length > 0)
    ? cmsReviews.filter(r => r.status !== 'hidden')
    : GOOGLE_REVIEWS;
  const [startIndex, setStartIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const prevReview = () => {
    setStartIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setStartIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ marginTop: 50, position: 'relative' }}>
      {/* Top Bar: Google Verified Badge & Nav Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--white)',
              color: 'var(--black)',
              padding: '7px 16px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.06em',
              border: '1px solid var(--line-light)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {/* Google Logo Icon SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>5.0 RATING &middot; VERIFIED GOOGLE CLIENT REVIEWS</span>
          </div>

          <span style={{ fontSize: 12, color: 'var(--gray-dark)' }}>
            Showing {isExpanded ? `all ${reviews.length}` : '3'} of {reviews.length} authentic brand testimonials
          </span>
        </div>

        {!isExpanded && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={prevReview} 
              aria-label="Previous review"
              style={{
                width: 42,
                height: 42,
                borderRadius: 2,
                border: '1px solid var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                transition: 'all .25s ease'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextReview} 
              aria-label="Next review"
              style={{
                width: 42,
                height: 42,
                borderRadius: 2,
                border: '1px solid var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--black)',
                color: 'var(--white)',
                transition: 'all .25s ease'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Review Cards View */}
      {!isExpanded ? (
        /* Carousel 3-Card View */
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }}
          className="review-cards-grid"
        >
          {[0, 1, 2].map((offset) => {
            const itemIndex = (startIndex + offset) % reviews.length;
            const r = reviews[itemIndex];
            return (
              <div
                key={r.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line-light)',
                  padding: '36px 30px',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                  transition: 'transform .35s ease'
                }}
                className="rev-item"
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 18, color: '#0a0a0a' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>

                {/* Quote */}
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--near-black)', flexGrow: 1, fontStyle: 'italic' }}>
                  "{r.text}"
                </p>

                {/* Reviewer Meta */}
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {r.author}
                    </div>
                    <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
                      {r.location}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4 }}>
                    {r.product}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Expanded Full Grid View showing all reviews */
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }}
          className="review-expanded-grid"
        >
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line-light)',
                padding: '34px 28px',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16, color: '#0a0a0a' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" stroke="none" />
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--near-black)', flexGrow: 1, fontStyle: 'italic' }}>
                "{r.text}"
              </p>

              {/* Reviewer Meta */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {r.author}
                  </div>
                  <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
                    {r.location}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4 }}>
                  {r.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More / Show Less Toggle Bar */}
      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-ghost"
          style={{
            padding: '14px 24px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--black)',
            background: isExpanded ? 'var(--black)' : 'transparent',
            color: isExpanded ? 'var(--white)' : 'var(--black)'
          }}
        >
          {isExpanded ? (
            <>SHOW FEWER REVIEWS <ChevronUp size={15} /></>
          ) : (
            <>SHOW MORE REVIEWS ({reviews.length}) <ChevronDown size={15} /></>
          )}
        </button>

        <Link 
          to="/reviews" 
          style={{ 
            fontSize: 12, 
            fontWeight: 700, 
            letterSpacing: '.06em', 
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--black)'
          }}
        >
          View Verified Reviews Archive <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .review-cards-grid, .review-expanded-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .review-cards-grid .rev-item:nth-child(3) {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .review-cards-grid, .review-expanded-grid {
            grid-template-columns: 1fr !important;
          }
          .review-cards-grid .rev-item:nth-child(2) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { GOOGLE_REVIEWS } from '../data/reviewsData';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function ReviewsPage() {
  const { reviews: cmsReviews } = useCms();
  const allReviews = (cmsReviews && cmsReviews.length > 0 ? cmsReviews : GOOGLE_REVIEWS).filter(r => r.status !== 'hidden');

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead />
      {/* Header */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="eyebrow">CLIENT VERIFICATION &amp; FEEDBACK</p>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', marginTop: 20 }}>
            REAL CLIENT REVIEWS.
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 17, maxWidth: 660, marginTop: 18, lineHeight: 1.65 }}>
            Verified feedback from independent brand founders, creative directors, and apparel labels who manufacture custom collections with Global Thunder Trade.
          </p>

          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 30,
              background: 'rgba(255,255,255,0.08)',
              padding: '12px 20px',
              borderRadius: 30,
              border: '1px solid var(--line-dark)'
            }}
          >
            <div style={{ display: 'flex', gap: 3, color: '#f3f3f3' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" stroke="none" />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              5.0 OVERALL RATING ACROSS VERIFIED GOOGLE CLIENTS
            </span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section">
        <div className="wrap">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 30
            }}
            className="reviews-wall-grid"
          >
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line-light)',
                  padding: '36px 30px',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ display: 'flex', gap: 3, color: 'var(--black)' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <span 
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <CheckCircle2 size={13} color="var(--black)" /> {rev.date}
                  </span>
                </div>

                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--near-black)', fontStyle: 'italic', flexGrow: 1 }}>
                  "{rev.text}"
                </p>

                <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>
                      {rev.author}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--gray-dark)', textTransform: 'uppercase' }}>
                      {rev.location}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-dark)', marginTop: 4 }}>
                    {rev.product}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            style={{
              marginTop: 80,
              padding: 44,
              background: 'var(--off-white)',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <h3 style={{ fontSize: 26, textTransform: 'uppercase' }}>
              READY TO MANUFACTURE YOUR NEXT DROP?
            </h3>
            <p style={{ color: 'var(--gray-dark)', fontSize: 15, marginTop: 8, maxWidth: 540, margin: '8px auto 26px' }}>
              Send your mockup or tech pack to begin your sample prototype with Global Thunder Trade.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Send Your Mockup <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .reviews-wall-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .reviews-wall-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}

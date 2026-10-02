import React from 'react';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AeoDirectAnswer Component
 * Provides machine-readable, concise, structured answer sections
 * optimized for Google AI Overviews, Perplexity, search crawlers, and LLMs.
 */
export default function AeoDirectAnswer({
  question,
  directAnswer,
  bulletPoints = [],
  ctaText = 'Explore Manufacturing Services',
  ctaLink = '/services'
}) {
  return (
    <section className="section" style={{ background: 'var(--off-white)', borderTop: '1px solid var(--line-light)', borderBottom: '1px solid var(--line-light)', padding: '50px 0' }}>
      <div className="wrap">
        <div style={{ maxWidth: 880 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-dark)', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            <HelpCircle size={14} style={{ color: 'var(--black)' }} />
            <span>EXECUTIVE BRIEF &middot; DIRECT ANSWER</span>
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-.02em', textTransform: 'uppercase', marginBottom: 16 }}>
            {question}
          </h2>

          <div style={{
            background: 'var(--white)',
            borderLeft: '3px solid var(--black)',
            padding: '20px 24px',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--black)',
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <strong>Direct Answer: </strong>{directAnswer}
          </div>

          {bulletPoints && bulletPoints.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 20 }}>
              {bulletPoints.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, lineHeight: 1.5, color: 'var(--gray-dark)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--black)', flexShrink: 0, marginTop: 3 }} />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}

          {ctaText && ctaLink && (
            <div style={{ marginTop: 24 }}>
              <Link to={ctaLink} className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 16px' }}>
                {ctaText} <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Layers, Box, Tag, ShieldCheck } from 'lucide-react';
import { BLANK_TRANSFORMATION_STAGES } from '../data/blanksData';

export default function BlankScrollTransform() {
  const stages = BLANK_TRANSFORMATION_STAGES;
  const total = stages.length;

  const trackRef = useRef(null);
  const rafId = useRef(null);

  // Normalized scroll progress [0.0, 1.0]
  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // High-performance scroll listener using requestAnimationFrame
  const updateProgress = useCallback(() => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = trackHeight - viewportHeight;

    if (scrollableDistance <= 0) return;

    // Scrolled amount within the sticky track
    const scrolled = -rect.top;
    const clampedProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setProgress(clampedProgress);
      const newIndex = Math.min(total - 1, Math.floor(clampedProgress * total));
      setActiveStageIndex(newIndex);
    });
  }, [total]);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateProgress]);

  // Jump smoothly to a specific stage
  const jumpToStage = (idx) => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.getBoundingClientRect().top + window.scrollY;
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = trackHeight - viewportHeight;

    const targetProgress = (idx + 0.1) / total;
    const targetScrollY = trackTop + targetProgress * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  const currentStage = stages[activeStageIndex] || stages[0];

  return (
    <section className="blanks-transform-track section-dark" ref={trackRef} aria-label="From Blank to Your Brand Scroll Experience">
      <div className="blanks-transform-sticky">
        <div className="wrap" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header Bar */}
          <div className="blanks-transform-header">
            <div>
              <p className="eyebrow" style={{ color: 'var(--gray)' }}>
                THE TRANSFORMATION JOURNEY
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 42px)', marginTop: 6, letterSpacing: '-.03em' }}>
                FROM BLANK TO YOUR BRAND.
              </h2>
            </div>

            {/* Quick jump navigation */}
            <div className="blanks-transform-stage-nav" role="tablist" aria-label="Transformation Stages">
              {stages.map((st, i) => (
                <button
                  key={st.id}
                  role="tab"
                  aria-selected={activeStageIndex === i}
                  className={`blanks-transform-stage-btn ${activeStageIndex === i ? 'active' : ''}`}
                  onClick={() => jumpToStage(i)}
                >
                  {st.step}. {st.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stage Presentation Grid */}
          <div className="blanks-transform-grid">
            
            {/* Visual Transformation Box */}
            <div className="blanks-transform-visual-box">
              <div className="blanks-transform-stage-badge">
                {currentStage.eyebrow}
              </div>

              {/* Stacked Images crossfading smoothly */}
              {stages.map((st, idx) => {
                const isActive = activeStageIndex === idx;
                return (
                  <img
                    key={st.id}
                    src={st.image}
                    alt={st.heading}
                    className="blanks-transform-img color-img"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1)' : 'scale(1.06)',
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                    loading="lazy"
                  />
                );
              })}

              {/* Dynamic Overlay Elements Simulating Customization */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  background: 'rgba(10, 10, 10, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 16px',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}
              >
                <span style={{ color: 'var(--gray)' }}>SPECIFICATION //</span>
                <span style={{ color: 'var(--white)' }}>{currentStage.visualTone}</span>
              </div>
            </div>

            {/* Copy / Narrative Column */}
            <div className="blanks-transform-copy-col">
              <div className="blanks-transform-step-num">
                {currentStage.step}
              </div>
              <div className="blanks-transform-eyebrow">
                {currentStage.title}
              </div>
              <h3 className="blanks-transform-heading">
                {currentStage.heading}
              </h3>
              <p className="blanks-transform-desc">
                {currentStage.description}
              </p>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="blanks-transform-highlight-pill">
                  <Check size={14} style={{ color: 'var(--white)' }} />
                  <span>{currentStage.highlight}</span>
                </div>

                <Link
                  to="/contact"
                  className="btn btn-primary blanks-transform-cta-btn"
                  style={{ fontSize: 11, padding: '12px 20px' }}
                >
                  Customize This Blank &rarr;
                </Link>
              </div>

              {/* Progress Bar Indicator */}
              <div style={{ marginTop: 36, width: '100%', maxWidth: 360 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.12em', color: 'var(--gray)', marginBottom: 6, fontWeight: 700 }}>
                  <span>TRANSFORMATION PROGRESS</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div style={{ width: '100%', height: 3, background: 'rgba(255, 255, 255, 0.12)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress * 100}%`,
                      background: 'var(--white)',
                      transition: 'width 0.1s linear'
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

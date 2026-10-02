import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Layers, Box, Compass, Scissors, Palette, Camera, Rocket } from 'lucide-react';
import { JOURNEY_STAGES } from '../data/journeyData';
import SafeImage from './SafeImage';

export default function JourneyScrollStory() {
  const stages = JOURNEY_STAGES;
  const total = stages.length;

  const trackRef = useRef(null);
  const rafId = useRef(null);

  // Normalized scroll progress [0.0, 1.0]
  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Scroll listener with requestAnimationFrame and exact navbar offset
  const updateProgress = useCallback(() => {
    if (!trackRef.current) return;

    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight - navHeight;
    const scrollableDistance = trackHeight - viewportHeight;

    if (scrollableDistance <= 0) return;

    // Pinning occurs at rect.top <= navHeight
    const scrolled = navHeight - rect.top;
    const clampedProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setProgress(clampedProgress);
      // Evenly distribute 8 stages across the scroll range
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

  // Jump smoothly to a specific stage when clicked
  const jumpToStage = (idx) => {
    if (!trackRef.current) return;
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
    const trackTop = trackRef.current.getBoundingClientRect().top + window.scrollY;
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight - navHeight;
    const scrollableDistance = trackHeight - viewportHeight;

    const targetProgress = (idx + 0.1) / total;
    const targetScrollY = (trackTop - navHeight) + targetProgress * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  const currentStage = stages[activeStageIndex] || stages[0];

  return (
    <section 
      className="journey-scroll-track section-dark" 
      ref={trackRef} 
      id="positioning"
      aria-label="Your Idea. Our Expertise. 8-Stage Manufacturing Journey"
    >
      <div className="journey-sticky-container">
        <div className="wrap" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Section Header with full 8-point visible roadmap */}
          <div className="journey-header">
            <div className="journey-header-top">
              <p className="eyebrow" style={{ color: 'var(--gray)' }}>
                MORE THAN A FACTORY &middot; COMPLETE BRAND ARCHITECTURE
              </p>
              <h2 className="journey-main-heading">
                YOUR IDEA. OUR EXPERTISE. ONE FINISHED PRODUCT.
              </h2>
            </div>

            {/* VISIBLE 8-STAGE ROADMAP (ALONGSIDE SCROLL INTERACTION) */}
            <div className="journey-stages-overview-grid" role="tablist" aria-label="8-Stage Manufacturing Journey">
              {stages.map((st, i) => {
                const isActive = activeStageIndex === i;
                return (
                  <button
                    key={st.step}
                    role="tab"
                    aria-selected={isActive}
                    className={`journey-stage-step-card ${isActive ? 'active' : ''}`}
                    onClick={() => jumpToStage(i)}
                    title={`Stage ${st.step} — ${st.title}`}
                  >
                    <div className="journey-step-card-num-row">
                      <span className="journey-step-card-num">{st.step}</span>
                      <span className="journey-step-card-phase">{st.phase}</span>
                    </div>
                    <span className="journey-step-card-title">{st.title}</span>
                    <div className="journey-step-card-line" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Presentation Grid */}
          <div className="journey-content-grid">
            
            {/* Left Column: Stage Copy, Narrative & Services */}
            <div className="journey-narrative-col">
              <div className="journey-step-indicator">
                <span className="journey-step-number">{currentStage.step}</span>
                <div className="journey-step-meta-group">
                  <span className="journey-step-badge">{currentStage.step} &mdash; {currentStage.title}</span>
                  <span className="journey-step-phase">// {currentStage.phase}</span>
                </div>
              </div>

              <h3 className="journey-stage-title">
                {currentStage.title}
              </h3>

              <h4 className="journey-stage-heading">
                {currentStage.heading}
              </h4>

              <p className="journey-stage-desc">
                {currentStage.description}
              </p>

              {/* Service Capabilities Badges */}
              <div className="journey-services-badges">
                {currentStage.services.map((srv, idx) => (
                  <span key={idx} className="journey-service-pill">
                    <Check size={12} className="journey-check-icon" />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>

              {/* Action Link & Progress */}
              <div className="journey-action-row">
                <Link to="/contact" className="btn btn-primary journey-cta-btn">
                  Start Your Production <ArrowRight size={14} />
                </Link>

                <div className="journey-progress-indicator">
                  <div className="journey-progress-labels">
                    <span>STAGE {currentStage.step} OF 08 // {currentStage.title}</span>
                    <span>{Math.round(((activeStageIndex + 1) / total) * 100)}%</span>
                  </div>
                  <div className="journey-progress-bar-track">
                    <div 
                      className="journey-progress-bar-fill" 
                      style={{ width: `${((activeStageIndex + 1) / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Stage Showcase */}
            <div className="journey-visual-col">
              <div className="journey-visual-box">
                {/* Floating Top Badge */}
                <div className="journey-spec-badge">
                  {currentStage.specBadge}
                </div>

                {/* Stacked Media Layers Crossfading Smoothly */}
                {stages.map((st, idx) => {
                  const isActive = activeStageIndex === idx;
                  return (
                    <div
                      key={st.step}
                      className="journey-stage-image"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'scale(1)' : 'scale(1.05)',
                        pointerEvents: isActive ? 'auto' : 'none',
                        transition: 'opacity 0.55s var(--ease), transform 0.75s var(--ease)'
                      }}
                    >
                      <SafeImage
                        src={st.image}
                        fallbackSrc={st.fallbackImage || st.image}
                        alt={`GTT ${st.title} Stage - ${st.heading}`}
                        objectFit="cover"
                        objectPosition="center center"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  );
                })}

                {/* Floating Bottom Specification Strip */}
                <div className="journey-spec-footer">
                  <span style={{ color: 'var(--gray)' }}>GLOBAL THUNDER TRADE //</span>
                  <span style={{ color: 'var(--white)', fontWeight: 800 }}>STAGE {currentStage.step} &middot; {currentStage.title}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

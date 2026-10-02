import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Sliders, ChevronDown } from 'lucide-react';
import { CUSTOMIZATION_STORY_DATA } from '../data/customizationStoryData';
import { useCms } from '../context/CmsContext';

export default function ScrollStoryShowcase() {
  const { content } = useCms();
  const cmsCustomization = content?.homepage?.customization || content?.home?.customization || {};

  const data = CUSTOMIZATION_STORY_DATA.map(item => {
    const cmsItem = cmsCustomization[item.id];
    return {
      ...item,
      image: cmsItem?.image || item.image,
      video: cmsItem?.video !== undefined ? cmsItem.video : item.video,
      poster: cmsItem?.image || item.poster || item.image,
      alt: cmsItem?.alt || item.alt
    };
  });
  const total = data.length;

  const trackRef = useRef(null);
  const videoRefs = useRef([]);
  const rafId = useRef(null);

  // Normalized scroll progress [0.0, 1.0]
  const [progress, setProgress] = useState(0);
  // Integer active index (0 to 5) for quick UI state
  const [activeIndex, setActiveIndex] = useState(0);
  // Video load error tracking
  const [videoErrors, setVideoErrors] = useState({});

  // Calculate continuous float index [0.0, total - 1]
  const floatIndex = progress * (total - 1);

  // High-performance scroll listener with requestAnimationFrame
  const updateScrollProgress = useCallback(() => {
    if (!trackRef.current) return;

    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight - navHeight;
    const scrollableDistance = trackHeight - viewportHeight;

    if (scrollableDistance <= 0) return;

    // Pinning occurs at rect.top <= navHeight.
    // Scrolled distance starts at 0 the exact instant pinning begins.
    const scrolled = navHeight - rect.top;
    const clampedProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setProgress(clampedProgress);
      const newIdx = Math.min(total - 1, Math.floor(clampedProgress * total));
      setActiveIndex(newIdx);
    });
  }, [total]);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateScrollProgress]);

  // Video playback management synchronized to active slide
  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      const distance = Math.abs(floatIndex - idx);

      // Play video when this slide is in focus
      if (distance < 0.55) {
        if (videoEl.paused) {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Graceful catch for autoplay policies
            });
          }
        }
      } else {
        // Pause inactive videos to free up GPU and CPU resources
        if (!videoEl.paused) {
          videoEl.pause();
        }
      }
    });
  }, [floatIndex]);

  // Click step to smoothly scroll directly to that category
  const scrollToCategory = (idx) => {
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

  const handleVideoError = (idx) => {
    setVideoErrors((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div
      ref={trackRef}
      className="scroll-story-track"
      id="customization-story"
      aria-label="Customization storytelling sequence"
    >
      <div className="scroll-story-viewport">
        {/* Ambient background glow */}
        <div className="story-ambient-glow" />

        <div className="wrap story-wrap">
          {/* TOP PERSISTENT SECTION HEADER */}
          <div className="story-header">
            <div className="story-header-left">
              <span className="eyebrow story-eyebrow">
                FULL CUSTOMIZATION & BESPOKE PRODUCTION
              </span>
              <h2 className="story-main-title">
                YOUR PRODUCT. <span className="text-stroke">YOUR RULES.</span>
              </h2>
            </div>
            <div className="story-header-right">
              <div className="story-overall-progress">
                <span className="story-progress-label">
                  SEQUENCE PROGRESS // {Math.round(progress * 100)}%
                </span>
                <div className="story-progress-bar-track">
                  <div
                    className="story-progress-bar-fill"
                    style={{ width: `${Math.max(4, progress * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN CINEMATIC CONTAINER */}
          <div className="story-body-grid">
            {/* ================= LEFT COLUMN: CONTENT & CONTROLS ================= */}
            <div className="story-left-column">
              {/* Category Quick Selector Pills */}
              <div className="story-category-tabs" role="tablist">
                {data.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  const itemProgress = Math.max(0, Math.min(1, (floatIndex - (idx - 0.5))));
                  return (
                    <button
                      key={item.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => scrollToCategory(idx)}
                      className={`story-tab-btn ${isActive ? 'active' : ''}`}
                      title={`Jump to ${item.category}`}
                    >
                      <span className="story-tab-num">{item.number}</span>
                      <span className="story-tab-title">{item.category}</span>
                      {isActive && <div className="story-tab-active-indicator" />}
                    </button>
                  );
                })}
              </div>

              {/* Stack of text chapters crossfading in sync with scroll */}
              <div className="story-text-stage">
                {data.map((item, idx) => {
                  const diff = floatIndex - idx;
                  const absDiff = Math.abs(diff);

                  // Visibility window: visible if within 0.95 of index
                  const isVisible = absDiff < 0.95;

                  // Smooth opacity curve starting immediately with zero dead zone
                  let opacity = 0;
                  if (absDiff <= 0.2) {
                    opacity = 1;
                  } else if (absDiff < 0.8) {
                    opacity = 1 - (absDiff - 0.2) / 0.6;
                  }

                  // Parallax subtle vertical movement: enters from below (+22px), exits above (-22px)
                  const translateY = -diff * 22;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={item.id}
                      className="story-text-card"
                      style={{
                        opacity,
                        transform: `translate3d(0, ${translateY}px, 0)`,
                        pointerEvents: absDiff < 0.4 ? 'auto' : 'none'
                      }}
                    >
                      <div className="story-chapter-meta">
                        <span className="story-chapter-number">
                          TECHNIQUE {item.number} / {item.total}
                        </span>
                        <span className="story-tech-code">GTT-SPEC-{item.number}</span>
                      </div>

                      <h3 className="story-category-headline">
                        {item.headline}
                      </h3>

                      <p className="story-subheadline">
                        {item.subheadline}
                      </p>

                      <p className="story-description">
                        {item.description}
                      </p>

                      {/* Technical specifications grid */}
                      <div className="story-specs-grid">
                        {item.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="story-spec-item">
                            <span className="story-spec-label">{spec.label}</span>
                            <span className="story-spec-value">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action CTA */}
                      <div className="story-cta-row">
                        <Link to="/contact" className="story-cta-btn">
                          <span>Inquire {item.category}</span>
                          <ArrowUpRight size={16} />
                        </Link>
                        <Link to="/contact" className="story-secondary-cta">
                          Request Swatches
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scroll guidance hint */}
              <div className="story-scroll-hint">
                <ChevronDown size={14} className="story-scroll-arrow" />
                <span>SCROLL DOWN TO ADVANCE CUSTOMIZATION STORY</span>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: CINEMATIC VISUAL / VIDEO ================= */}
            <div className="story-right-column">
              <div className="story-visual-frame">
                {/* Industrial HUD overlays & corner registration marks */}
                <div className="hud-corner hud-top-left">+</div>
                <div className="hud-corner hud-top-right">+</div>
                <div className="hud-corner hud-bottom-left">+</div>
                <div className="hud-corner hud-bottom-right">+</div>

                {/* Top HUD Technical Bar */}
                <div className="story-hud-top-bar">
                  <div className="hud-live-tag">
                    <span className="hud-rec-dot" />
                    <span>SPEC_SYS // ACTIVE</span>
                  </div>
                  <div className="hud-metric">
                    <span>STAGE {data[activeIndex]?.number || '01'} / 06</span>
                  </div>
                </div>

                {/* Media Layers Container */}
                <div className="story-media-stack">
                  {data.map((item, idx) => {
                    const diff = floatIndex - idx;
                    const absDiff = Math.abs(diff);
                    const isVisible = absDiff < 1.0;

                    // Smooth opacity curve for visual crossfade starting immediately
                    let opacity = 0;
                    if (absDiff <= 0.25) {
                      opacity = 1;
                    } else if (absDiff < 0.85) {
                      opacity = 1 - (absDiff - 0.25) / 0.6;
                    }

                    // Subtle cinematic scale & vertical parallax
                    const scale = 1.0 - Math.min(0.06, absDiff * 0.06);
                    const translateY = -diff * 14;

                    if (!isVisible) return null;

                    const hasVideoError = videoErrors[idx];

                    return (
                      <div
                        key={item.id}
                        className="story-media-layer"
                        style={{
                          opacity,
                          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                          zIndex: absDiff < 0.5 ? 2 : 1
                        }}
                      >
                        {/* Video Layer (Autoplays inline when active) */}
                        {!hasVideoError && item.video ? (
                          <video
                            ref={(el) => (videoRefs.current[idx] = el)}
                            src={item.video}
                            poster={item.image}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onError={() => handleVideoError(idx)}
                            className="story-media-video"
                            aria-label={item.alt}
                          />
                        ) : null}

                        {/* High-Resolution Poster Fallback Image (always present underneath for instant display) */}
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="story-media-fallback-img"
                          loading="eager"
                        />

                        {/* High-end contrast and vignette scrim */}
                        <div className="story-media-scrim" />

                        {/* In-scene Caption Badge */}
                        <div className="story-scene-badge">
                          <span className="scene-badge-sub">GTT ARCHITECTURAL CUSTOMIZATION</span>
                          <span className="scene-badge-main">{item.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom HUD Technical Bar */}
                <div className="story-hud-bottom-bar">
                  <div className="hud-metric">
                    <span>OUTPUT: 4K HIGH DENSITY</span>
                  </div>
                  <div className="hud-metric">
                    <span>CERTIFIED LUXURY EXPORT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT SCOPED STYLING */}
      <style>{`
        /* The outer track provides the physical scroll distance */
        .scroll-story-track {
          position: relative;
          width: 100%;
          height: 560vh; /* Deliberate, smooth scroll pace for 9 customization stages */
          background: #080808;
          color: var(--white);
          margin-top: -1px;
          margin-bottom: -1px;
        }

        /* The sticky viewport stays locked right below navbar during scrolling */
        .scroll-story-viewport {
          position: sticky;
          top: var(--nav-h);
          left: 0;
          width: 100%;
          height: calc(100vh - var(--nav-h));
          overflow: hidden;
          display: flex;
          align-items: center;
          background: #080808;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
        }

        .story-ambient-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
          top: 20%;
          right: 15%;
          pointer-events: none;
          z-index: 0;
        }

        .story-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--nav-h) - 30px);
          max-height: 840px;
          justify-content: space-between;
        }

        /* Top Header */
        .story-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .story-eyebrow {
          color: #a0a09c !important;
          font-size: 11px;
          letter-spacing: .22em;
          margin-bottom: 6px;
        }

        .story-eyebrow::before {
          background: #a0a09c !important;
        }

        .story-main-title {
          font-size: clamp(26px, 3.2vw, 42px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 0;
          color: #ffffff;
        }

        .text-stroke {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
        }

        .story-main-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #a0a09c;
          max-width: 480px;
          margin: 0 0 10px 0;
        }

        .story-overall-progress {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .story-progress-label {
          font-size: 10px;
          font-family: monospace, -apple-system, sans-serif;
          letter-spacing: 0.16em;
          color: #777774;
        }

        .story-progress-bar-track {
          width: 100%;
          max-width: 480px;
          height: 2px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
          position: relative;
        }

        .story-progress-bar-fill {
          height: 100%;
          background: #ffffff;
          transition: width 0.1s linear;
        }

        /* Body Grid */
        .story-body-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 60px;
          align-items: center;
          flex-grow: 1;
          padding: 24px 0 16px;
          min-height: 0;
        }

        /* Left Column */
        .story-left-column {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          position: relative;
          min-height: 0;
        }

        /* Category Quick Tabs */
        .story-category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .story-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #888885;
          padding: 6px 12px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          position: relative;
          cursor: pointer;
        }

        .story-tab-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .story-tab-btn.active {
          color: #ffffff;
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
        }

        .story-tab-num {
          font-size: 10px;
          font-family: monospace, sans-serif;
          opacity: 0.7;
        }

        .story-tab-active-indicator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffffff;
          margin-left: 2px;
        }

        /* Stack of Text Chapters */
        .story-text-stage {
          position: relative;
          flex-grow: 1;
          display: flex;
          align-items: center;
          min-height: 300px;
        }

        .story-text-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          will-change: opacity, transform;
          transition: opacity 0.15s linear;
        }

        .story-chapter-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .story-chapter-number {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ffffff;
          font-family: monospace, sans-serif;
          background: rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 2px;
          border-left: 2px solid #ffffff;
        }

        .story-tech-code {
          font-size: 11px;
          font-family: monospace, sans-serif;
          color: #777774;
          letter-spacing: 0.1em;
        }

        .story-category-headline {
          font-size: clamp(22px, 2.6vw, 36px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .story-subheadline {
          font-size: 14px;
          font-weight: 600;
          color: #d4d4d0;
          margin: 0 0 14px 0;
          letter-spacing: 0.01em;
        }

        .story-description {
          font-size: 14px;
          line-height: 1.6;
          color: #9a9a95;
          margin: 0 0 20px 0;
          max-width: 540px;
        }

        /* Specifications Grid */
        .story-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 18px;
          padding: 16px 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          margin-bottom: 22px;
          max-width: 540px;
        }

        .story-spec-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .story-spec-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #70706d;
          font-weight: 700;
          font-family: monospace, sans-serif;
        }

        .story-spec-value {
          font-size: 12px;
          font-weight: 600;
          color: #e4e4e0;
        }

        /* CTA Row */
        .story-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .story-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #000000;
          padding: 12px 22px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .story-cta-btn:hover {
          background: #e0e0dc;
          transform: translateY(-2px);
        }

        .story-secondary-cta {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #888885;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease;
        }

        .story-secondary-cta:hover {
          color: #ffffff;
        }

        .story-scroll-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: #666663;
          margin-top: 14px;
          flex-shrink: 0;
        }

        .story-scroll-arrow {
          animation: pulseArrow 2s infinite ease-in-out;
        }

        @keyframes pulseArrow {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(3px); opacity: 1; }
        }

        /* Right Column: Cinematic Media Frame */
        .story-right-column {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 0;
        }

        .story-visual-frame {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 1 / 1;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 3px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* HUD Corners */
        .hud-corner {
          position: absolute;
          font-family: monospace, sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          z-index: 10;
          line-height: 1;
          pointer-events: none;
        }

        .hud-top-left { top: 12px; left: 14px; }
        .hud-top-right { top: 12px; right: 14px; }
        .hud-bottom-left { bottom: 12px; left: 14px; }
        .hud-bottom-right { bottom: 12px; right: 14px; }

        /* HUD Top & Bottom Bars */
        .story-hud-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9;
          padding: 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
          font-family: monospace, sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.8);
          pointer-events: none;
        }

        .hud-live-tag {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hud-rec-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          animation: recBlink 1.6s infinite ease-in-out;
        }

        @keyframes recBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .story-hud-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9;
          padding: 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
          font-family: monospace, sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
          pointer-events: none;
        }

        /* Media Stack */
        .story-media-stack {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .story-media-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: opacity, transform;
          transition: opacity 0.15s linear;
        }

        .story-media-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.65) contrast(1.18) brightness(0.92);
          z-index: 2;
        }

        .story-media-fallback-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.03) brightness(0.98);
          z-index: 1;
        }

        .story-media-scrim {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.45) 100%);
          z-index: 3;
          pointer-events: none;
        }

        .story-scene-badge {
          position: absolute;
          bottom: 38px;
          left: 28px;
          z-index: 8;
          display: flex;
          flex-direction: column;
          gap: 4px;
          pointer-events: none;
        }

        .scene-badge-sub {
          font-size: 9px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.18em;
          color: #a0a09c;
          text-transform: uppercase;
        }

        .scene-badge-main {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }

        /* ================= RESPONSIVE DESIGN ================= */
        @media (max-width: 1200px) {
          .story-wrap {
            padding: 0 30px;
          }
          .story-body-grid {
            gap: 40px;
          }
          .story-specs-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        @media (max-width: 1024px) {
          .scroll-story-track {
            height: 380vh;
          }
          .story-body-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .story-main-desc {
            max-width: 380px;
          }
        }

        @media (max-width: 860px) {
          .scroll-story-track {
            height: 340vh;
          }
          .scroll-story-viewport {
            top: var(--nav-h);
            height: calc(100vh - var(--nav-h));
            padding-top: 6px;
          }
          .story-wrap {
            padding: 0 20px;
            height: calc(100vh - var(--nav-h) - 16px);
            max-height: none;
          }
          .story-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding-bottom: 12px;
          }
          .story-header-right {
            width: 100%;
          }
          .story-main-desc {
            display: none; /* Keep viewport clean on mobile */
          }
          .story-body-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 12px 0 8px;
          }
          .story-right-column {
            order: 1;
            max-height: 38vh;
          }
          .story-visual-frame {
            aspect-ratio: 16 / 10;
            max-height: 38vh;
          }
          .story-left-column {
            order: 2;
            height: auto;
          }
          .story-category-tabs {
            margin-bottom: 10px;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .story-tab-btn {
            padding: 4px 10px;
            font-size: 10px;
            flex-shrink: 0;
          }
          .story-text-stage {
            min-height: 220px;
          }
          .story-category-headline {
            font-size: 20px;
          }
          .story-subheadline {
            font-size: 12px;
            margin-bottom: 8px;
          }
          .story-description {
            font-size: 12px;
            line-height: 1.45;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .story-specs-grid {
            display: none; /* Conserve vertical space on mobile so no scroll clipping */
          }
          .story-scroll-hint {
            display: none;
          }
          .story-scene-badge {
            bottom: 24px;
            left: 18px;
          }
        }

        @media (max-width: 480px) {
          .story-main-title {
            font-size: 22px;
          }
          .story-visual-frame {
            aspect-ratio: 16 / 9;
            max-height: 32vh;
          }
          .story-text-stage {
            min-height: 180px;
          }
          .story-cta-row {
            gap: 10px;
          }
          .story-cta-btn {
            padding: 9px 16px;
            font-size: 11px;
          }
          .story-secondary-cta {
            font-size: 11px;
          }
        }

        /* Accessibility: Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .story-text-card,
          .story-media-layer {
            transform: none !important;
            transition: opacity 0.3s ease !important;
          }
          .story-scroll-arrow,
          .hud-rec-dot {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

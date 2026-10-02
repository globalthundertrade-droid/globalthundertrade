import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category, index }) {
  const navigate = useNavigate();
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef(null);

  // Synchronize video playback with interaction state
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (videoActive && category.video) {
      vid.muted = true;
      vid.defaultMuted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      vid.pause();
      try {
        vid.currentTime = 0;
      } catch (e) {}
    }
  }, [videoActive, category.video]);

  // Desktop hover interactions
  const handleMouseEnter = () => {
    if (category.video) {
      setVideoActive(true);
    }
  };

  const handleMouseLeave = () => {
    setVideoActive(false);
  };

  // Click card navigates to category
  const handleCardClick = (e) => {
    navigate(`/products/${category.slug}`);
  };

  // Arrow / interaction control
  const handleArrowClick = (e) => {
    e.stopPropagation();
    // On touch device or arrow click: if not playing, start playing; otherwise navigate
    if (!videoActive && category.video) {
      e.preventDefault();
      setVideoActive(true);
    } else {
      navigate(`/products/${category.slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="link"
      aria-label={`Explore ${category.title} manufacturing division`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRadius: 2,
        aspectRatio: '10/14',
        background: 'var(--charcoal)',
        border: '1px solid var(--line-light)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        textDecoration: 'none'
      }}
      className="cat-card"
    >
      {/* Visual Media Layer: Base Image + Interaction-Triggered Video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="cat-media-inner"
        >
          {/* Base Category Image from assigned category folder */}
          {category.image && (
            <img
              src={category.image}
              alt={category.title}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block'
              }}
              className="cat-img"
            />
          )}

          {/* Corresponding Category Video from same folder (plays on arrow / hover interaction) */}
          {category.video && (
            <video
              ref={videoRef}
              src={category.video}
              muted
              loop
              playsInline
              preload="none"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                opacity: videoActive ? 1 : 0,
                transition: 'opacity 0.35s ease',
                pointerEvents: 'none',
                display: 'block'
              }}
              className="cat-video"
            />
          )}
        </div>
      </div>

      {/* Dark Editorial Gradient Scrim for Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,0.92) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(18px, 1.8vw, 24px)',
          zIndex: 2,
          transition: 'padding 0.35s ease'
        }}
        className="cat-overlay"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', color: 'var(--white)', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700, display: 'block' }}>
              0{index + 1} &mdash; CATEGORY
            </span>
            <h3 style={{
              fontSize: 'clamp(17px, 1.5vw, 22px)',
              fontWeight: 800,
              marginTop: 4,
              letterSpacing: '-.01em',
              textTransform: 'uppercase',
              lineHeight: 1.15,
              wordBreak: 'break-word'
            }}>
              {category.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleArrowClick}
            aria-label={`Enter ${category.title}`}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: videoActive ? 'var(--white)' : 'rgba(255,255,255,0.15)',
              color: videoActive ? 'var(--black)' : 'var(--white)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.35s ease, background 0.35s ease, color 0.35s ease'
            }}
            className="cat-arrow"
          >
            <ArrowUpRight size={16} />
          </button>
        </div>

        <p
          style={{
            fontSize: 12.5,
            lineHeight: 1.45,
            color: 'var(--gray)',
            marginTop: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {category.description}
        </p>
      </div>

      <style>{`
        .cat-card:hover .cat-media-inner {
          transform: scale(1.05);
        }
        .cat-card:hover .cat-arrow {
          transform: translate(3px, -3px);
          background: var(--white);
          color: var(--black);
        }
      `}</style>
    </div>
  );
}

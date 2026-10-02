import React, { useState, useRef, useEffect } from 'react';
import SafeImage from './SafeImage';

/**
 * SafeVideo Component
 * - Supports ambient background loops (autoplay, muted, loop, playsinline, no controls)
 * - Supports interactive user-controlled videos (controls=true)
 * - Immediate poster preview with seamless video crossfade once loaded
 * - Graceful fallback to poster/fallbackImage on missing files, 404s, or autoplay blocks
 * - Never shows black boxes, broken player outlines, or browser decode errors
 * - Respects prefers-reduced-motion media query
 * - Preserves aspect-ratio and custom object-position
 */
export default function SafeVideo({
  src,
  poster,
  fallbackImage,
  alt = 'Global Thunder Trade Production Video',
  className = '',
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  objectFit = 'cover',
  objectPosition = 'center center',
  preload = 'auto',
  overlayScrim = false,
  onPlay,
  onPause,
  onEnded,
  ...rest
}) {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Reset error state if src changes
  useEffect(() => {
    setVideoError(!src);
    setVideoLoaded(false);
  }, [src]);

  // Attempt autoplay when ready
  const handleReady = () => {
    setVideoLoaded(true);
    if (autoPlay && !prefersReducedMotion && videoRef.current && muted) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled gracefully without showing error UI
        });
      }
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // If video has an error or is missing or user prefers reduced motion, render fallback image
  if (videoError || !src || prefersReducedMotion) {
    return (
      <div 
        className={`safe-video-fallback-container ${className}`} 
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
      >
        <SafeImage
          src={poster || fallbackImage}
          fallbackSrc={fallbackImage || poster}
          alt={alt}
          objectFit={objectFit}
          objectPosition={objectPosition}
          style={{ width: '100%', height: '100%' }}
        />
        {overlayScrim && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`safe-video-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--charcoal, #111)',
        ...style
      }}
    >
      {/* Poster image visible while buffering for seamless instant zero-layout-shift preview */}
      {(poster || fallbackImage) && (
        <SafeImage
          src={poster || fallbackImage}
          fallbackSrc={fallbackImage || poster}
          alt={alt}
          objectFit={objectFit}
          objectPosition={objectPosition}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            opacity: videoLoaded ? 0 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster || fallbackImage}
        autoPlay={autoPlay && !prefersReducedMotion}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        onCanPlay={handleReady}
        onLoadedData={handleReady}
        onPlaying={handleReady}
        onError={handleVideoError}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          objectPosition,
          display: 'block',
          position: 'relative',
          zIndex: 2,
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
        {...rest}
      />

      {overlayScrim && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}

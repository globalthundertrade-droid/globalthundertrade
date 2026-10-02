import React, { useState, useRef, useEffect, useCallback } from 'react';
import SafeImage from './SafeImage';

/**
 * UniversalMedia Component
 * 
 * Supports both IMAGE and VIDEO across the entire website with 5 Display Modes:
 * 1. image_only                — Shows image only
 * 2. video_only                — Shows video with image fallback
 * 3. hover_video               — Image default → smooth video crossfade on hover / interaction
 * 4. interaction_video         — Tied to card / arrow interaction without blocking navigation
 * 5. video_fallback            — Autoplay ambient loop with instant image/poster fallback
 * 
 * Mobile Behaviours:
 * - image_only (default)       — High-performance image only on mobile
 * - tap_to_play                — Tap to toggle video playback
 * - autoplay_video             — Autoplays muted video when in viewport
 * - same_as_desktop            — Follows desktop hover/touch triggers
 * 
 * Performance & Polish:
 * - Lazy preload on hover videos
 * - Smooth opacity crossfade (0.45s ease)
 * - Strict aspect ratio preservation (object-fit: cover, no distortion/stretching)
 * - Respects prefers-reduced-motion
 */
export default function UniversalMedia({
  media,
  image,
  video,
  mode,
  mobileMode,
  poster,
  fallbackImage,
  alt = 'Global Thunder Trade Visual Media',
  className = '',
  style = {},
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center center',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  overlayScrim = false,
  isHovered: externalHovered = null,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
  ...rest
}) {
  // Normalize media prop (supports full media object OR legacy string URL)
  let rawImage = image;
  let rawVideo = video;
  let rawMode = mode;
  let rawMobileMode = mobileMode;
  let rawPoster = poster;
  let rawAlt = alt;

  if (media) {
    if (typeof media === 'string') {
      const isVid = media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov');
      if (isVid) {
        rawVideo = rawVideo || media;
        rawMode = rawMode || 'video_only';
      } else {
        rawImage = rawImage || media;
        rawMode = rawMode || 'image_only';
      }
    } else if (typeof media === 'object') {
      rawImage = rawImage || media.image || media.url;
      rawVideo = rawVideo || media.video;
      rawMode = rawMode || media.mode || media.displayMode;
      rawMobileMode = rawMobileMode || media.mobileMode;
      rawPoster = rawPoster || media.poster;
      rawAlt = media.alt || rawAlt;
    }
  }

  // Sensible defaults
  const activeImage = rawImage || rawPoster || fallbackImage || '';
  const activeVideo = rawVideo || '';
  const activePoster = rawPoster || activeImage;

  // Determine effective display mode based on available assets
  let effectiveMode = (rawMode || '').toLowerCase();
  if (!effectiveMode || effectiveMode === 'default') {
    if (activeVideo && activeImage) {
      effectiveMode = 'hover_video';
    } else if (activeVideo && !activeImage) {
      effectiveMode = 'video_only';
    } else {
      effectiveMode = 'image_only';
    }
  }

  // Fallback if video is requested but missing
  if ((effectiveMode === 'video_only' || effectiveMode === 'video_fallback') && !activeVideo) {
    effectiveMode = 'image_only';
  }
  if ((effectiveMode === 'hover_video' || effectiveMode === 'interaction_video') && !activeVideo) {
    effectiveMode = 'image_only';
  }

  // Effective mobile mode
  const effectiveMobileMode = (rawMobileMode || 'image_only').toLowerCase();

  // Internal states
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [internalHovered, setInternalHovered] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);

  // Check prefers-reduced-motion and touch device capability
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      const motionListener = (e) => setPrefersReducedMotion(e.matches);
      motionQuery.addEventListener('change', motionListener);

      const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setIsTouchDevice(!hoverQuery.matches);
      const hoverListener = (e) => setIsTouchDevice(!e.matches);
      hoverQuery.addEventListener('change', hoverListener);

      return () => {
        motionQuery.removeEventListener('change', motionListener);
        hoverQuery.removeEventListener('change', hoverListener);
      };
    }
  }, []);

  // IntersectionObserver for mobile autoplay mode
  useEffect(() => {
    if (isTouchDevice && effectiveMobileMode === 'autoplay_video' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        },
        { threshold: 0.35 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [isTouchDevice, effectiveMobileMode]);

  // Determine active hover state (external prop takes precedence if provided)
  const isHoverActive = externalHovered !== null ? externalHovered : internalHovered;

  // Video playback management based on mode & state
  const shouldPlayVideo = useCallback(() => {
    if (videoError || !activeVideo || prefersReducedMotion) return false;

    // Mobile Handling
    if (isTouchDevice) {
      if (effectiveMobileMode === 'image_only') return false;
      if (effectiveMobileMode === 'tap_to_play') return mobileActive;
      if (effectiveMobileMode === 'autoplay_video') return inView;
      if (effectiveMobileMode === 'same_as_desktop') return isHoverActive;
    }

    // Desktop Handling
    if (effectiveMode === 'video_only' || effectiveMode === 'video_fallback') {
      return true;
    }
    if (effectiveMode === 'hover_video' || effectiveMode === 'interaction_video') {
      return isHoverActive;
    }

    return false;
  }, [
    videoError,
    activeVideo,
    prefersReducedMotion,
    isTouchDevice,
    effectiveMobileMode,
    mobileActive,
    inView,
    effectiveMode,
    isHoverActive
  ]);

  const activePlay = shouldPlayVideo();

  // Execute play / pause safely
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (activePlay) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked or user navigated away
        });
      }
    } else {
      vid.pause();
      if (effectiveMode === 'hover_video' || effectiveMode === 'interaction_video') {
        try {
          vid.currentTime = 0;
        } catch (e) {}
      }
    }
  }, [activePlay, effectiveMode]);

  // Handle tap for mobile tap_to_play mode
  const handleContainerClick = (e) => {
    if (isTouchDevice && (effectiveMode === 'hover_video' || effectiveMode === 'interaction_video')) {
      if (effectiveMobileMode === 'tap_to_play') {
        // Toggle mobile video without preventing card navigation if double-tapped or tapped outside
        setMobileActive(prev => !prev);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setInternalHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setInternalHovered(false);
    }
  };

  // Video ready/error callbacks
  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
  };

  // Preload strategy:
  // - Ambient loops & hero videos: "metadata" or "auto"
  // - Hover videos: "none" or "metadata" (lazy load until user interacts)
  const preloadStrategy = (effectiveMode === 'hover_video' || effectiveMode === 'interaction_video')
    ? (isHoverActive || mobileActive ? 'auto' : 'metadata')
    : 'auto';

  // Video visibility calculation:
  // In hover mode: video fades in when hovering, otherwise image is visible.
  const isVideoVisible = activePlay && (
    effectiveMode === 'video_only' ||
    effectiveMode === 'video_fallback' ||
    ((effectiveMode === 'hover_video' || effectiveMode === 'interaction_video') && (isHoverActive || mobileActive || (isTouchDevice && effectiveMobileMode === 'autoplay_video' && inView)))
  );

  return (
    <div
      ref={containerRef}
      className={`universal-media-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        aspectRatio: aspectRatio || undefined,
        ...style
      }}
      {...rest}
    >
      {/* BASE LAYER: Static Image */}
      {activeImage && (
        <SafeImage
          src={activeImage}
          fallbackSrc={fallbackImage || activePoster || activeImage}
          alt={rawAlt}
          objectFit={objectFit}
          objectPosition={objectPosition}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            objectPosition: objectPosition,
            opacity: isVideoVisible && videoLoaded && (effectiveMode === 'video_only' || effectiveMode === 'video_fallback') ? 0 : (isVideoVisible && videoLoaded ? 0 : 1),
            transition: 'opacity 0.45s ease',
            pointerEvents: 'none'
          }}
          className="um-image"
        />
      )}

      {/* VIDEO LAYER */}
      {activeVideo && !videoError && !prefersReducedMotion && (
        <video
          ref={videoRef}
          src={activeVideo}
          poster={activePoster}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={preloadStrategy}
          onCanPlay={handleVideoCanPlay}
          onLoadedData={handleVideoCanPlay}
          onError={handleVideoError}
          onPlay={onVideoPlay}
          onPause={onVideoPause}
          onEnded={onVideoEnded}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            objectPosition: objectPosition,
            opacity: isVideoVisible && videoLoaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
            pointerEvents: controls ? 'auto' : 'none'
          }}
          className="um-video"
        />
      )}

      {/* OPTIONAL OVERLAY SCRIM */}
      {overlayScrim && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
          className="um-scrim"
        />
      )}
    </div>
  );
}

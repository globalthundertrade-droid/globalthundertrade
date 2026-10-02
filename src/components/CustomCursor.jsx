import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/custom-cursor.css';

/**
 * CustomCursor — Global Thunder Trade
 * 
 * Signature bespoke cursor inspired by:
 * - Fashion pattern-making & technical drafting
 * - Garment construction seam calibration
 * - Atelier precision fabric cutting
 * 
 * Features:
 * - 0ms instant needle point for absolute clicking precision
 * - 60fps RAF lerp reticle follow for weighted, tactile fluidity
 * - Contextual pattern-tool transformations (VIEW, EXPLORE, BUILD, DRAG)
 * - Automatic background & image luminance detection (dynamic Black / White)
 * - Anti-flicker hysteresis band with smooth 0.28s cubic-bezier color transition
 * - Subtle magnetic pull on clickable controls
 * - Natural text selection preserved on form inputs
 * - Desktop-only gating with (hover: hover) and (pointer: fine)
 * - Zero layout shift or scroll interference
 */

export default function CustomCursor() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const containerRef = useRef(null);
  const needleRef = useRef(null);
  const reticleRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove('gtt-custom-cursor-active');
      return;
    }

    // 01 — Check if device supports fine mouse pointer (exclude touch/mobile devices)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Activate body class for native cursor hiding on desktop
    document.body.classList.add('gtt-custom-cursor-active');

    // State coordinates & RAF handles
    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let targetX = -100;
    let targetY = -100;
    let isVisible = false;
    let isClicking = false;
    let activeState = 'normal';
    let activeLabel = '';
    let isDarkBg = false; // false = background is light (cursor is black), true = background is dark (cursor is white)
    let rafId = null;

    const LERP_FACTOR = prefersReducedMotion ? 1.0 : 0.18;

    // Shared offscreen 16x16 canvas for microsecond image sampling
    let sampleCanvas = null;
    let sampleCtx = null;

    const getSampleCtx = () => {
      if (!sampleCtx && typeof document !== 'undefined') {
        sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = 16;
        sampleCanvas.height = 16;
        sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      }
      return sampleCtx;
    };

    // Calculate luminance of an image at normalized relative coordinates
    const getImageLuminance = (img, clientX, clientY) => {
      if (!img || !img.complete || img.naturalWidth === 0) {
        return null;
      }

      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      // Cache downscaled pixel data directly on HTMLImageElement (run once per image)
      let pixelData = img._gttPixelData;
      if (!pixelData) {
        try {
          const ctx = getSampleCtx();
          if (!ctx) return null;
          ctx.clearRect(0, 0, 16, 16);
          ctx.drawImage(img, 0, 0, 16, 16);
          pixelData = ctx.getImageData(0, 0, 16, 16).data;
          img._gttPixelData = pixelData;
        } catch (e) {
          // Security / cross-origin fallback
          return null;
        }
      }

      // Sample a 3x3 pixel kernel around (normX * 15, normY * 15) for smooth regional assessment
      const px = Math.floor(normX * 15);
      const py = Math.floor(normY * 15);
      let sum = 0;
      let count = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sx = Math.max(0, Math.min(15, px + dx));
          const sy = Math.max(0, Math.min(15, py + dy));
          const idx = (sy * 16 + sx) * 4;
          const a = pixelData[idx + 3] / 255;
          if (a > 0.2) {
            const r = pixelData[idx];
            const g = pixelData[idx + 1];
            const b = pixelData[idx + 2];
            // Standard perceptual luminance formula
            sum += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            count++;
          }
        }
      }

      return count > 0 ? sum / count : null;
    };

    // Calculate background luminance of any DOM element or underlying container
    const getBackgroundLuminance = (target, clientX, clientY) => {
      if (!target || !(target instanceof Element)) {
        return 0.95; // Default light
      }

      // 01 — Check if target is or contains an image
      let img = null;
      if (target.tagName === 'IMG') {
        img = target;
      } else {
        img = target.querySelector('img') || 
              target.closest('.cat-media-inner, .cat-card, .p-card-item, .blank-card, .sp-card, .factory-mini-grid > div')?.querySelector('img');
      }

      if (img) {
        const imgLum = getImageLuminance(img, clientX, clientY);
        if (imgLum !== null) {
          return imgLum;
        }
      }

      // 02 — Walk up DOM tree to find explicit background styling
      let el = target;
      while (el && el !== document.documentElement) {
        // High-level fast layout heuristics
        if (el.classList) {
          if (
            el.classList.contains('section-dark') || 
            el.classList.contains('site-footer') ||
            el.tagName === 'FOOTER' ||
            el.classList.contains('cat-card') ||
            el.classList.contains('cat-overlay')
          ) {
            return 0.06; // Dark
          }
          if (
            el.classList.contains('site-header') ||
            el.tagName === 'HEADER' ||
            el.classList.contains('p-card-item') ||
            el.classList.contains('blank-card')
          ) {
            return 0.96; // Light
          }
        }

        // Computed background color inspection
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
            if (a > 0.25) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            }
          }
        }

        el = el.parentElement;
      }

      return 0.95; // Default white body
    };

    // Helper to evaluate target type
    const evaluateTarget = (target) => {
      if (!target || !(target instanceof Element)) {
        return { state: 'normal', label: '', magneticEl: null };
      }

      // Explicit cursor override
      const explicit = target.closest('[data-cursor]');
      if (explicit) {
        const val = explicit.getAttribute('data-cursor').toLowerCase();
        if (val === 'view') return { state: 'view', label: 'VIEW', magneticEl: null };
        if (val === 'explore') return { state: 'explore', label: 'EXPLORE', magneticEl: null };
        if (val === 'build') return { state: 'build', label: 'BUILD', magneticEl: null };
        if (val === 'drag') return { state: 'drag', label: 'DRAG', magneticEl: null };
        if (val === 'link') return { state: 'link', label: '', magneticEl: explicit };
        if (val === 'text') return { state: 'text', label: '', magneticEl: null };
      }

      // Text inputs & form controls
      if (target.closest('input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]')) {
        return { state: 'text', label: '', magneticEl: null };
      }

      // 3D Canvas / Globe / Draggable interactive containers
      if (target.closest('canvas, .globe-container, .interactive-globe, .interactive-canvas, [data-draggable="true"], .journey-scroll-track, .blank-carousel')) {
        return { state: 'drag', label: 'DRAG', magneticEl: null };
      }

      // "Build Your Product" buttons & links
      const buildTarget = target.closest('a[href*="build"], button[class*="build"], .builder-cta, [id*="build"], [data-action="build"]');
      if (buildTarget) {
        const text = buildTarget.textContent?.toLowerCase() || '';
        const href = buildTarget.getAttribute('href')?.toLowerCase() || '';
        if (text.includes('build') || href.includes('build') || text.includes('customize')) {
          return { state: 'build', label: 'BUILD', magneticEl: buildTarget };
        }
      }

      // Category cards & pills (e.g. cat-card, category-card, category links)
      const categoryTarget = target.closest('.cat-card, .category-card, .category-pill, [class*="category-card"], [class*="cat-card"], a[href^="/categories"], a[href^="/products?category"]');
      if (categoryTarget) {
        return { state: 'explore', label: 'EXPLORE', magneticEl: null };
      }

      // Product cards, blank cards, side products, lookbook, interactive images
      const viewTarget = target.closest('.p-card-item, .blank-card, .sp-card, .product-card, .portfolio-card, .side-product-card, .gallery-item, .lookbook-item, .factory-mini-grid > div, [class*="product-card"], [class*="blank-card"], .store-mockup-left');
      if (viewTarget) {
        return { state: 'view', label: 'VIEW', magneticEl: null };
      }

      // Normal links, buttons, action tabs
      const linkTarget = target.closest('a, button, [role="button"], .btn, summary, input[type="submit"], input[type="button"], label[for], .filter-pill, .size-pill, .nav-link');
      if (linkTarget) {
        return { state: 'link', label: '', magneticEl: linkTarget };
      }

      return { state: 'normal', label: '', magneticEl: null };
    };

    // Mouse Move Event Listener
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        curX = mouseX;
        curY = mouseY;
        if (containerRef.current) {
          containerRef.current.classList.remove('cursor-hidden');
        }
      }

      // Instant Needle Point positioning (0ms latency)
      if (needleRef.current) {
        needleRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Evaluate interaction state
      const { state, label, magneticEl } = evaluateTarget(e.target);
      activeState = state;
      activeLabel = label;

      // Evaluate dynamic background & image luminance
      const lum = getBackgroundLuminance(e.target, mouseX, mouseY);
      
      // Hysteresis threshold to prevent rapid black/white switching at boundaries:
      // Over dark background (< 0.46) -> cursor is white
      // Over light background (> 0.54) -> cursor is black
      if (isDarkBg) {
        if (lum > 0.54) {
          isDarkBg = false;
        }
      } else {
        if (lum < 0.46) {
          isDarkBg = true;
        }
      }

      // Calculate magnetic displacement
      if (magneticEl && (state === 'link' || state === 'build')) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Soft pull towards center (max 8px clamp to maintain user agency)
        const pullX = Math.max(-8, Math.min(8, (centerX - mouseX) * 0.25));
        const pullY = Math.max(-8, Math.min(8, (centerY - mouseY) * 0.25));
        
        targetX = mouseX + pullX;
        targetY = mouseY + pullY;
      } else {
        targetX = mouseX;
        targetY = mouseY;
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      if (containerRef.current) {
        containerRef.current.classList.add('is-clicking');
      }
    };

    const onMouseUp = () => {
      isClicking = false;
      if (containerRef.current) {
        containerRef.current.classList.remove('is-clicking');
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.classList.add('cursor-hidden');
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (containerRef.current) {
        containerRef.current.classList.remove('cursor-hidden');
      }
    };

    // 60-120fps Animation Loop for Pattern Reticle Follow & Contrast State
    let lastRenderedState = '';
    let lastRenderedLabel = '';
    let lastRenderedDarkBg = null;

    const renderLoop = () => {
      if (isVisible) {
        // Easing interpolation
        curX += (targetX - curX) * LERP_FACTOR;
        curY += (targetY - curY) * LERP_FACTOR;

        if (reticleRef.current) {
          reticleRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        }

        // Apply contrast theme classes to container with smooth CSS transition
        if (containerRef.current && lastRenderedDarkBg !== isDarkBg) {
          containerRef.current.classList.toggle('theme-dark-bg', isDarkBg);
          containerRef.current.classList.toggle('theme-light-bg', !isDarkBg);
          lastRenderedDarkBg = isDarkBg;
        }

        // Apply interaction state classes to container
        if (containerRef.current && lastRenderedState !== activeState) {
          containerRef.current.classList.remove(
            'state-normal',
            'state-view',
            'state-explore',
            'state-build',
            'state-link',
            'state-drag',
            'state-text'
          );
          containerRef.current.classList.add(`state-${activeState}`);
          containerRef.current.classList.toggle('has-label', Boolean(activeLabel));
          lastRenderedState = activeState;
        }

        // Update label text
        if (labelRef.current && lastRenderedLabel !== activeLabel) {
          labelRef.current.textContent = activeLabel;
          lastRenderedLabel = activeLabel;
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    // Attach Event Listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      document.body.classList.remove('gtt-custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return null;
  }

  return (
    <div ref={containerRef} className="gtt-cursor-container cursor-hidden state-normal theme-light-bg" aria-hidden="true">
      {/* 01: Instant Needle Hotspot Point */}
      <div ref={needleRef} className="gtt-cursor-needle" />

      {/* 02: Precision Pattern-Maker Reticle */}
      <div ref={reticleRef} className="gtt-cursor-reticle">
        {/* Outer Circular/Rectangular Frame */}
        <div className="gtt-reticle-box" />

        {/* 4 Atelier Pattern Corner Registration Notches */}
        <span className="gtt-notch gtt-notch-tl" />
        <span className="gtt-notch gtt-notch-tr" />
        <span className="gtt-notch gtt-notch-bl" />
        <span className="gtt-notch gtt-notch-br" />

        {/* Cardinal Calibration Ticks (+ Crosshair Axis) */}
        <span className="gtt-tick-h" />
        <span className="gtt-tick-v" />

        {/* Central Micro-Typography Context Label */}
        <span ref={labelRef} className="gtt-cursor-label" />
      </div>
    </div>
  );
}

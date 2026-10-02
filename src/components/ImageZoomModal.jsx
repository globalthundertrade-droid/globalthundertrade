import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Move } from 'lucide-react';

/**
 * ImageZoomModal Component
 * High-Resolution Lightbox & Pan/Zoom Inspection Viewer.
 * - Desktop: Mousemove pan, click-to-zoom, smooth zoom scale up to 3.5x.
 * - Mobile: Full-screen touch viewer, pinch-to-zoom, touch pan, double-tap toggle.
 * - Uses high-resolution source for the currently selected product colour variant.
 */
export default function ImageZoomModal({
  isOpen,
  onClose,
  src,
  alt = 'High-Resolution Inspection',
  productName = '',
  colorName = ''
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Touch tracking for mobile pinch-to-zoom
  const touchStartDist = useRef(0);
  const touchStartScale = useRef(1);
  const lastTapRef = useRef(0);

  // Reset zoom state on open or src change
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsLoaded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, src]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scale]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.6, 3.8));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.6, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Desktop click to zoom in at point
  const handleImageClick = (e) => {
    if (scale === 1) {
      setScale(2.2);
    }
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      touchStartScale.current = scale;
    } else if (e.touches.length === 1) {
      // Single touch drag or double tap
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap toggles zoom
        if (scale > 1) {
          handleResetZoom();
        } else {
          setScale(2.5);
        }
      }
      lastTapRef.current = now;

      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom calculation
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist.current > 0) {
        const factor = dist / touchStartDist.current;
        const newScale = Math.min(Math.max(touchStartScale.current * factor, 1), 4);
        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Touch panning
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDist.current = 0;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="gtt-zoom-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(8, 8, 8, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar with Context and Close */}
      <header 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'rgba(10, 10, 10, 0.8)',
          zIndex: 10
        }}
      >
        <div style={{ color: 'var(--white)' }}>
          <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
            HIGH-RESOLUTION FABRIC &amp; STITCH INSPECTION
          </span>
          <div style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{productName}</span>
            {colorName && (
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 2, background: 'rgba(255,255,255,0.15)', color: 'var(--white)', fontWeight: 600 }}>
                {colorName}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Zoom controls */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 8px',
              borderRadius: 30,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              style={{
                background: 'transparent',
                border: 'none',
                color: scale <= 1 ? 'rgba(255,255,255,0.3)' : 'var(--white)',
                cursor: scale <= 1 ? 'default' : 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom Out (-)"
            >
              <ZoomOut size={16} />
            </button>

            <span style={{ fontSize: 11, fontWeight: 800, minWidth: 42, textAlign: 'center', color: 'var(--white)' }}>
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={scale >= 3.8}
              style={{
                background: 'transparent',
                border: 'none',
                color: scale >= 3.8 ? 'rgba(255,255,255,0.3)' : 'var(--white)',
                cursor: scale >= 3.8 ? 'default' : 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom In (+)"
            >
              <ZoomIn size={16} />
            </button>

            {scale > 1 && (
              <button
                onClick={handleResetZoom}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--white)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 2
                }}
                title="Reset Zoom (0)"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              cursor: 'pointer',
              transition: 'background .2s ease'
            }}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          overflow: 'hidden',
          position: 'relative',
          padding: 20
        }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '88vw',
            maxHeight: '82vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 3,
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.8)',
              display: 'block',
              pointerEvents: scale > 1 ? 'none' : 'auto'
            }}
          />
        </div>

        {/* Pan hint when zoomed */}
        {scale > 1 && (
          <div 
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--white)',
              pointerEvents: 'none',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Move size={12} /> Drag or swipe to inspect details
          </div>
        )}
      </div>

      {/* Bottom info helper */}
      <footer 
        style={{
          padding: '10px 24px',
          background: 'rgba(10, 10, 10, 0.75)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: '.06em'
        }}
      >
        <span>Desktop: Scroll / Click to Zoom &middot; Drag to Pan</span>
        <span>Mobile: Pinch to Zoom &middot; Double-Tap</span>
      </footer>
    </div>
  );
}

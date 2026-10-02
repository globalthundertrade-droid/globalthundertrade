import React, { useState, useEffect } from 'react';

/**
 * SafeImage Component
 * - Preserves original aspect ratio, prevents stretching.
 * - Graceful fallback chain: src -> fallbackSrc -> neutral elegant placeholder.
 * - Never shows broken image icons or jarring layout shifts.
 * - Built-in lazy loading and asynchronous decoding.
 */
export default function SafeImage({
  src,
  fallbackSrc,
  alt = 'Global Thunder Trade',
  className = '',
  style = {},
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setFailedAttempts(0);
  }, [src, fallbackSrc]);

  const handleError = (e) => {
    if (failedAttempts === 0 && fallbackSrc && currentSrc !== fallbackSrc) {
      setFailedAttempts(1);
      setCurrentSrc(fallbackSrc);
    } else {
      setFailedAttempts(2);
    }
    if (onError) onError(e);
  };

  const handleLoad = (e) => {
    if (onLoad) onLoad(e);
  };

  // If all image sources fail, show an editorial branded dark tile
  if (failedAttempts >= 2 || !currentSrc) {
    return (
      <div
        className={`safe-image-placeholder ${className}`}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--charcoal, #1a1a1a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray, #888)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          ...style
        }}
        role="img"
        aria-label={alt}
      >
        <span>GTT // {alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      onLoad={handleLoad}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        objectPosition,
        ...style
      }}
      {...rest}
    />
  );
}

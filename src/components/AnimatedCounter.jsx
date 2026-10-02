import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * Smoothly animates a numeric value from 0 to its target when scrolled into view.
 * Features:
 * - Viewport trigger via IntersectionObserver
 * - Premium exponential deceleration easing (easeOutExpo)
 * - Suffix preservation throughout animation (e.g. "+")
 * - Plays strictly once per page load
 * - Respects `prefers-reduced-motion`
 */
export default function AnimatedCounter({ 
  value = 0, 
  suffix = '', 
  duration = 1800,
  className = '' 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check user accessibility preference for reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    if (hasAnimated) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          let startTimestamp = null;
          const target = Number(value) || 0;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);

            // Premium exponential deceleration: 1 - 2^(-10 * progress)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOutExpo * target);

            setDisplayValue(current);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setDisplayValue(target);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated]);

  return (
    <span ref={containerRef} className={`animated-stat-counter ${className}`} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      <span>{displayValue}</span>
      {suffix && <span className="stat-suffix" style={{ marginLeft: '1px' }}>{suffix}</span>}
    </span>
  );
}

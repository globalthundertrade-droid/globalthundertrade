import React from 'react';

/**
 * GttWordmark Component
 * 
 * Renders the official GTT stacked brand identity:
 * GLOBAL
 * THUNDER
 * TRADE
 * 
 * Strictly text-based with editorial fashion typography.
 * Never uses an image, icon, or single-line layout.
 */
export default function GttWordmark({ variant = 'navbar', className = '' }) {
  return (
    <span 
      className={`gtt-stacked-wordmark gtt-stacked-${variant} ${className}`} 
      aria-label="Global Thunder Trade"
    >
      <span className="gtt-wordmark-line">GLOBAL</span>
      <span className="gtt-wordmark-line">THUNDER</span>
      <span className="gtt-wordmark-line">TRADE</span>
    </span>
  );
}

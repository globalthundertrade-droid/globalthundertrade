import React, { useEffect } from 'react';

export default function CursorGlow() {
  useEffect(() => {
    const glow = document.getElementById('glow');
    if (!glow) return;

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let rafId = null;
    let mx = 0;
    let my = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      glow.style.opacity = '1';
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          glow.style.left = `${mx}px`;
          glow.style.top = `${my}px`;
          rafId = null;
        });
      }
    };

    const onMouseLeave = () => {
      glow.style.opacity = '0';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="glow" />;
}

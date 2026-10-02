import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MARKETS } from '../data/marketsData';

export default function GlobeCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeMarket, setActiveMarket] = useState(MARKETS.find(m => m.code === 'US') || MARKETS[0]);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0, visible: true });

  // Refs to bridge React state and Canvas animation loop
  const rotateToMarketRef = useRef(null);
  const currentActiveCodeRef = useRef('US');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    const origin = MARKETS.find(m => m.origin) || MARKETS[0];
    const nonOrigin = MARKETS.filter(m => !m.origin);

    // Approximate continental point-cloud
    const LAND_REGIONS = [
      { lat: [25, 60],   lon: [-125, -70], n: 110 }, // N America
      { lat: [-55, 10],  lon: [-80, -35],  n: 60 },  // S America
      { lat: [36, 60],   lon: [-10, 40],   n: 90 },  // Europe
      { lat: [-35, 35],  lon: [-20, 50],   n: 120 }, // Africa
      { lat: [5, 60],    lon: [60, 140],   n: 150 }, // Asia
      { lat: [-40, -10], lon: [110, 155],  n: 55 }   // Australia
    ];

    const LAND_DOTS = [];
    LAND_REGIONS.forEach(r => {
      for (let i = 0; i < r.n; i++) {
        LAND_DOTS.push([
          r.lat[0] + Math.random() * (r.lat[1] - r.lat[0]),
          r.lon[0] + Math.random() * (r.lon[1] - r.lon[0])
        ]);
      }
    });

    let rotation = 0.4;
    let targetRotation = null;
    const rotationSpeed = 0.0016;
    let interacting = false;
    let resumeTimer = null;
    const TILT = 18 * Math.PI / 180;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function project(lat, lon, rot, w, h) {
      const latR = lat * Math.PI / 180;
      const lonR = lon * Math.PI / 180;
      const x3 = Math.cos(latR) * Math.sin(lonR + rot);
      const y3 = Math.sin(latR);
      const z3 = Math.cos(latR) * Math.cos(lonR + rot);
      const y2 = y3 * Math.cos(TILT) - z3 * Math.sin(TILT);
      const z2 = y3 * Math.sin(TILT) + z3 * Math.cos(TILT);
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;
      return { x: cx + x3 * R, y: cy - y2 * R, z: z2, visible: z2 > -0.05 };
    }

    function latLonToVec(lat, lon) {
      const latR = lat * Math.PI / 180;
      const lonR = lon * Math.PI / 180;
      return { x: Math.cos(latR) * Math.sin(lonR), y: Math.sin(latR), z: Math.cos(latR) * Math.cos(lonR) };
    }

    function greatCircleArc(lat1, lon1, lat2, lon2, steps = 40) {
      const p1 = latLonToVec(lat1, lon1);
      const p2 = latLonToVec(lat2, lon2);
      const dot = Math.max(-1, Math.min(1, p1.x * p2.x + p1.y * p2.y + p1.z * p2.z));
      const theta = Math.acos(dot);
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (theta < 0.0001) { pts.push(p1); continue; }
        const a = Math.sin((1 - t) * theta) / Math.sin(theta);
        const b = Math.sin(t * theta) / Math.sin(theta);
        pts.push({ x: a * p1.x + b * p2.x, y: a * p1.y + b * p2.y, z: a * p1.z + b * p2.z });
      }
      return pts;
    }

    function vecToScreen(v, rot, w, h) {
      const lon = Math.atan2(v.x, v.z);
      const lat = Math.asin(v.y);
      return project(lat * 180 / Math.PI, lon * 180 / Math.PI, rot, w, h);
    }

    const nodePositions = {};

    function pauseThenResume(delay = 5500) {
      interacting = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        interacting = false;
      }, delay);
    }

    // Smoothly calculate shortest arc target rotation to face selected country
    function setTargetMarket(market) {
      currentActiveCodeRef.current = market.code;
      setActiveMarket(market);
      pauseThenResume(6000);

      // Desired rotation to bring this longitude directly front & center
      const rawTarget = -(market.lon * Math.PI / 180);
      let diff = (rawTarget - rotation) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;

      if (prefersReducedMotion) {
        rotation += diff;
        targetRotation = null;
      } else {
        targetRotation = rotation + diff;
      }
    }

    rotateToMarketRef.current = setTargetMarket;

    function draw() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;

      // Outer Atmosphere / Horizon Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.08);
      glowGrad.addColorStop(0, 'rgba(255,255,255,0.03)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // Sphere border outline
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = '#2d2d2d';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Land dots (Monochrome point-cloud)
      LAND_DOTS.forEach(([lat, lon]) => {
        const p = project(lat, lon, rotation, w, h);
        if (!p.visible) return;
        const depth = (p.z + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * (0.5 + depth * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,180,180,${0.2 + depth * 0.45})`;
        ctx.fill();
      });

      // Route arcs from Pakistan origin to destination markets
      nonOrigin.forEach(m => {
        const isActive = m.code === currentActiveCodeRef.current;
        const arc = greatCircleArc(origin.lat, origin.lon, m.lat, m.lon, 36);
        ctx.beginPath();
        let started = false;
        arc.forEach(v => {
          const p = vecToScreen(v, rotation, w, h);
          if (!p.visible) { started = false; return; }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; } else { ctx.lineTo(p.x, p.y); }
        });
        ctx.strokeStyle = isActive ? '#ffffff' : 'rgba(150,150,150,0.32)';
        ctx.lineWidth = isActive ? 1.8 : 1;
        ctx.setLineDash(isActive ? [] : [2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Country Markers
      MARKETS.forEach(m => {
        const p = project(m.lat, m.lon, rotation, w, h);
        nodePositions[m.code] = p;
        if (!p.visible) return;
        const depth = (p.z + 1) / 2;
        const isSelected = m.code === currentActiveCodeRef.current;
        const baseR = (m.origin ? 5.2 : 3.8) * (0.6 + depth * 0.5);

        // Core marker dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.6 + depth * 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Static outer ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.stroke();

        // Animated Highlighting Radar Pulse for Active Country
        if (isSelected) {
          const pulse = (performance.now() / 1100) % 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, baseR + pulse * 22, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = Math.max(0, 0.7 - pulse * 0.7);
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Second secondary pulse
          const pulse2 = ((performance.now() + 550) / 1100) % 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, baseR + pulse2 * 15, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = Math.max(0, 0.5 - pulse2 * 0.5);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Update Card position for the selected country
      const activeP = nodePositions[currentActiveCodeRef.current];
      if (activeP && activeP.visible) {
        setCardPos({ x: activeP.x, y: activeP.y, visible: true });
      } else {
        setCardPos(prev => ({ ...prev, visible: false }));
      }
    }

    let animationFrameId;
    function tick() {
      if (targetRotation !== null) {
        const diff = targetRotation - rotation;
        rotation += diff * 0.048;
        if (Math.abs(diff) < 0.002) {
          rotation = targetRotation;
          targetRotation = null;
        }
      } else if (!interacting && !prefersReducedMotion) {
        rotation += rotationSpeed;
      }
      draw();
      animationFrameId = requestAnimationFrame(tick);
    }

    tick();

    // Mouse & Touch Drag Controls
    let dragging = false;
    let lastPX = 0;

    const handlePointerDown = (clientX) => {
      dragging = true;
      lastPX = clientX;
      pauseThenResume();
    };

    const handlePointerMove = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      if (dragging) {
        rotation += (mx - lastPX) * 0.0045;
        targetRotation = null;
        lastPX = mx;
        pauseThenResume();
        return;
      }

      // Check hover on markers
      let nearest = null;
      let nearestDist = 26;
      MARKETS.forEach(m => {
        const p = nodePositions[m.code];
        if (!p || !p.visible) return;
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = m;
        }
      });

      if (nearest) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = dragging ? 'grabbing' : 'grab';
      }
    };

    const handlePointerUp = () => { dragging = false; };

    const onMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      handlePointerDown(e.clientX - rect.left);
    };

    const onMouseMove = (e) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        handlePointerDown(e.touches[0].clientX - rect.left);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => handlePointerUp();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // Click on globe to target nearest market
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let nearest = null;
      let nearestDist = 30;
      MARKETS.forEach(m => {
        const p = nodePositions[m.code];
        if (!p || !p.visible) return;
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = m;
        }
      });
      if (nearest) {
        setTargetMarket(nearest);
      }
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resumeTimer);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const handleCountryClick = useCallback((market) => {
    if (rotateToMarketRef.current) {
      rotateToMarketRef.current(market);
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Globe Stage */}
      <div 
        ref={containerRef}
        className="map-stage"
        id="mapStage"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/8.8',
          margin: '40px 0 0',
          touchAction: 'none'
        }}
      >
        <canvas ref={canvasRef} id="globeCanvas" style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Dynamic Country Marker Stat Card */}
        {activeMarket && (
          <div 
            className={`map-card ${cardPos.visible ? 'show' : ''}`}
            style={{
              position: 'absolute',
              left: `${cardPos.x}px`,
              top: `${cardPos.y}px`,
              pointerEvents: 'none',
              background: 'var(--white)',
              color: 'var(--black)',
              padding: '16px 20px',
              borderRadius: 2,
              boxShadow: '0 25px 60px rgba(0,0,0,.6)',
              transform: 'translate(-50%, calc(-100% - 16px))',
              minWidth: 190,
              zIndex: 10,
              opacity: cardPos.visible ? 1 : 0,
              transition: 'opacity .3s ease, transform .2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, letterSpacing: '.16em', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
                {activeMarket.name}
              </span>
              <span style={{ fontSize: 14 }}>{activeMarket.flag}</span>
            </div>
            
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1 }}>
              {activeMarket.origin ? 'MANUFACTURING HQ' : activeMarket.brands}
            </div>
            
            <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray-dark)', marginTop: 4 }}>
              {activeMarket.origin ? 'SIALKOT / LAHORE FACTORY FLOOR' : 'CLOTHING BRANDS SERVED'}
            </div>
            
            {activeMarket.detail && (
              <div style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 8, lineHeight: 1.4, borderTop: '1px solid var(--line-light)', paddingTop: 6 }}>
                {activeMarket.detail}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Country Navigation Strip */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
            CLICK ANY REGION TO ROTATE GLOBE &middot; {MARKETS.length} ACTIVE DESTINATIONS
          </span>
          <span style={{ fontSize: 11, color: 'var(--white)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            ACTIVE: {activeMarket?.name} ({activeMarket?.origin ? 'HQ' : activeMarket?.brands})
          </span>
        </div>

        <div 
          className="country-strip"
          style={{
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
            borderTop: '1px solid var(--line-dark)',
            borderBottom: '1px solid var(--line-dark)',
            scrollbarWidth: 'none',
            background: 'rgba(20,20,20,0.6)'
          }}
        >
          {MARKETS.map((m) => {
            const isSelected = activeMarket?.code === m.code;
            return (
              <button
                key={m.code}
                className={`country-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleCountryClick(m)}
                title={`Rotate globe to ${m.name}`}
                style={{
                  flex: '0 0 auto',
                  padding: '16px 20px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: isSelected ? 'var(--white)' : 'var(--gray)',
                  borderRight: '1px solid var(--line-dark)',
                  background: isSelected ? 'rgba(255,255,255,0.12)' : 'transparent',
                  borderBottom: isSelected ? '2px solid var(--white)' : '2px solid transparent',
                  transition: 'all .25s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>{m.code === 'SA' ? 'KSA' : (m.code === 'US' ? 'USA' : (m.code === 'UK' ? 'UK' : m.name))}</span>
                {m.origin && (
                  <span style={{ fontSize: 9, background: 'var(--white)', color: 'var(--black)', padding: '1px 5px', borderRadius: 2, fontWeight: 900 }}>
                    HQ
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

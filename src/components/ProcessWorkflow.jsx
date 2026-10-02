import React, { useState } from 'react';
import { COMPANY } from '../data/companyData';
import { Play, CheckCircle2 } from 'lucide-react';

export default function ProcessWorkflow() {
  const steps = COMPANY.processSteps;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex];

  return (
    <div className="process-workflow-wrapper" style={{ marginTop: 60 }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 60,
          alignItems: 'center'
        }}
        className="pw-grid"
      >
        {/* Left Column: Interactive Step Selector */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((s, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    borderTop: '1px solid var(--line-dark)',
                    padding: '20px 14px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--white)' : '3px solid transparent',
                    transition: 'all .3s var(--ease)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span 
                        style={{ 
                          fontSize: 13, 
                          fontWeight: 800, 
                          color: isActive ? 'var(--white)' : 'var(--gray)',
                          letterSpacing: '.1em'
                        }}
                      >
                        {s.step}
                      </span>
                      <h3 
                        style={{ 
                          fontSize: 'clamp(20px, 2.4vw, 28px)', 
                          color: isActive ? 'var(--white)' : 'var(--gray)',
                          letterSpacing: '-.01em',
                          transition: 'color .3s ease'
                        }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    {isActive && <CheckCircle2 size={18} color="var(--white)" />}
                  </div>

                  {isActive && (
                    <p 
                      style={{ 
                        marginTop: 14, 
                        fontSize: 14.5, 
                        lineHeight: 1.6, 
                        color: 'var(--gray)',
                        maxWidth: 520,
                        paddingLeft: 34
                      }}
                    >
                      {s.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Portrait Video / Reel Visual Slot */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 380,
              aspectRatio: '9/16',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'var(--charcoal)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              border: '1px solid var(--line-dark)'
            }}
          >
            {/* Video Element with Poster Fallback */}
            <video
              key={activeStep.video}
              autoPlay
              loop
              muted
              playsInline
              poster={activeStep.poster}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(0.85) contrast(1.1)'
              }}
            >
              <source src={activeStep.video} type="video/mp4" />
            </video>

            {/* Overlay Gradient & Step Meta */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 24,
                pointerEvents: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  style={{
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--white)',
                    fontSize: 11,
                    letterSpacing: '.14em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '6px 12px',
                    borderRadius: 2
                  }}
                >
                  STEP {activeStep.step} &middot; {activeStep.title}
                </span>

                <span 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)'
                  }}
                >
                  <Play size={12} />
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 600 }}>
                  PRODUCTION REEL
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--white)', marginTop: 4, textTransform: 'uppercase' }}>
                  {activeStep.caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pw-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

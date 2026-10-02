import React, { useState } from 'react';
import { Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { BUILDER_PRODUCTS } from '../data/builderData';

export default function LayeredProductPreview({
  productType = 'hoodie',
  selectedColor = '#111111',
  selectedFit = 'Oversized Boxy',
  selectedFabric = '460 GSM Fleece',
  selectedPrint = 'None',
  selectedEmbroidery = 'None',
  selectedEmbellishments = 'None',
  selectedHardware = 'None',
  selectedLabels = 'Custom Woven Neck Label',
  selectedTags = 'Matte Black Hangtag'
}) {
  const [previewStyle, setPreviewStyle] = useState('vector'); // 'vector' | 'photo'

  const currentProductData = BUILDER_PRODUCTS.find(p => p.id === productType) || BUILDER_PRODUCTS[0];
  const isOversized = selectedFit?.toLowerCase().includes('oversized') || selectedFit?.toLowerCase().includes('boxy') || selectedFit?.toLowerCase().includes('baggy') || selectedFit?.toLowerCase().includes('wide');

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        maxHeight: 560,
        background: '#121212',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9), 0 20px 50px rgba(0,0,0,0.4)',
        border: '1px solid var(--line-dark)'
      }}
      className="layered-preview-container"
    >
      {/* Studio Radial Ambient Backdrop */}
      <div 
        style={{
          position: 'absolute',
          width: '85%',
          height: '85%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Top Left: Live Spec Header */}
      <div 
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          zIndex: 6
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: '.16em', fontWeight: 800, textTransform: 'uppercase', color: 'var(--white)' }}>
          {currentProductData.name} MOCKUP
        </span>
        <span style={{ fontSize: 11, color: 'var(--gray)' }}>
          {selectedFit} &middot; {selectedFabric}
        </span>
      </div>

      {/* Top Right: View Mode Toggle (Vector Layered vs Reference Photo) */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 6,
          zIndex: 6
        }}
      >
        <button
          onClick={() => setPreviewStyle('vector')}
          title="Vector Composite Layer View"
          style={{
            background: previewStyle === 'vector' ? 'var(--white)' : 'rgba(0,0,0,0.6)',
            color: previewStyle === 'vector' ? 'var(--black)' : 'var(--white)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '5px 10px',
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          <Layers size={11} /> LIVE SPEC
        </button>

        <button
          onClick={() => setPreviewStyle('photo')}
          title="High-Res Factory Photography Reference"
          style={{
            background: previewStyle === 'photo' ? 'var(--white)' : 'rgba(0,0,0,0.6)',
            color: previewStyle === 'photo' ? 'var(--black)' : 'var(--white)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '5px 10px',
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          <ImageIcon size={11} /> PHOTO MOCKUP
        </button>
      </div>

      {/* VIEW: High-Res Real Photography Reference with Color Tint Overlay */}
      {previewStyle === 'photo' && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img 
            src={currentProductData.mockupImage} 
            alt={`${currentProductData.name} Production Mockup`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'grayscale(0.75) contrast(1.15) brightness(0.95)'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: selectedColor,
              mixBlendMode: 'color',
              opacity: 0.35,
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: 16,
              left: 18,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 2,
              border: '1px solid var(--line-dark)'
            }}
          >
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', fontWeight: 700 }}>
              REFERENCE SPEC &middot; {currentProductData.category}
            </span>
          </div>
        </div>
      )}

      {/* VIEW: Vector Dynamic Spec Silhouettes */}
      {previewStyle === 'vector' && (
        <div 
          style={{
            position: 'relative',
            width: '82%',
            height: '84%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isOversized ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s var(--ease)'
          }}
        >
          <svg 
            viewBox="0 0 400 440" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.65))' }}
          >
            <defs>
              <linearGradient id="garmentLighting" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="45%" stopColor="#000000" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
              </linearGradient>

              <linearGradient id="foldLighting" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="denimTexture" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* ============ 1. HOODIE SILHOUETTE ============ */}
            {productType === 'hoodie' && (
              <g id="hoodieSilhouette">
                {/* Back Hood */}
                <path d="M135 100 C125 24, 275 24, 265 100 Z" fill={selectedColor} filter="brightness(0.68)" />

                {/* Sleeves (Drop Shoulder Boxy) */}
                <path d="M105 115 L15 220 C5 235, 38 255, 52 240 L115 180 Z" fill={selectedColor} />
                <path d="M295 115 L385 220 C395 235, 362 255, 348 240 L285 180 Z" fill={selectedColor} />

                {/* Ribbed Sleeve Cuffs */}
                <path d="M14 216 L48 242 L38 254 L4 228 Z" fill={selectedColor} filter="brightness(0.85)" />
                <path d="M386 216 L352 242 L362 254 L396 228 Z" fill={selectedColor} filter="brightness(0.85)" />

                {/* Main Boxy Torso */}
                <path d="M105 115 L295 115 L288 360 L112 360 Z" fill={selectedColor} />
                <path d="M105 115 L295 115 L288 360 L112 360 Z" fill="url(#garmentLighting)" />

                {/* Ribbed Bottom Hemband */}
                <rect x="112" y="360" width="176" height="30" rx="3" fill={selectedColor} filter="brightness(0.86)" />

                {/* Kangaroo Pocket */}
                <path d="M130 270 L270 270 L260 352 L140 352 Z" fill={selectedColor} filter="brightness(0.94)" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />

                {/* Hood Collar Crossover */}
                <path d="M148 115 C168 148, 232 148, 252 115 C242 66, 158 66, 148 115 Z" fill={selectedColor} filter="brightness(1.06)" />
                <path d="M168 120 C185 142, 215 142, 232 120" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
              </g>
            )}

            {/* ============ 2. T-SHIRT SILHOUETTE ============ */}
            {productType === 'tshirt' && (
              <g id="tshirtSilhouette">
                {/* Sleeves (Drop Shoulder Boxy) */}
                <path d="M96 110 L24 195 C14 210, 52 225, 65 205 L112 162 Z" fill={selectedColor} />
                <path d="M304 110 L376 195 C386 210, 348 225, 335 205 L288 162 Z" fill={selectedColor} />

                {/* Torso */}
                <path d="M96 110 L304 110 L294 380 L106 380 Z" fill={selectedColor} />
                <path d="M96 110 L304 110 L294 380 L106 380 Z" fill="url(#garmentLighting)" />

                {/* 1.25" Thick Ribbed Collar */}
                <path d="M156 110 C166 138, 234 138, 244 110 C234 94, 166 94, 156 110 Z" fill={selectedColor} filter="brightness(0.88)" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
              </g>
            )}

            {/* ============ 3. SWEATSHIRT SILHOUETTE ============ */}
            {productType === 'sweatshirt' && (
              <g id="sweatshirtSilhouette">
                {/* Sleeves */}
                <path d="M102 115 L18 225 C8 240, 40 260, 54 245 L116 182 Z" fill={selectedColor} />
                <path d="M298 115 L382 225 C392 240, 360 260, 346 245 L284 182 Z" fill={selectedColor} />

                {/* Sleeve Cuffs */}
                <path d="M16 220 L50 246 L40 258 L6 232 Z" fill={selectedColor} filter="brightness(0.86)" />
                <path d="M384 220 L350 246 L360 258 L394 232 Z" fill={selectedColor} filter="brightness(0.86)" />

                {/* Torso */}
                <path d="M102 115 L298 115 L290 365 L110 365 Z" fill={selectedColor} />
                <path d="M102 115 L298 115 L290 365 L110 365 Z" fill="url(#garmentLighting)" />

                {/* Bottom Ribbed Hem */}
                <rect x="110" y="365" width="180" height="28" rx="2" fill={selectedColor} filter="brightness(0.86)" />

                {/* Ribbed Crewneck Collar */}
                <path d="M152 115 C164 140, 236 140, 248 115 C238 98, 162 98, 152 115 Z" fill={selectedColor} filter="brightness(0.9)" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                {/* Classic V-Notch stitch detail */}
                <polygon points="186,134 200,154 214,134" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" />
              </g>
            )}

            {/* ============ 4. JACKET SILHOUETTE ============ */}
            {productType === 'jacket' && (
              <g id="jacketSilhouette">
                {/* Sleeves */}
                <path d="M105 115 L20 240 C10 255, 42 265, 55 250 L122 170 Z" fill={selectedColor} />
                <path d="M295 115 L380 240 C390 255, 358 265, 345 250 L278 170 Z" fill={selectedColor} />

                {/* Torso */}
                <path d="M105 115 L295 115 L288 370 L112 370 Z" fill={selectedColor} />
                <path d="M105 115 L295 115 L288 370 L112 370 Z" fill="url(#garmentLighting)" />

                {/* Biker / Varsity Notched Lapels */}
                <polygon points="144,115 170,170 200,115" fill={selectedColor} filter="brightness(1.2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <polygon points="256,115 230,170 200,115" fill={selectedColor} filter="brightness(1.2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                {/* Slanted Side Pockets */}
                <line x1="135" y1="290" x2="165" y2="330" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinecap="round" />
                <line x1="265" y1="290" x2="235" y2="330" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinecap="round" />

                {/* Heavy Center / Asymmetric Zipper */}
                <line x1="215" y1="170" x2="208" y2="370" stroke="#d0d0d0" strokeWidth="4.5" strokeDasharray="3 2" />
                {/* Pull tab */}
                <rect x="210" y="240" width="6" height="14" rx="1" fill="#e0e0e0" stroke="#444" strokeWidth="0.8" />
              </g>
            )}

            {/* ============ 5. JEANS SILHOUETTE ============ */}
            {productType === 'jeans' && (
              <g id="jeansSilhouette">
                {/* Waistband */}
                <rect x="130" y="80" width="140" height="24" rx="2" fill={selectedColor} filter="brightness(0.9)" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
                {/* Belt loops */}
                <rect x="145" y="78" width="6" height="28" fill={selectedColor} filter="brightness(1.15)" />
                <rect x="197" y="78" width="6" height="28" fill={selectedColor} filter="brightness(1.15)" />
                <rect x="249" y="78" width="6" height="28" fill={selectedColor} filter="brightness(1.15)" />

                {/* Pelvis & Yoke */}
                <path d="M130 104 L270 104 L280 200 L120 200 Z" fill={selectedColor} />
                <path d="M130 104 L270 104 L280 200 L120 200 Z" fill="url(#denimTexture)" />

                {/* Fly Seam & Metal Rivets */}
                <path d="M200 104 L200 165 C200 180, 192 186, 185 190" stroke="rgba(210,165,80,0.85)" strokeWidth="1.8" fill="none" strokeDasharray="3 2" />
                <circle cx="200" cy="92" r="4.5" fill="#c49a45" stroke="#333" strokeWidth="1" />

                {/* Curved Front Pockets */}
                <path d="M132 110 C155 110, 168 135, 172 160" stroke="rgba(210,165,80,0.85)" strokeWidth="1.8" fill="none" />
                <path d="M268 110 C245 110, 232 135, 228 160" stroke="rgba(210,165,80,0.85)" strokeWidth="1.8" fill="none" />
                {/* Copper Pocket Rivets */}
                <circle cx="171" cy="158" r="2.8" fill="#c49a45" />
                <circle cx="229" cy="158" r="2.8" fill="#c49a45" />

                {/* Legs (Straight / Baggy Streetwear Cut) */}
                <path d="M120 200 L108 410 L188 410 L195 210 Z" fill={selectedColor} />
                <path d="M120 200 L108 410 L188 410 L195 210 Z" fill="url(#garmentLighting)" />

                <path d="M280 200 L292 410 L212 410 L205 210 Z" fill={selectedColor} />
                <path d="M280 200 L292 410 L212 410 L205 210 Z" fill="url(#garmentLighting)" />

                {/* Outer & Inseam Tobacco Contrast Stitches */}
                <path d="M110 200 L100 410" stroke="rgba(210,165,80,0.7)" strokeWidth="1.6" strokeDasharray="4 2" />
                <path d="M290 200 L300 410" stroke="rgba(210,165,80,0.7)" strokeWidth="1.6" strokeDasharray="4 2" />
              </g>
            )}

            {/* ============ 6. JOGGERS SILHOUETTE ============ */}
            {productType === 'joggers' && (
              <g id="joggersSilhouette">
                {/* Ribbed Elastic Waistband */}
                <rect x="135" y="85" width="130" height="26" rx="3" fill={selectedColor} filter="brightness(0.85)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
                {/* Chunky Metal-Tipped Drawstrings */}
                <line x1="194" y1="100" x2="188" y2="155" stroke="#f0f0f0" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="206" y1="100" x2="212" y2="150" stroke="#f0f0f0" strokeWidth="2.5" strokeLinecap="round" />
                {/* Metal Aglets */}
                <rect x="186" y="148" width="4" height="10" rx="1" fill="#c0c0c0" />
                <rect x="210" y="143" width="4" height="10" rx="1" fill="#c0c0c0" />

                {/* Pelvis & Slanted Welt Pockets */}
                <path d="M135 111 L265 111 L275 200 L125 200 Z" fill={selectedColor} />
                <line x1="140" y1="120" x2="165" y2="165" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
                <line x1="260" y1="120" x2="235" y2="165" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />

                {/* Legs (Tapered Stacking Silhouette) */}
                <path d="M125 200 L140 375 L186 375 L196 210 Z" fill={selectedColor} />
                <path d="M125 200 L140 375 L186 375 L196 210 Z" fill="url(#garmentLighting)" />

                <path d="M275 200 L260 375 L214 375 L204 210 Z" fill={selectedColor} />
                <path d="M275 200 L260 375 L214 375 L204 210 Z" fill="url(#garmentLighting)" />

                {/* Gathered Ribbed Ankle Cuffs */}
                <rect x="140" y="375" width="46" height="24" rx="2" fill={selectedColor} filter="brightness(0.85)" />
                <rect x="214" y="375" width="46" height="24" rx="2" fill={selectedColor} filter="brightness(0.85)" />
              </g>
            )}

            {/* ============ 7. MEDICAL SCRUBS SILHOUETTE ============ */}
            {productType === 'medical-scrubs' && (
              <g id="scrubsSilhouette">
                {/* Sleeves */}
                <path d="M108 110 L44 182 L80 206 L124 150 Z" fill={selectedColor} />
                <path d="M292 110 L356 182 L320 206 L276 150 Z" fill={selectedColor} />

                {/* Torso */}
                <path d="M108 110 L292 110 L286 378 L114 378 Z" fill={selectedColor} />
                <path d="M108 110 L292 110 L286 378 L114 378 Z" fill="url(#garmentLighting)" />

                {/* Cross V-Neck */}
                <polygon points="158,110 200,166 242,110" fill="#141414" />
                <path d="M156 110 L200 166 L244 110" stroke={selectedColor} strokeWidth="6" fill="none" filter="brightness(1.12)" />

                {/* Scrub Chest Pocket */}
                <rect x="135" y="180" width="46" height="56" rx="2" fill={selectedColor} filter="brightness(0.94)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
                {/* Pen compartment stitch */}
                <line x1="148" y1="180" x2="148" y2="236" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
              </g>
            )}

            {/* ============ DYNAMIC GRAPHIC / PRINT LAYER ============ */}
            {selectedPrint && selectedPrint !== 'None' && (
              <g id="printLayer" transform="translate(145, 175)">
                <rect x="0" y="0" width="110" height="68" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" />
                <text x="55" y="30" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
                  GLOBAL THUNDER
                </text>
                <text x="55" y="45" fill="#cccccc" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="1">
                  {selectedPrint.toUpperCase()}
                </text>
              </g>
            )}

            {/* ============ DYNAMIC EMBROIDERY BADGE LAYER ============ */}
            {selectedEmbroidery && selectedEmbroidery !== 'None' && (
              <g id="embroideryLayer" transform="translate(128, 150)">
                <circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.18)" stroke="#ffffff" strokeWidth="1.6" />
                <text x="16" y="20" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                  GTT
                </text>
              </g>
            )}

            {/* ============ DYNAMIC RHINESTONE CRYSTAL LAYER ============ */}
            {selectedEmbellishments && selectedEmbellishments.toLowerCase().includes('rhinestone') && (
              <g id="rhinestoneLayer" transform="translate(142, 170)">
                {[...Array(12)].map((_, i) => (
                  <circle 
                    key={i} 
                    cx={(i % 4) * 28 + 14} 
                    cy={Math.floor(i / 4) * 24 + 12} 
                    r="3.2" 
                    fill="#ffffff" 
                    filter="drop-shadow(0 0 5px #ffffff)" 
                  />
                ))}
              </g>
            )}

            {/* ============ DYNAMIC BRAND LABELS & TAGS LAYER ============ */}
            <g id="labelTagLayer">
              {/* Woven Neck Label (tops only) */}
              {productType !== 'jeans' && productType !== 'joggers' && (
                <>
                  <rect x="186" y="104" width="28" height="14" rx="1" fill="#f8f8f8" stroke="#333" strokeWidth="0.5" />
                  <text x="200" y="114" fill="#111" fontSize="4.5" fontWeight="900" textAnchor="middle">GTT</text>
                </>
              )}

              {/* Custom Hangtag on Left / Sleeve */}
              <g transform="translate(365, 235) rotate(15)">
                <line x1="0" y1="0" x2="-8" y2="-15" stroke="#888" strokeWidth="1" />
                <rect x="-6" y="0" width="22" height="38" rx="2" fill="#111111" stroke="#fff" strokeWidth="0.8" />
                <text x="5" y="18" fill="#fff" fontSize="4.5" fontWeight="800" textAnchor="middle">GTT</text>
                <text x="5" y="28" fill="#aaa" fontSize="3.5" textAnchor="middle">SPEC</text>
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div 
        style={{
          position: 'absolute',
          bottom: 16,
          right: 18,
          fontSize: 10,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--gray)',
          background: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: 2,
          border: '1px solid var(--line-dark)'
        }}
      >
        ACTIVE SILHOUETTE: {currentProductData.name.toUpperCase()}
      </div>
    </div>
  );
}

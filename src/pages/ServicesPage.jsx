import React, { useState, useRef, useEffect } from 'react';
import SafeImage from '../components/SafeImage';
import SafeVideo from '../components/SafeVideo';
import UniversalMedia from '../components/UniversalMedia';
import { REAL_PORTFOLIO_ITEMS } from '../data/mediaConfig';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Scissors,
  Layers,
  Camera,
  Share2,
  Globe,
  ShoppingBag,
  Box,
  Truck,
  Play,
  X,
  Smartphone,
  Monitor,
  Eye
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

import {
  SERVICES_HERO_MEDIA,
  SERVICE_PILLARS,
  MANUFACTURING_PROCESS,
  APPAREL_CATEGORIES,
  CONTENT_GALLERY,
  SOCIAL_MOCK_JOURNEY,
  WEB_TRANSFORMATION_STEPS,
  SHOPIFY_FEATURES,
  BRAND_JOURNEY,
  DECISION_OPTIONS
} from '../data/servicesData';

// Four core service phases metadata for storytelling & journey tracking
const PHASES = [
  { id: 'manufacturing', number: '01', title: 'PRODUCT DEVELOPMENT & MANUFACTURING', shortName: 'PRODUCT', milestone: 'IDEA → PRODUCT' },
  { id: 'content', number: '02', title: 'CONTENT & PRODUCT PHOTOGRAPHY', shortName: 'CONTENT', milestone: 'PRODUCT → CONTENT' },
  { id: 'social-media', number: '03', title: 'SOCIAL MEDIA & MARKETING', shortName: 'SOCIAL', milestone: 'CONTENT → AUDIENCE' },
  { id: 'web-ecommerce', number: '04', title: 'WEB & E-COMMERCE', shortName: 'STOREFRONT', milestone: 'STORE → LAUNCH' }
];

export default function ServicesPage() {
  const { content } = useCms();
  // State for interactive features
  const [activeHeroPanel, setActiveHeroPanel] = useState(0);
  const [activeManufacturingStep, setActiveManufacturingStep] = useState(0);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
  const [activeSocialStep, setActiveSocialStep] = useState(0);
  const [activeWebStep, setActiveWebStep] = useState(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [selectedDecision, setSelectedDecision] = useState(DECISION_OPTIONS[0].id);
  const [activeServiceDrawer, setActiveServiceDrawer] = useState(null);
  const [galleryModalItem, setGalleryModalItem] = useState(null);

  // Phase Storytelling & Journey Tracker state
  const [activePhase, setActivePhase] = useState('manufacturing');
  const [isTrackerVisible, setIsTrackerVisible] = useState(false);

  // Filter gallery items
  const filteredGallery = activeGalleryFilter === 'all'
    ? CONTENT_GALLERY
    : CONTENT_GALLERY.filter((item) => item.category === activeGalleryFilter);

  // Current decision object
  const currentDecision = DECISION_OPTIONS.find((opt) => opt.id === selectedDecision) || DECISION_OPTIONS[0];

  // Smooth scroll to an element by id (prefers chapter break if present for full storytelling immersion)
  const scrollToAnchor = (id) => {
    const chapterEl = document.getElementById(`chapter-${id}`);
    const el = chapterEl || document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track scroll position to update active phase and toggle journey tracker visibility
  useEffect(() => {
    const handleScroll = () => {
      const zone = document.getElementById('phase-storytelling-zone');
      if (!zone) return;
      const rect = zone.getBoundingClientRect();
      const inZone = rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.2;
      setIsTrackerVisible(inZone);

      // Determine which phase is currently dominant in view
      const phaseKeys = ['manufacturing', 'content', 'social-media', 'web-ecommerce'];
      for (let i = phaseKeys.length - 1; i >= 0; i--) {
        const pKey = phaseKeys[i];
        const el = document.getElementById(`chapter-${pKey}`) || document.getElementById(pKey);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= window.innerHeight * 0.5) {
            setActivePhase(pKey);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="services-page-container">
      <SEOHead />
      {/* ========================================================================= */}
      {/* 1. EDITORIAL HERO SECTION */}
      {/* ========================================================================= */}
      <section className="services-hero-section section-dark">
        <div className="wrap services-hero-wrap">
          <div className="services-hero-text">
            <p className="eyebrow hero-eyebrow">
              FROM PRODUCT IDEA TO BRAND PRESENCE
            </p>
            <h1 className="services-hero-title">
              {content?.services?.hero?.heading ? (
                content.services.hero.heading
              ) : (
                <>MORE THAN A <span className="hero-stroke">MANUFACTURER.</span></>
              )}
            </h1>
            <p className="services-hero-subtitle">
              {content?.services?.hero?.subheading || "WE HELP BRANDS BUILD THE PRODUCT, THE CONTENT AND THE DIGITAL PRESENCE AROUND IT."}
            </p>
            <p className="services-hero-desc">
              From product development and volume manufacturing to studio photography, social media execution, and Shopify e-commerce, GTT brings multiple parts of the brand-building process together into one unified partnership.
            </p>

            <div className="services-hero-cta-row">
              <Link to="/contact" className="btn btn-primary hero-btn-main">
                Start Your Project <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => scrollToAnchor('pillars')}
                className="btn hero-btn-secondary"
              >
                Explore Our Services <ChevronRight size={14} />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="hero-metrics-bar">
              <div className="hero-metric-item">
                <span className="metric-num">01</span>
                <span className="metric-label">Apparel Manufacturing</span>
              </div>
              <div className="hero-metric-divider">/</div>
              <div className="hero-metric-item">
                <span className="metric-num">02</span>
                <span className="metric-label">Content & Model Shoots</span>
              </div>
              <div className="hero-metric-divider">/</div>
              <div className="hero-metric-item">
                <span className="metric-num">03</span>
                <span className="metric-label">Social Media Management</span>
              </div>
              <div className="hero-metric-divider">/</div>
              <div className="hero-metric-item">
                <span className="metric-num">04</span>
                <span className="metric-label">Web & Shopify Setup</span>
              </div>
            </div>
          </div>

          {/* Dynamic 4-Panel Editorial Media Collage */}
          <div className="services-hero-media-grid">
            {SERVICES_HERO_MEDIA.map((item, idx) => {
              const isActive = activeHeroPanel === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveHeroPanel(idx)}
                  className={`hero-media-card ${isActive ? 'active' : ''}`}
                >
                  <UniversalMedia
                    media={{
                      image: item.image,
                      video: item.video,
                      mode: item.video ? 'hover_video' : 'image_only',
                      alt: item.label
                    }}
                    isHovered={isActive}
                    objectFit="cover"
                    className="hero-media-img"
                  />
                  <div className="hero-media-scrim" />

                  {/* Card Content: Title & Subtitle */}
                  <div className="hero-media-caption">
                    <h3 className="hero-card-title">{item.label}</h3>
                    <p className="hero-card-sub">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SERVICES OVERVIEW — FOUR MAJOR PILLARS */}
      {/* ========================================================================= */}
      <section className="section section-off" id="pillars">
        <div className="wrap">
          <div className="pillars-intro-header">
            <div>
              <p className="eyebrow">FOUR CORE CAPABILITIES</p>
              <h2 className="pillars-main-heading">
                HOW WE MOVE YOUR BRAND FORWARD.
              </h2>
            </div>
            <p className="pillars-intro-desc">
              You don't need five disjointed agencies. We align manufacturing precision with modern visual content, active social media, and digital storefront architecture.
            </p>
          </div>

          <div className="pillars-cards-container">
            {SERVICE_PILLARS.map((pillar) => (
              <div key={pillar.id} className="pillar-editorial-card">
                <div className="pillar-card-left">
                  <div className="pillar-index-row">
                    <span className="pillar-index">{pillar.number}</span>
                    <span className="pillar-badge">FULL-SERVICE CAPABILITY</span>
                  </div>

                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-tagline">{pillar.tagline}</p>
                  <p className="pillar-description">{pillar.description}</p>

                  <div className="pillar-deliverables-list">
                    <span className="deliverables-title">WHAT WE DELIVER:</span>
                    <div className="deliverables-grid">
                      {pillar.keyDeliverables.map((item, i) => (
                        <div key={i} className="deliverable-item">
                          <Check size={13} className="deliverable-check" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pillar-actions-row">
                    <button
                      onClick={() => scrollToAnchor(pillar.anchor)}
                      className="pillar-jump-btn"
                    >
                      <span>Explore In Detail</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setActiveServiceDrawer(pillar)}
                      className="pillar-scope-btn"
                    >
                      <span>View Specifications</span>
                    </button>
                  </div>
                </div>

                <div className="pillar-card-right">
                  <div className="pillar-media-frame">
                    <UniversalMedia
                      media={{
                        image: (pillar.id === 'manufacturing' && (content?.services?.manufacturingImage?.image || content?.services?.manufacturingImage)) || pillar.image,
                        video: (pillar.id === 'manufacturing' && content?.services?.manufacturingImage?.video) || pillar.video,
                        mode: (pillar.id === 'manufacturing' && content?.services?.manufacturingImage?.mode) || (pillar.video ? 'hover_video' : 'image_only'),
                        mobileMode: (pillar.id === 'manufacturing' && content?.services?.manufacturingImage?.mobileMode) || 'image_only',
                        poster: pillar.poster || pillar.image,
                        alt: pillar.title
                      }}
                      objectFit="cover"
                      className="pillar-cover-image"
                    />
                    <div className="pillar-image-overlay">
                      <span className="pillar-hud-tag">GTT SYSTEM // {pillar.shortTitle}</span>
                      <span className="pillar-hud-number">STAGE {pillar.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2B. THE CONTINUOUS BRAND BACKBONE STORYLINE RIBBON */}
      {/* ========================================================================= */}
      <section className="services-storyline-section">
        <div className="wrap">
          <div className="services-storyline-header">
            <div className="storyline-header-left">
              <span className="eyebrow story-eyebrow">THE GTT BRAND BLUEPRINT</span>
              <h3 className="storyline-headline">ONE UNIFIED SYSTEM. SIX STRATEGIC PHASES.</h3>
            </div>
            <p className="storyline-subtext">
              Instead of coordinating between five disconnected agencies, GTT connects apparel manufacturing, studio assets, audience hype, and digital storefront architecture into one synchronized roadmap.
            </p>
          </div>

          <div className="storyline-track-wrapper">
            <div className="storyline-nodes-row">
              {[
                { step: '01', node: 'IDEA', phase: 'CONCEPT & TECH PACK', desc: 'Napkin sketch, yarn spec & fit calibration', target: 'manufacturing' },
                { step: '02', node: 'PRODUCT', phase: 'BULK CUT & SEW', desc: 'Precision manufacturing & custom branding', target: 'manufacturing' },
                { step: '03', node: 'CONTENT', phase: 'STUDIO & LOOKBOOK', desc: 'High-res photography & campaign reels', target: 'content' },
                { step: '04', node: 'AUDIENCE', phase: 'SOCIAL & DROP HYPE', desc: 'Instagram teasers, grid & community', target: 'social-media' },
                { step: '05', node: 'STORE', phase: 'DIGITAL COMMERCE', desc: 'High-speed custom web & Shopify store', target: 'web-ecommerce' },
                { step: '06', node: 'LAUNCH', phase: 'GLOBAL DROP & SCALE', desc: 'Customer checkout & global re-orders', target: 'web-ecommerce' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="storyline-node-item"
                  onClick={() => scrollToAnchor(item.target)}
                  title={`Jump to ${item.phase}`}
                >
                  <div className="storyline-node-top">
                    <span className="storyline-node-num">{item.step}</span>
                    <span className="storyline-node-name">{item.node}</span>
                  </div>
                  <div className="storyline-node-bar">
                    <span className="storyline-node-dot" />
                    {idx < 5 && <span className="storyline-node-line" />}
                  </div>
                  <div className="storyline-node-bottom">
                    <span className="storyline-node-phase">{item.phase}</span>
                    <span className="storyline-node-desc">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="storyline-prompt-row">
            <button
              onClick={() => scrollToAnchor('manufacturing')}
              className="storyline-scroll-hint"
            >
              <span>ENTER CHAPTER 01: PRODUCT DEVELOPMENT</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* PHASE STORYTELLING ZONE: CHAPTERS 01 → 04 */}
      {/* ========================================================================= */}
      <div id="phase-storytelling-zone" className="phase-storytelling-zone">
        {/* CHAPTER BREAK 01 */}
        <div id="chapter-manufacturing" className="services-chapter-break break-chapter-01">
          <div className="chapter-break-inner wrap">
            <div className="chapter-progress-crumb">
              <span className="crumb-active">01 PRODUCT DEVELOPMENT</span>
              <span className="crumb-sep">→</span>
              <span className="crumb-dim" onClick={() => scrollToAnchor('content')}>02 CONTENT & PHOTO</span>
              <span className="crumb-sep">→</span>
              <span className="crumb-dim" onClick={() => scrollToAnchor('social-media')}>03 SOCIAL & MARKETING</span>
              <span className="crumb-sep">→</span>
              <span className="crumb-dim" onClick={() => scrollToAnchor('web-ecommerce')}>04 WEB & E-COMMERCE</span>
            </div>

            <div className="chapter-content-grid">
              <div className="chapter-num-col">
                <div className="chapter-huge-num" aria-hidden="true">01</div>
                <div className="chapter-num-line" />
              </div>
              <div className="chapter-narrative-col">
                <div className="chapter-eyebrow-row">
                  <span className="chapter-eyebrow-tag">CHAPTER 01 // 04</span>
                  <span className="chapter-milestone-tag">MILESTONE: IDEA → PRODUCT</span>
                </div>
                <h2 className="chapter-title">PRODUCT DEVELOPMENT & MANUFACTURING</h2>
                <p className="chapter-manifesto">
                  Before any marketing campaign or online store can succeed, the garment must be engineered with uncompromising craft. From yarn calibration, shrinkage allowance, and custom dyes to full-scale assembly line production.
                </p>
                <div className="chapter-enter-cue" onClick={() => scrollToAnchor('manufacturing')}>
                  <span>EXPLORE PHASE 01</span>
                  <ChevronRight size={14} className="cue-arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PILLAR 01: PRODUCT DEVELOPMENT & MANUFACTURING */}
        {/* ========================================================================= */}
        <section className="section section-dark" id="manufacturing">
          <div className="wrap">
            <div className="section-header-block">
              <div className="phase-intro-badge">
                <span className="phase-badge-pill">PHASE 01 // 04</span>
                <span className="phase-badge-title">BESPOKE APPAREL SUPPLY CHAIN</span>
              </div>
              <p className="eyebrow">PILLAR 01 // BESPOKE APPAREL SUPPLY CHAIN</p>
              <h2 className="section-display-title">
                FROM IDEA TO FINISHED PRODUCT.
              </h2>
            <p className="section-supporting-copy">
              We help clothing brands engineer, prototype, and manufacture custom apparel from yarn calibration to bulk delivery. No catalog limits. Total creative control.
            </p>
          </div>

          {/* Apparel Categories Grid */}
          <div className="apparel-categories-row">
            {APPAREL_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="category-capsule">
                <span className="category-cap-num">0{idx + 1}</span>
                <h4 className="category-cap-name">{cat.name}</h4>
                <p className="category-cap-details">{cat.details}</p>
              </div>
            ))}
          </div>

          {/* 8-Stage Manufacturing Visual Process */}
          <div className="mfg-process-container">
            <div className="mfg-process-header">
              <span className="process-eyebrow">8-STAGE VISUAL MANUFACTURING PROTOCOL</span>
              <span className="process-guide-hint">CLICK ANY STAGE TO INSPECT PROTOCOL</span>
            </div>

            {/* Stepped Progress Track */}
            <div className="mfg-step-nav" role="tablist">
              {MANUFACTURING_PROCESS.map((proc, idx) => {
                const isActive = activeManufacturingStep === idx;
                return (
                  <button
                    key={proc.step}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveManufacturingStep(idx)}
                    className={`mfg-nav-step ${isActive ? 'active' : ''}`}
                  >
                    <span className="step-num">{proc.step}</span>
                    <span className="step-label">{proc.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Interactive View */}
            <div className="mfg-active-stage-card">
              <div className="mfg-stage-content">
                <div className="stage-meta-row">
                  <span className="stage-badge">
                    {MANUFACTURING_PROCESS[activeManufacturingStep].badge}
                  </span>
                  <span className="stage-indicator">
                    STEP {MANUFACTURING_PROCESS[activeManufacturingStep].step} OF 08
                  </span>
                </div>

                <h3 className="stage-title">
                  {MANUFACTURING_PROCESS[activeManufacturingStep].title} — {MANUFACTURING_PROCESS[activeManufacturingStep].subtitle}
                </h3>

                <p className="stage-desc">
                  {MANUFACTURING_PROCESS[activeManufacturingStep].desc}
                </p>

                <div className="stage-actions">
                  <Link to="/contact" className="btn btn-primary">
                    Start Production Sampling <ArrowRight size={14} />
                  </Link>
                  <Link to="/contact" className="stage-inquiry-link">
                    Inquire About Sampling →
                  </Link>
                </div>
              </div>

              <div className="mfg-stage-visual">
                <img
                  src={MANUFACTURING_PROCESS[activeManufacturingStep].image}
                  alt={MANUFACTURING_PROCESS[activeManufacturingStep].title}
                  className="stage-img"
                />
                <div className="stage-img-hud">
                  <span>FACTORY_SPEC // {MANUFACTURING_PROCESS[activeManufacturingStep].title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER BREAK 02 */}
      <div id="chapter-content" className="services-chapter-break break-chapter-02">
        <div className="chapter-break-inner wrap">
          <div className="chapter-progress-crumb">
            <span className="crumb-dim" onClick={() => scrollToAnchor('manufacturing')}>01 MANUFACTURING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-active">02 CONTENT & PRODUCT PHOTOGRAPHY</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('social-media')}>03 SOCIAL & MARKETING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('web-ecommerce')}>04 WEB & E-COMMERCE</span>
          </div>

          <div className="chapter-content-grid">
            <div className="chapter-num-col">
              <div className="chapter-huge-num" aria-hidden="true">02</div>
              <div className="chapter-num-line" />
            </div>
            <div className="chapter-narrative-col">
              <div className="chapter-eyebrow-row">
                <span className="chapter-eyebrow-tag">CHAPTER 02 // 04</span>
                <span className="chapter-milestone-tag">MILESTONE: PRODUCT → CONTENT</span>
              </div>
              <h2 className="chapter-title">CONTENT & PRODUCT PHOTOGRAPHY</h2>
              <p className="chapter-manifesto">
                Garments come off our production line and immediately transition into our creative photo studios. High-definition ghost mannequin captures, macro stitch details, 4K motion reels, and on-model editorial lookbooks that command customer trust.
              </p>
              <div className="chapter-enter-cue" onClick={() => scrollToAnchor('content')}>
                <span>EXPLORE PHASE 02</span>
                <ChevronRight size={14} className="cue-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PILLAR 02: CONTENT & PRODUCT PHOTOGRAPHY */}
      {/* ========================================================================= */}
      <section className="section" id="content">
        <div className="wrap">
          <div className="section-header-block">
            <div className="phase-intro-badge">
              <span className="phase-badge-pill">PHASE 02 // 04</span>
              <span className="phase-badge-title">VISUAL ASSET PRODUCTION</span>
            </div>
            <p className="eyebrow">PILLAR 02 // VISUAL ASSET PRODUCTION</p>
            <h2 className="section-display-title">
              YOUR PRODUCT DESERVES GOOD CONTENT.
            </h2>
            <p className="section-supporting-copy">
              We don't just make the product. We can help you create the content that sells it. Clean studio photography, macro detail captures, on-model lookbooks, and high-energy motion reels.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="gallery-filter-bar">
            {[
              { id: 'all', label: 'ALL VISUALS' },
              { id: 'product', label: 'PRODUCT PHOTOGRAPHY' },
              { id: 'detail', label: 'DETAIL & MACRO' },
              { id: 'model', label: 'MODEL LOOKBOOKS' },
              { id: 'video', label: 'SHORT-FORM REELS' },
              { id: 'bts', label: 'BEHIND THE SCENES' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveGalleryFilter(filter.id)}
                className={`filter-btn ${activeGalleryFilter === filter.id ? 'active' : ''}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="content-gallery-grid">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setGalleryModalItem(item)}
                className="gallery-item-card"
              >
                <div className="gallery-image-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="gallery-thumbnail"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-zoom-icon">
                      <Eye size={18} />
                    </span>
                    <span className="gallery-inspect-text">INSPECT ASSET</span>
                  </div>
                </div>

                <div className="gallery-caption-box">
                  <div className="gallery-tag-row">
                    <span className="gallery-category-tag">{item.categoryLabel}</span>
                    <span className="gallery-format-badge">{item.tag}</span>
                  </div>
                  <h4 className="gallery-item-title">{item.title}</h4>
                  <p className="gallery-item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER BREAK 03 */}
      <div id="chapter-social-media" className="services-chapter-break break-chapter-03">
        <div className="chapter-break-inner wrap">
          <div className="chapter-progress-crumb">
            <span className="crumb-dim" onClick={() => scrollToAnchor('manufacturing')}>01 MANUFACTURING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('content')}>02 CONTENT & PHOTO</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-active">03 SOCIAL MEDIA & MARKETING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('web-ecommerce')}>04 WEB & E-COMMERCE</span>
          </div>

          <div className="chapter-content-grid">
            <div className="chapter-num-col">
              <div className="chapter-huge-num" aria-hidden="true">03</div>
              <div className="chapter-num-line" />
            </div>
            <div className="chapter-narrative-col">
              <div className="chapter-eyebrow-row">
                <span className="chapter-eyebrow-tag">CHAPTER 03 // 04</span>
                <span className="chapter-milestone-tag">MILESTONE: CONTENT → AUDIENCE</span>
              </div>
              <h2 className="chapter-title">SOCIAL MEDIA & MARKETING</h2>
              <p className="chapter-manifesto">
                A finished collection without an audience is just static warehouse inventory. We engineer digital anticipation through structured drop rollouts, high-contrast Instagram grids, viral reel pacing, and authentic community positioning.
              </p>
              <div className="chapter-enter-cue" onClick={() => scrollToAnchor('social-media')}>
                <span>EXPLORE PHASE 03</span>
                <ChevronRight size={14} className="cue-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. PILLAR 03: SOCIAL MEDIA & MARKETING */}
      {/* ========================================================================= */}
      <section className="section section-dark" id="social-media">
        <div className="wrap">
          <div className="section-header-block">
            <div className="phase-intro-badge">
              <span className="phase-badge-pill">PHASE 03 // 04</span>
              <span className="phase-badge-title">AUDIENCE ENGAGEMENT & EXECUTION</span>
            </div>
            <p className="eyebrow">PILLAR 03 // AUDIENCE ENGAGEMENT & EXECUTION</p>
            <h2 className="section-display-title">
              WE CAN HELP YOU SHOW UP TOO.
            </h2>
            <p className="section-supporting-copy">
              Once the product is ready, your audience still needs to see it. We help brands manage Instagram aesthetics, schedule collection drop teasers, curate reels, and maintain consistent presence without unproven marketing fluff.
            </p>
          </div>

          {/* Interactive Mock Instagram Journey */}
          <div className="social-journey-layout">
            {/* Left: Progression Step Buttons */}
            <div className="social-steps-list">
              <span className="social-pipeline-title">CONTENT-TO-MARKET PIPELINE</span>
              {SOCIAL_MOCK_JOURNEY.map((item, idx) => {
                const isActive = activeSocialStep === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSocialStep(idx)}
                    className={`social-step-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="social-step-num">0{idx + 1}</div>
                    <div className="social-step-info">
                      <span className="social-step-phase">{item.phase}</span>
                      <span className="social-step-badge">{item.badge}</span>
                    </div>
                    {isActive && <ChevronRight size={16} className="social-step-arrow" />}
                  </button>
                );
              })}
            </div>

            {/* Right: Mock Instagram Feed / Reel Inspector */}
            <div className="social-mock-preview-panel">
              <div className="mock-device-frame">
                {/* Device Header */}
                <div className="mock-device-topbar">
                  <div className="mock-camera-notch" />
                  <div className="mock-ig-header">
                    <span className="mock-brand-handle">@yourbrand_official</span>
                    <span className="mock-verified-dot">✓</span>
                  </div>
                </div>

                {/* Media Image / Reel View */}
                <div className="mock-ig-media-wrapper">
                  <img
                    src={SOCIAL_MOCK_JOURNEY[activeSocialStep].image}
                    alt={SOCIAL_MOCK_JOURNEY[activeSocialStep].title}
                    className="mock-ig-img"
                  />
                  <div className="mock-ig-format-pill">
                    {SOCIAL_MOCK_JOURNEY[activeSocialStep].format}
                  </div>
                </div>

                {/* Post Body & Captions */}
                <div className="mock-ig-footer">
                  <div className="mock-ig-actions">
                    <span>♡ 1,428 likes</span>
                    <span className="mock-stage-status">
                      {SOCIAL_MOCK_JOURNEY[activeSocialStep].metrics}
                    </span>
                  </div>
                  <div className="mock-ig-caption">
                    <strong>yourbrand_official</strong>{' '}
                    {SOCIAL_MOCK_JOURNEY[activeSocialStep].caption}
                  </div>
                  <div className="mock-ig-tags">
                    #streetwear #apparelproduction #luxuryblanks #globalthundertrade
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER BREAK 04 */}
      <div id="chapter-web-ecommerce" className="services-chapter-break break-chapter-04">
        <div className="chapter-break-inner wrap">
          <div className="chapter-progress-crumb">
            <span className="crumb-dim" onClick={() => scrollToAnchor('manufacturing')}>01 MANUFACTURING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('content')}>02 CONTENT & PHOTO</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-dim" onClick={() => scrollToAnchor('social-media')}>03 SOCIAL & MARKETING</span>
            <span className="crumb-sep">→</span>
            <span className="crumb-active">04 WEB & E-COMMERCE</span>
          </div>

          <div className="chapter-content-grid">
            <div className="chapter-num-col">
              <div className="chapter-huge-num" aria-hidden="true">04</div>
              <div className="chapter-num-line" />
            </div>
            <div className="chapter-narrative-col">
              <div className="chapter-eyebrow-row">
                <span className="chapter-eyebrow-tag">CHAPTER 04 // 04</span>
                <span className="chapter-milestone-tag">MILESTONE: STORE → LAUNCH</span>
              </div>
              <h2 className="chapter-title">WEB ARCHITECTURE & SHOPIFY E-COMMERCE</h2>
              <p className="chapter-manifesto">
                Your flagship digital storefront is where traffic transforms into paying collectors. We engineer high-speed, bespoke web design and turnkey Shopify architectures optimized for high-traffic collection drops and frictionless one-thumb checkout.
              </p>
              <div className="chapter-enter-cue" onClick={() => scrollToAnchor('web-ecommerce')}>
                <span>EXPLORE PHASE 04</span>
                <ChevronRight size={14} className="cue-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. PILLAR 04: WEB DEVELOPMENT & 7. SHOPIFY E-COMMERCE */}
      {/* ========================================================================= */}
      <section className="section section-off" id="web-ecommerce">
        <div className="wrap">
          {/* Custom Web Section */}
          <div className="section-header-block">
            <div className="phase-intro-badge">
              <span className="phase-badge-pill">PHASE 04 // 04</span>
              <span className="phase-badge-title">DIGITAL ARCHITECTURE & SHOPIFY</span>
            </div>
            <p className="eyebrow">PILLAR 04 // DIGITAL ARCHITECTURE</p>
            <h2 className="section-display-title">
              YOUR BRAND NEEDS A HOME.
            </h2>
            <p className="section-supporting-copy">
              We build modern websites that turn your products into a real digital storefront. High-speed, responsive, editorial layouts that command attention and convert visitors into collectors.
            </p>
          </div>

          {/* Web Transformation Process (Design -> Build -> Product -> Launch) */}
          <div className="web-process-strip">
            {WEB_TRANSFORMATION_STEPS.map((step, idx) => {
              const isActive = activeWebStep === idx;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveWebStep(idx)}
                  className={`web-step-card ${isActive ? 'active' : ''}`}
                >
                  <div className="web-step-top">
                    <span className="web-num">0{idx + 1}</span>
                    <span className="web-phase">{step.phase}</span>
                  </div>
                  <h4 className="web-title">{step.title}</h4>
                  <p className="web-desc">{step.desc}</p>
                  <div className="web-deliverable-tag">
                    <span>DELIVERABLE:</span> {step.deliverable}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Shopify Subsection */}
          <div className="shopify-dedicated-block">
            <div className="shopify-header-content">
              <div className="shopify-badge-row">
                <span className="shopify-tag">SHOPIFY E-COMMERCE ACCELERATION</span>
                <span className="shopify-highlight">DIRECT-TO-CONSUMER</span>
              </div>
              <h3 className="shopify-main-headline">
                READY TO SELL? LET'S BUILD THE STORE.
              </h3>
              <p className="shopify-supporting-text">
                We set up Shopify stores that give your brand a clean, professional place to sell. Responsive product pages, high-definition lookbooks, mobile one-thumb checkouts, and seamless inventory management.
              </p>
            </div>

            {/* Shopify Features Grid */}
            <div className="shopify-features-grid">
              {SHOPIFY_FEATURES.map((feat, idx) => (
                <div key={idx} className="shopify-feat-item">
                  <div className="feat-icon-box">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h5 className="feat-title">{feat.title}</h5>
                    <p className="feat-desc">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Browser Mockup */}
            <div className="shopify-store-mockup-frame">
              <div className="browser-chrome-bar">
                <div className="browser-dots">
                  <span className="b-dot b-red" />
                  <span className="b-dot b-yellow" />
                  <span className="b-dot b-green" />
                </div>
                <div className="browser-url-pill">
                  https://yourbrand.com/products/heavyweight-hoodie
                </div>
              </div>

              <div className="browser-mockup-body">
                <div className="store-mockup-left">
                  <img
                    src="/media/blanks/heavyweight-boxy-hoodie-main.jpg"
                    alt="Store Mockup Product"
                    className="store-product-img"
                  />
                </div>
                <div className="store-mockup-right">
                  <span className="store-brand-eyebrow">NEW COLLECTION DROP 01</span>
                  <h4 className="store-product-name">VINTAGE WASH 480 GSM FLEECE HOODIE</h4>
                  <div className="store-price-tag">$125.00 USD <span className="store-stock-tag">IN STOCK</span></div>
                  <p className="store-product-summary">
                    Combed ring-spun cotton. Custom 3D puff embroidery on chest. Heavyweight ribbed hem & cuffs. Preshrunk luxury drape.
                  </p>

                  <div className="store-sizes-selector">
                    <span className="size-pill active">S</span>
                    <span className="size-pill active">M</span>
                    <span className="size-pill active">L</span>
                    <span className="size-pill active">XL</span>
                    <span className="size-pill">XXL</span>
                  </div>

                  <button className="store-add-cart-btn">
                    ADD TO CART — INSTANT CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div> {/* /#phase-storytelling-zone */}

      {/* ========================================================================= */}
      {/* 8. THE GTT BRAND-BUILDING JOURNEY */}
      {/* ========================================================================= */}
      <section className="section section-dark" id="journey">
        <div className="wrap">
          <div className="section-header-block">
            <p className="eyebrow">UNIFIED BRAND PARTNERSHIP</p>
            <h2 className="section-display-title">
              ONE IDEA. MANY MOVES.
            </h2>
            <p className="section-supporting-copy">
              You don't necessarily need five different partners to move your brand forward. Click through the complete sequence to see how GTT guides your concept from drafting table to market drop.
            </p>
          </div>

          {/* Interactive 9-Step Journey Selector */}
          <div className="journey-interactive-container">
            {/* Horizontal Milestone Pipeline */}
            <div className="journey-timeline-bar" role="tablist">
              {BRAND_JOURNEY.map((item, idx) => {
                const isActive = activeJourneyStep === idx;
                return (
                  <button
                    key={item.step}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveJourneyStep(idx)}
                    className={`journey-step-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="j-step-num">{item.step}</span>
                    <span className="j-step-name">{item.title}</span>
                    <div className="j-step-indicator" />
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Card */}
            <div className="journey-active-display">
              <div className="journey-display-text">
                <div className="j-meta-header">
                  <span className="j-phase-badge">STAGE {BRAND_JOURNEY[activeJourneyStep].step} OF 09</span>
                  <span className="j-role-tag">{BRAND_JOURNEY[activeJourneyStep].role}</span>
                </div>

                <h3 className="j-active-title">
                  {BRAND_JOURNEY[activeJourneyStep].title}
                </h3>

                <p className="j-active-desc">
                  {BRAND_JOURNEY[activeJourneyStep].desc}
                </p>

                <div className="j-benefit-box">
                  <span className="j-benefit-label">THE GTT ADVANTAGE:</span>
                  <p className="j-benefit-text">{BRAND_JOURNEY[activeJourneyStep].benefit}</p>
                </div>

                <div className="j-cta-row">
                  <Link to="/contact" className="btn btn-primary">
                    Start at Stage {BRAND_JOURNEY[activeJourneyStep].step} <ArrowRight size={14} />
                  </Link>
                  <span className="j-partner-note">Full-spectrum partner support</span>
                </div>
              </div>

              <div className="journey-display-media">
                <img
                  src={BRAND_JOURNEY[activeJourneyStep].image}
                  alt={BRAND_JOURNEY[activeJourneyStep].title}
                  className="j-media-img"
                />
                <div className="j-media-hud">
                  <span>GTT_ROADMAP // {BRAND_JOURNEY[activeJourneyStep].title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 10. WHAT DO YOU ACTUALLY NEED? (DECISION MATRIX) */}
      {/* ========================================================================= */}
      <section className="section section-off" id="decision">
        <div className="wrap">
          <div className="section-header-block">
            <p className="eyebrow">TAILORED ONBOARDING PATHWAYS</p>
            <h2 className="section-display-title">
              WHAT ARE YOU BUILDING?
            </h2>
            <p className="section-supporting-copy">
              Whether you are an emerging designer with a napkin sketch or an established brand scaling bulk volume, select where you are right now:
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="decision-tabs-grid">
            {DECISION_OPTIONS.map((opt) => {
              const isSelected = selectedDecision === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDecision(opt.id)}
                  className={`decision-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>

          {/* Active Decision Recommendation Card */}
          <div className="decision-result-card">
            <div className="decision-card-left">
              <span className="decision-rec-tag">RECOMMENDED GTT SERVICE PATH</span>
              <h3 className="decision-service-name">{currentDecision.service}</h3>
              <h4 className="decision-headline">{currentDecision.headline}</h4>
              <p className="decision-desc">{currentDecision.desc}</p>

              <div className="decision-deliverables">
                <span className="d-deliv-title">INCLUDED DELIVERABLES:</span>
                <div className="d-deliv-list">
                  {currentDecision.deliverables.map((item, i) => (
                    <div key={i} className="d-deliv-pill">
                      <Check size={12} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="decision-card-right">
              <div className="decision-cta-box">
                <span className="d-box-eyebrow">READY TO MOVE?</span>
                <h4 className="d-box-title">LET'S START THE CONVERSATION</h4>
                <p className="d-box-desc">
                  Our engineering and creative teams review mockups and project briefs within 24 business hours.
                </p>
                <Link to={currentDecision.ctaLink} className="btn btn-primary d-box-btn">
                  {currentDecision.ctaText} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL EDITORIAL CTA */}
      {/* ========================================================================= */}
      <section className="section section-dark final-cta-section">
        <div className="wrap final-cta-wrap">
          <p className="eyebrow final-eyebrow">GLOBAL THUNDER TRADE // PARTNERSHIP</p>
          <h2 className="final-cta-headline">
            READY TO BUILD <span className="hero-stroke">THE BRAND?</span>
          </h2>
          <p className="final-cta-subtext">
            Bring us the idea. Let's figure out the rest.
          </p>

          <div className="final-cta-buttons">
            <Link to="/contact" className="btn btn-primary final-btn-solid">
              Start Your Project <ArrowRight size={14} />
            </Link>
            <Link to="/be-a-supplier" className="btn final-btn-outline">
              Be a Supplier <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SERVICE DETAIL INTERACTIVE DRAWER / MODAL */}
      {/* ========================================================================= */}
      {activeServiceDrawer && (
        <div className="service-drawer-backdrop" onClick={() => setActiveServiceDrawer(null)}>
          <div className="service-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="drawer-eyebrow">SPECIFICATION SHEET</span>
                <h3 className="drawer-title">{activeServiceDrawer.title}</h3>
              </div>
              <button
                onClick={() => setActiveServiceDrawer(null)}
                className="drawer-close-btn"
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-media-frame">
                <img
                  src={activeServiceDrawer.image}
                  alt={activeServiceDrawer.title}
                  className="drawer-img"
                />
              </div>

              <div className="drawer-section">
                <span className="drawer-label">OVERVIEW</span>
                <p className="drawer-text">{activeServiceDrawer.description}</p>
              </div>

              <div className="drawer-section">
                <span className="drawer-label">STANDARD DELIVERABLES</span>
                <div className="drawer-deliverables-list">
                  {activeServiceDrawer.keyDeliverables.map((item, idx) => (
                    <div key={idx} className="drawer-deliv-item">
                      <Check size={14} className="drawer-check" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="drawer-footer-cta">
                <Link
                  to="/contact"
                  onClick={() => setActiveServiceDrawer(null)}
                  className="btn btn-primary drawer-btn"
                >
                  Inquire For {activeServiceDrawer.shortTitle} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Inspection Lightbox Modal */}
      {galleryModalItem && (
        <div className="gallery-modal-backdrop" onClick={() => setGalleryModalItem(null)}>
          <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setGalleryModalItem(null)}
              className="gallery-modal-close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <div className="gallery-modal-img-wrap">
              <img
                src={galleryModalItem.image}
                alt={galleryModalItem.title}
                className="gallery-modal-img"
              />
            </div>
            <div className="gallery-modal-info">
              <span className="modal-category">{galleryModalItem.categoryLabel}</span>
              <h3 className="modal-title">{galleryModalItem.title}</h3>
              <p className="modal-desc">{galleryModalItem.desc}</p>
              <div className="modal-cta-row">
                <Link
                  to="/contact"
                  onClick={() => setGalleryModalItem(null)}
                  className="btn btn-primary"
                >
                  Book This Content Style <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING EDITORIAL JOURNEY TRACKER */}
      {/* ========================================================================= */}
      <aside
        className={`services-journey-tracker ${isTrackerVisible ? 'visible' : ''}`}
        aria-label="Services phase storytelling indicator"
      >
        <div className="tracker-inner-wrap">
          <div className="tracker-brand-tag">
            <span className="tracker-live-dot" />
            <span className="tracker-tag-text">JOURNEY TRACKER</span>
          </div>

          <div className="tracker-steps-track" role="tablist">
            {PHASES.map((phase, idx) => {
              const isActive = activePhase === phase.id;
              const phaseIndex = PHASES.findIndex((p) => p.id === activePhase);
              const isPassed = idx < phaseIndex;
              return (
                <React.Fragment key={phase.id}>
                  <button
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => scrollToAnchor(phase.id)}
                    className={`tracker-step-pill ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                    title={`Jump to Phase ${phase.number}: ${phase.title}`}
                  >
                    <span className="tracker-step-num">{phase.number}</span>
                    <span className="tracker-step-title">{phase.shortName}</span>
                    {isActive && <span className="tracker-active-glow" />}
                  </button>
                  {idx < PHASES.length - 1 && (
                    <div className={`tracker-step-connector ${isPassed ? 'passed' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="tracker-phase-summary">
            <span className="tracker-milestone">
              {PHASES.find((p) => p.id === activePhase)?.milestone || 'PHASE ACTIVE'}
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* PAGE SCOPED COMPONENT STYLES */}
      {/* ========================================================================= */}
      <style>{`
        .services-page-container {
          padding-top: var(--nav-h);
          background: var(--white);
          color: var(--black);
          overflow-x: hidden;
        }

        /* ========================================================================= */
        /* STORYTELLING BLUEPRINT RIBBON & CHAPTER TRANSITIONS */
        /* ========================================================================= */

        /* Storyline Blueprint Ribbon */
        .services-storyline-section {
          padding: 72px 0 64px;
          background: #0a0a0a;
          color: #ffffff;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
        }

        .services-storyline-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 5%;
          right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
        }

        .services-storyline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 36px;
          margin-bottom: 44px;
        }

        .story-eyebrow {
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 11px;
          letter-spacing: 0.2em;
          margin-bottom: 10px;
        }

        .storyline-headline {
          font-family: var(--font-heading);
          font-size: clamp(22px, 3.2vw, 36px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .storyline-subtext {
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.65);
          max-width: 500px;
          margin: 0;
        }

        .storyline-track-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .storyline-nodes-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          position: relative;
        }

        .storyline-node-item {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 8px;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .storyline-node-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.32);
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
        }

        .storyline-node-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
        }

        .storyline-node-num {
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-heading);
          letter-spacing: 0.08em;
        }

        .storyline-node-name {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
        }

        .storyline-node-bar {
          position: relative;
          height: 14px;
          display: flex;
          align-items: center;
          margin-bottom: 14px;
        }

        .storyline-node-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.85);
          z-index: 2;
          transition: transform 0.25s ease;
        }

        .storyline-node-item:hover .storyline-node-dot {
          transform: scale(1.35);
        }

        .storyline-node-line {
          position: absolute;
          left: 9px;
          right: -16px;
          top: 50%;
          height: 2px;
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-50%);
          z-index: 1;
        }

        .storyline-node-bottom {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .storyline-node-phase {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
        }

        .storyline-node-desc {
          font-size: 11px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.45);
        }

        .storyline-prompt-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 12px;
        }

        .storyline-scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .storyline-scroll-hint:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(3px);
        }

        /* Phase Storytelling Zone */
        .phase-storytelling-zone {
          position: relative;
        }

        /* Chapter Transitions */
        .services-chapter-break {
          position: relative;
          background: #080808;
          color: #ffffff;
          padding: 92px 0 80px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        .services-chapter-break::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 18% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .chapter-progress-crumb {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 38px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
        }

        .crumb-active {
          color: #ffffff;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
        }

        .crumb-active::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.95);
        }

        .crumb-dim {
          color: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .crumb-dim:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .crumb-sep {
          color: rgba(255, 255, 255, 0.2);
          font-size: 12px;
        }

        .chapter-content-grid {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 52px;
          align-items: center;
        }

        .chapter-num-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
        }

        .chapter-huge-num {
          font-family: var(--font-heading);
          font-size: clamp(88px, 12vw, 154px);
          font-weight: 800;
          line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.45);
          letter-spacing: -0.04em;
          user-select: none;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), -webkit-text-stroke-color 0.4s ease;
        }

        .services-chapter-break:hover .chapter-huge-num {
          -webkit-text-stroke-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-4px);
        }

        .chapter-num-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
          margin-top: 14px;
        }

        .chapter-narrative-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chapter-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .chapter-eyebrow-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.65);
        }

        .chapter-milestone-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          padding: 3px 10px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .chapter-title {
          font-family: var(--font-heading);
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-transform: uppercase;
          margin: 4px 0 12px;
        }

        .chapter-manifesto {
          font-size: clamp(14px, 1.25vw, 17px);
          line-height: 1.68;
          color: rgba(255, 255, 255, 0.75);
          max-width: 740px;
          margin: 0 0 16px;
          font-weight: 300;
        }

        .chapter-enter-cue {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffffff;
          padding: 8px 18px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .chapter-enter-cue:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.18);
        }

        .chapter-enter-cue:hover .cue-arrow {
          transform: translateX(4px);
        }

        .cue-arrow {
          transition: transform 0.25s ease;
        }

        /* Phase Intro Badges in Pillar Headers */
        .phase-intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .section:not(.section-dark) .phase-intro-badge {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .phase-badge-pill {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          background: #000000;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .section:not(.section-dark) .phase-badge-pill {
          color: #000000;
          background: #ffffff;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .phase-badge-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }

        .section:not(.section-dark) .phase-badge-title {
          color: rgba(0, 0, 0, 0.75);
        }

        /* Floating Editorial Journey Tracker */
        .services-journey-tracker {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(120%);
          z-index: 990;
          opacity: 0;
          pointer-events: none;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
        }

        .services-journey-tracker.visible {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .tracker-inner-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 9px 18px;
          background: rgba(10, 10, 10, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05);
          max-width: calc(100vw - 32px);
        }

        .tracker-brand-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-right: 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.14);
        }

        .tracker-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
          animation: trackerPulse 2s infinite ease-in-out;
        }

        @keyframes trackerPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }

        .tracker-tag-text {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.8);
          white-space: nowrap;
        }

        .tracker-steps-track {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tracker-step-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 13px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--font-body);
          position: relative;
          white-space: nowrap;
        }

        .tracker-step-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .tracker-step-pill.active {
          color: #000000;
          background: #ffffff;
          font-weight: 700;
          border-color: #ffffff;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.28);
        }

        .tracker-step-pill.passed {
          color: rgba(255, 255, 255, 0.85);
        }

        .tracker-step-num {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          font-family: var(--font-heading);
        }

        .tracker-step-title {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .tracker-step-connector {
          width: 16px;
          height: 2px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 1px;
          transition: background 0.3s ease;
        }

        .tracker-step-connector.passed {
          background: rgba(255, 255, 255, 0.6);
        }

        .tracker-phase-summary {
          display: flex;
          align-items: center;
          padding-left: 14px;
          border-left: 1px solid rgba(255, 255, 255, 0.14);
        }

        .tracker-milestone {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
        }

        /* Subtle Section Imagery Transitions */
        .stage-img,
        .gallery-thumbnail,
        .mock-ig-img,
        .store-product-img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
        }

        .stage-img:hover,
        .mock-ig-img:hover {
          transform: scale(1.02);
        }

        /* Responsive Breakpoints for Phase Storytelling */
        @media (max-width: 1024px) {
          .storyline-nodes-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
          .storyline-node-line {
            display: none;
          }
          .chapter-content-grid {
            grid-template-columns: 140px 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .services-storyline-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .storyline-nodes-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .chapter-content-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .chapter-num-line {
            width: 60px;
          }
          .tracker-brand-tag,
          .tracker-phase-summary {
            display: none;
          }
          .tracker-inner-wrap {
            padding: 7px 12px;
            gap: 8px;
          }
          .tracker-step-pill {
            padding: 5px 10px;
          }
          .services-journey-tracker {
            bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .storyline-nodes-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .services-storyline-section {
            padding: 48px 0 40px;
          }
          .services-chapter-break {
            padding: 60px 0 50px;
          }
          .chapter-huge-num {
            font-size: 64px;
          }
          .chapter-title {
            font-size: 22px;
          }
          .tracker-step-title {
            display: none;
          }
          .tracker-step-pill.active .tracker-step-title {
            display: inline;
          }
          .tracker-step-connector {
            width: 10px;
          }
        }

        @media (max-width: 375px) {
          .tracker-inner-wrap {
            padding: 6px 8px;
            gap: 4px;
          }
          .tracker-step-pill {
            padding: 4px 8px;
            gap: 4px;
          }
        }

        /* 1. HERO */
        .services-hero-section {
          padding: 100px 0 120px;
          background: #090909;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .services-hero-wrap {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-eyebrow {
          color: #a0a09c !important;
          font-size: 11px;
          letter-spacing: 0.22em;
          margin-bottom: 12px;
        }

        .hero-eyebrow::before {
          background: #a0a09c !important;
        }

        .services-hero-title {
          font-size: clamp(34px, 4.8vw, 68px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.04;
          margin-bottom: 18px;
        }

        .hero-stroke {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
        }

        .services-hero-subtitle {
          font-size: clamp(14px, 1.4vw, 17px);
          font-weight: 700;
          color: #e0e0dc;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .services-hero-desc {
          font-size: 15px;
          line-height: 1.65;
          color: #90908c;
          max-width: 580px;
          margin-bottom: 32px;
        }

        .services-hero-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .hero-btn-main {
          background: #ffffff !important;
          color: #000000 !important;
          border-color: #ffffff !important;
        }

        .hero-btn-main:hover {
          background: #d4d4d0 !important;
        }

        .hero-btn-secondary {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 26px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .hero-metrics-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-metric-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-num {
          font-size: 11px;
          font-family: monospace, sans-serif;
          color: #ffffff;
          font-weight: 700;
        }

        .metric-label {
          font-size: 12px;
          color: #888885;
          font-weight: 600;
        }

        .hero-metric-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 12px;
        }

        /* 4-Panel Hero Media Collage */
        .services-hero-media-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .hero-media-card {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #151515;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          cursor: pointer;
          transition: transform 0.4s ease, border-color 0.4s ease;
        }

        .hero-media-card.active,
        .hero-media-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .hero-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.5) contrast(1.15) brightness(0.85);
          transition: transform 0.6s ease, filter 0.6s ease;
        }

        .hero-media-card:hover .hero-media-img {
          transform: scale(1.05);
          filter: grayscale(0.2) contrast(1.2) brightness(0.95);
        }

        .hero-media-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%);
          pointer-events: none;
        }

        .hero-media-caption {
          position: absolute;
          bottom: 18px;
          left: 18px;
          right: 18px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          line-height: 1.25;
        }

        .hero-card-sub {
          font-size: 11px;
          font-weight: 500;
          color: #9c9c98;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          line-height: 1.3;
          margin: 0;
        }

        /* 2. PILLARS OVERVIEW */
        .pillars-intro-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .pillars-main-heading {
          font-size: clamp(28px, 3.8vw, 48px);
          margin-top: 14px;
        }

        .pillars-intro-desc {
          max-width: 480px;
          font-size: 15px;
          line-height: 1.6;
          color: var(--gray-dark);
        }

        .pillars-cards-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pillar-editorial-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 50px;
          background: var(--white);
          border: 1px solid var(--line-light);
          padding: 48px;
          border-radius: 3px;
          align-items: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pillar-editorial-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.04);
        }

        .pillar-index-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .pillar-index {
          font-size: 14px;
          font-weight: 800;
          color: var(--black);
          font-family: monospace, sans-serif;
          border-left: 2px solid var(--black);
          padding-left: 8px;
        }

        .pillar-badge {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.12em;
          color: var(--gray-dark);
        }

        .pillar-title {
          font-size: clamp(22px, 2.6vw, 34px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.1;
        }

        .pillar-tagline {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--black);
          margin-bottom: 12px;
        }

        .pillar-description {
          font-size: 14px;
          line-height: 1.65;
          color: var(--gray-dark);
          margin-bottom: 24px;
        }

        .deliverables-title {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: var(--gray);
          display: block;
          margin-bottom: 10px;
          font-family: monospace, sans-serif;
        }

        .deliverables-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 16px;
          margin-bottom: 30px;
        }

        .deliverable-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--black);
        }

        .deliverable-check {
          color: var(--black);
          flex-shrink: 0;
        }

        .pillar-actions-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .pillar-jump-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--black);
          color: var(--white);
          padding: 13px 22px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .pillar-jump-btn:hover {
          background: #333333;
          transform: translateY(-2px);
        }

        .pillar-scope-btn {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--gray-dark);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease;
        }

        .pillar-scope-btn:hover {
          color: var(--black);
        }

        .pillar-media-frame {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 2px;
          overflow: hidden;
          background: var(--charcoal);
        }

        .pillar-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.5) contrast(1.15);
          transition: transform 0.6s ease;
        }

        .pillar-editorial-card:hover .pillar-cover-image {
          transform: scale(1.04);
        }

        .pillar-image-overlay {
          position: absolute;
          bottom: 16px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace, sans-serif;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.12em;
          background: rgba(0,0,0,0.7);
          padding: 8px 12px;
          border-radius: 2px;
        }

        /* 3. SECTION HEADERS */
        .section-header-block {
          margin-bottom: 48px;
        }

        .section-display-title {
          font-size: clamp(28px, 4vw, 54px);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 14px 0 16px;
          line-height: 1.08;
        }

        .section-supporting-copy {
          font-size: 16px;
          line-height: 1.65;
          color: var(--gray);
          max-width: 680px;
        }

        /* Apparel Categories Capsule Strip */
        .apparel-categories-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }

        .category-capsule {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          padding: 20px;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background 0.3s ease;
        }

        .category-capsule:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .category-cap-num {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: #888885;
        }

        .category-cap-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .category-cap-details {
          font-size: 11.5px;
          line-height: 1.45;
          color: #90908c;
          margin: 0;
        }

        /* 8-Stage Manufacturing Visual Process */
        .mfg-process-container {
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          padding: 32px;
        }

        .mfg-process-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .process-eyebrow {
          font-size: 11px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: #ffffff;
          font-weight: 700;
        }

        .process-guide-hint {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.12em;
          color: #777774;
        }

        .mfg-step-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .mfg-nav-step {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #888885;
          padding: 8px 14px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .mfg-nav-step:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .mfg-nav-step.active {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffffff;
          color: #ffffff;
        }

        .step-num {
          font-size: 10px;
          font-family: monospace, sans-serif;
          opacity: 0.7;
        }

        .mfg-active-stage-card {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 40px;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 32px;
          border-radius: 2px;
        }

        .stage-meta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .stage-badge {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 2px;
        }

        .stage-indicator {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: #777774;
        }

        .stage-title {
          font-size: clamp(20px, 2.4vw, 30px);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 14px;
          line-height: 1.15;
        }

        .stage-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #a0a09c;
          margin-bottom: 28px;
          max-width: 520px;
        }

        .stage-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stage-inquiry-link {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .mfg-stage-visual {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 2px;
          overflow: hidden;
          background: #000000;
        }

        .stage-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.6) contrast(1.15);
        }

        .stage-img-hud {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(0,0,0,0.8);
          font-family: monospace, sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 2px;
        }

        /* 4. CONTENT & PRODUCT PHOTOGRAPHY */
        .gallery-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 40px;
        }

        .filter-btn {
          background: var(--off-white);
          border: 1px solid var(--line-light);
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          color: var(--gray-dark);
        }

        .filter-btn:hover {
          color: var(--black);
          border-color: var(--black);
        }

        .filter-btn.active {
          background: var(--black);
          color: var(--white);
          border-color: var(--black);
        }

        .content-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .gallery-item-card {
          background: var(--white);
          border: 1px solid var(--line-light);
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .gallery-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.06);
        }

        .gallery-image-wrap {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--off-white);
        }

        .gallery-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.5) contrast(1.1);
          transition: transform 0.5s ease;
        }

        .gallery-item-card:hover .gallery-thumbnail {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: #ffffff;
        }

        .gallery-item-card:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-inspect-text {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          font-weight: 700;
        }

        .gallery-caption-box {
          padding: 20px 22px;
        }

        .gallery-tag-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .gallery-category-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--gray-dark);
          text-transform: uppercase;
        }

        .gallery-format-badge {
          font-size: 9.5px;
          font-family: monospace, sans-serif;
          background: var(--off-white);
          padding: 2px 6px;
          border-radius: 2px;
          color: var(--black);
          font-weight: 700;
        }

        .gallery-item-title {
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .gallery-item-desc {
          font-size: 12.5px;
          color: var(--gray-dark);
          line-height: 1.5;
        }

        /* 5. SOCIAL MEDIA & MARKETING */
        .social-journey-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .social-pipeline-title {
          font-size: 11px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: #888885;
          margin-bottom: 16px;
          display: block;
        }

        .social-steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-step-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 20px;
          border-radius: 2px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
          color: #ffffff;
        }

        .social-step-item:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .social-step-item.active {
          background: rgba(255, 255, 255, 0.12);
          border-color: #ffffff;
        }

        .social-step-num {
          font-size: 14px;
          font-family: monospace, sans-serif;
          font-weight: 800;
          color: #ffffff;
        }

        .social-step-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
        }

        .social-step-phase {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .social-step-badge {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: #a0a09c;
          letter-spacing: 0.1em;
        }

        .social-step-arrow {
          color: #ffffff;
        }

        /* Mock Instagram Frame */
        .social-mock-preview-panel {
          display: flex;
          justify-content: center;
        }

        .mock-device-frame {
          width: 100%;
          max-width: 380px;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.8);
        }

        .mock-device-topbar {
          padding: 14px 16px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mock-camera-notch {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .mock-ig-header {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .mock-verified-dot {
          background: #ffffff;
          color: #000000;
          font-size: 8px;
          border-radius: 50%;
          padding: 1px 3px;
        }

        .mock-ig-media-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #111111;
        }

        .mock-ig-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.4) contrast(1.15);
        }

        .mock-ig-format-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.7);
          font-size: 9px;
          font-family: monospace, sans-serif;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 2px;
          letter-spacing: 0.1em;
        }

        .mock-ig-footer {
          padding: 14px 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mock-ig-actions {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #ffffff;
          font-weight: 700;
        }

        .mock-stage-status {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: #888885;
        }

        .mock-ig-caption {
          font-size: 12px;
          line-height: 1.45;
          color: #d4d4d0;
        }

        .mock-ig-tags {
          font-size: 11px;
          color: #777774;
        }

        /* 6. WEB DEVELOPMENT & 7. SHOPIFY E-COMMERCE */
        .web-process-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 70px;
        }

        .web-step-card {
          background: var(--white);
          border: 1px solid var(--line-light);
          padding: 28px 22px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .web-step-card:hover,
        .web-step-card.active {
          border-color: var(--black);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.05);
        }

        .web-step-card.active {
          border-top: 3px solid var(--black);
        }

        .web-step-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .web-num {
          font-size: 12px;
          font-family: monospace, sans-serif;
          font-weight: 800;
          color: var(--gray);
        }

        .web-phase {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.12em;
          color: var(--black);
          font-weight: 700;
        }

        .web-title {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .web-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--gray-dark);
          margin-bottom: 16px;
        }

        .web-deliverable-tag {
          font-size: 11px;
          background: var(--off-white);
          padding: 6px 10px;
          border-radius: 2px;
          font-family: monospace, sans-serif;
          color: var(--black);
        }

        .web-deliverable-tag span {
          font-weight: 700;
          color: var(--gray-dark);
        }

        /* Dedicated Shopify Subsection */
        .shopify-dedicated-block {
          background: var(--white);
          border: 1px solid var(--line-light);
          padding: 48px;
          border-radius: 3px;
        }

        .shopify-header-content {
          max-width: 700px;
          margin-bottom: 36px;
        }

        .shopify-badge-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .shopify-tag {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: var(--black);
          font-weight: 700;
          border: 1px solid var(--black);
          padding: 2px 8px;
          border-radius: 2px;
        }

        .shopify-highlight {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: var(--gray-dark);
        }

        .shopify-main-headline {
          font-size: clamp(24px, 3.2vw, 40px);
          font-weight: 800;
          margin-bottom: 14px;
        }

        .shopify-supporting-text {
          font-size: 15px;
          line-height: 1.6;
          color: var(--gray-dark);
        }

        .shopify-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--line-light);
        }

        .shopify-feat-item {
          display: flex;
          gap: 14px;
        }

        .feat-icon-box {
          width: 36px;
          height: 36px;
          background: var(--off-white);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          flex-shrink: 0;
          color: var(--black);
        }

        .feat-title {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .feat-desc {
          font-size: 12.5px;
          color: var(--gray-dark);
          line-height: 1.5;
        }

        /* Shopify Store Mockup */
        .shopify-store-mockup-frame {
          border: 1px solid var(--line-light);
          border-radius: 4px;
          overflow: hidden;
          background: var(--white);
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }

        .browser-chrome-bar {
          background: #f0ede8;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--line-light);
        }

        .browser-dots {
          display: flex;
          gap: 6px;
        }

        .b-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .b-red { background: #ff5f56; }
        .b-yellow { background: #ffbd2e; }
        .b-green { background: #27c93f; }

        .browser-url-pill {
          background: #ffffff;
          padding: 4px 14px;
          border-radius: 2px;
          font-family: monospace, sans-serif;
          font-size: 10.5px;
          color: var(--gray-dark);
          width: 100%;
          max-width: 440px;
        }

        .browser-mockup-body {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          padding: 36px;
          align-items: center;
        }

        .store-mockup-left {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--off-white);
          border-radius: 2px;
        }

        .store-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.5);
        }

        .store-brand-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--gray-dark);
          display: block;
          margin-bottom: 8px;
        }

        .store-product-name {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .store-price-tag {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .store-stock-tag {
          font-size: 9px;
          font-family: monospace, sans-serif;
          background: #000000;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 2px;
        }

        .store-product-summary {
          font-size: 13px;
          color: var(--gray-dark);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .store-sizes-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .size-pill {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line-light);
          font-size: 11px;
          font-weight: 700;
          border-radius: 2px;
        }

        .size-pill.active {
          border-color: var(--black);
          background: var(--black);
          color: var(--white);
        }

        .store-add-cart-btn {
          width: 100%;
          background: var(--black);
          color: var(--white);
          padding: 14px 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
        }

        /* 8. BRAND JOURNEY */
        .journey-interactive-container {
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          padding: 32px;
        }

        .journey-timeline-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 32px;
          -webkit-overflow-scrolling: touch;
        }

        .journey-step-btn {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          border-radius: 2px;
          cursor: pointer;
          min-width: 110px;
          text-align: left;
          transition: all 0.25s ease;
        }

        .journey-step-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .journey-step-btn.active {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffffff;
        }

        .j-step-num {
          font-size: 10px;
          font-family: monospace, sans-serif;
          color: #888885;
        }

        .journey-step-btn.active .j-step-num {
          color: #ffffff;
        }

        .j-step-name {
          font-size: 11px;
          font-weight: 800;
          color: #d4d4d0;
          white-space: nowrap;
        }

        .journey-step-btn.active .j-step-name {
          color: #ffffff;
        }

        .j-step-indicator {
          width: 100%;
          height: 2px;
          background: transparent;
          margin-top: 4px;
        }

        .journey-step-btn.active .j-step-indicator {
          background: #ffffff;
        }

        .journey-active-display {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .j-meta-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .j-phase-badge {
          font-size: 10px;
          font-family: monospace, sans-serif;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .j-role-tag {
          font-size: 11px;
          font-family: monospace, sans-serif;
          color: #888885;
        }

        .j-active-title {
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .j-active-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: #a0a09c;
          margin-bottom: 24px;
          max-width: 520px;
        }

        .j-benefit-box {
          background: rgba(255, 255, 255, 0.04);
          border-left: 2px solid #ffffff;
          padding: 14px 18px;
          margin-bottom: 28px;
          max-width: 520px;
        }

        .j-benefit-label {
          font-size: 9.5px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: #ffffff;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        .j-benefit-text {
          font-size: 13px;
          color: #d4d4d0;
          margin: 0;
        }

        .j-cta-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .j-partner-note {
          font-size: 11px;
          font-family: monospace, sans-serif;
          color: #777774;
        }

        .journey-display-media {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 2px;
          overflow: hidden;
          background: #000000;
        }

        .j-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.55) contrast(1.18);
        }

        .j-media-hud {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(0,0,0,0.8);
          font-family: monospace, sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 2px;
        }

        /* 10. DECISION MATRIX */
        .decision-tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 36px;
        }

        .decision-tab-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--white);
          border: 1px solid var(--line-light);
          padding: 14px 18px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          color: var(--black);
        }

        .decision-tab-btn:hover {
          border-color: var(--black);
          background: var(--off-white);
        }

        .decision-tab-btn.active {
          background: var(--black);
          color: var(--white);
          border-color: var(--black);
        }

        .decision-result-card {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 50px;
          background: var(--white);
          border: 1px solid var(--line-light);
          padding: 48px;
          border-radius: 3px;
          align-items: center;
          box-shadow: 0 16px 40px rgba(0,0,0,0.03);
        }

        .decision-rec-tag {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: var(--gray-dark);
          display: block;
          margin-bottom: 8px;
        }

        .decision-service-name {
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 800;
          margin-bottom: 6px;
        }

        .decision-headline {
          font-size: 14px;
          font-weight: 700;
          color: var(--gray-dark);
          margin-bottom: 14px;
        }

        .decision-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--gray-dark);
          margin-bottom: 24px;
        }

        .d-deliv-title {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: var(--gray);
          display: block;
          margin-bottom: 10px;
        }

        .d-deliv-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .d-deliv-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--off-white);
          padding: 6px 12px;
          font-size: 11.5px;
          font-weight: 600;
          border-radius: 2px;
          color: var(--black);
        }

        .decision-cta-box {
          background: var(--off-white);
          border: 1px solid var(--line-light);
          padding: 36px;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .d-box-eyebrow {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: var(--gray-dark);
        }

        .d-box-title {
          font-size: 18px;
          font-weight: 800;
        }

        .d-box-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--gray-dark);
        }

        .d-box-btn {
          margin-top: 8px;
          width: 100%;
        }

        /* 11. FINAL EDITORIAL CTA */
        .final-cta-section {
          padding: 130px 0;
          background: #090909;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .final-cta-wrap {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .final-eyebrow {
          justify-content: center;
          color: #888885 !important;
          margin-bottom: 16px;
        }
        .final-eyebrow::before {
          background: #888885 !important;
        }

        .final-cta-headline {
          font-size: clamp(34px, 5.5vw, 72px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin-bottom: 18px;
        }

        .final-cta-subtext {
          font-size: 17px;
          color: #a0a09c;
          margin-bottom: 40px;
        }

        .final-cta-buttons {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .final-btn-solid {
          background: #ffffff !important;
          color: #000000 !important;
          border-color: #ffffff !important;
        }

        .final-btn-solid:hover {
          background: #d4d4d0 !important;
        }

        .final-btn-outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .final-btn-outline:hover {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        /* 9. MODALS & DRAWERS */
        .service-drawer-backdrop,
        .gallery-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .service-drawer-panel {
          width: 100%;
          max-width: 520px;
          height: 100%;
          background: #111111;
          color: #ffffff;
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
          box-shadow: -20px 0 60px rgba(0,0,0,0.8);
          animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .drawer-eyebrow {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.16em;
          color: #888885;
        }

        .drawer-title {
          font-size: 22px;
          font-weight: 800;
          margin-top: 4px;
        }

        .drawer-close-btn,
        .gallery-modal-close {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 6px;
        }

        .drawer-media-frame {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 2px;
          background: #000000;
        }

        .drawer-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.5);
        }

        .drawer-label {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: #888885;
          display: block;
          margin-bottom: 8px;
        }

        .drawer-text {
          font-size: 14px;
          line-height: 1.6;
          color: #a0a09c;
        }

        .drawer-deliverables-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .drawer-deliv-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #ffffff;
        }

        .drawer-check {
          color: #ffffff;
          flex-shrink: 0;
        }

        .drawer-btn {
          width: 100%;
        }

        /* Lightbox Modal */
        .gallery-modal-card {
          width: 90%;
          max-width: 760px;
          background: #111111;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 3px;
          overflow: hidden;
          margin: auto;
          position: relative;
        }

        .gallery-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
        }

        .gallery-modal-img-wrap {
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #000000;
        }

        .gallery-modal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-modal-info {
          padding: 28px 32px;
        }

        .modal-category {
          font-size: 10px;
          font-family: monospace, sans-serif;
          letter-spacing: 0.14em;
          color: #888885;
          display: block;
          margin-bottom: 6px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .modal-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #a0a09c;
          margin-bottom: 20px;
        }

        /* ================= RESPONSIVE DESIGN ================= */
        @media (max-width: 1200px) {
          .apparel-categories-row {
            grid-template-columns: repeat(3, 1fr);
          }
          .decision-tabs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .shopify-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .services-hero-wrap {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .pillar-editorial-card {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 32px;
          }
          .mfg-active-stage-card {
            grid-template-columns: 1fr;
          }
          .content-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .social-journey-layout {
            grid-template-columns: 1fr;
          }
          .web-process-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .browser-mockup-body {
            grid-template-columns: 1fr;
          }
          .journey-active-display {
            grid-template-columns: 1fr;
          }
          .decision-result-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .services-hero-section {
            padding: 60px 0 80px;
          }
          .services-hero-media-grid {
            grid-template-columns: 1fr;
          }
          .apparel-categories-row {
            grid-template-columns: 1fr;
          }
          .content-gallery-grid {
            grid-template-columns: 1fr;
          }
          .web-process-strip {
            grid-template-columns: 1fr;
          }
          .shopify-features-grid {
            grid-template-columns: 1fr;
          }
          .deliverables-grid {
            grid-template-columns: 1fr;
          }
          .decision-tabs-grid {
            grid-template-columns: 1fr;
          }
          .shopify-dedicated-block {
            padding: 24px;
          }
          .mfg-process-container {
            padding: 20px;
          }
          .journey-interactive-container {
            padding: 20px;
          }
          .decision-result-card {
            padding: 24px;
          }
          .hero-media-caption {
            bottom: 14px;
            left: 14px;
            right: 14px;
            gap: 3px;
          }
          .hero-card-title {
            font-size: 13.5px;
          }
          .hero-card-sub {
            font-size: 10.5px;
          }
        }

        @media (max-width: 480px) {
          .services-hero-title {
            font-size: 30px;
          }
          .services-hero-cta-row {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-btn-secondary {
            justify-content: center;
          }
          .hero-media-caption {
            bottom: 12px;
            left: 12px;
            right: 12px;
            gap: 2px;
          }
          .hero-card-title {
            font-size: 13px;
          }
          .hero-card-sub {
            font-size: 10px;
          }
        }

        /* Accessibility: Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-media-card,
          .hero-media-img,
          .pillar-editorial-card,
          .pillar-cover-image,
          .gallery-item-card,
          .gallery-thumbnail,
          .service-drawer-panel,
          .web-step-card {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

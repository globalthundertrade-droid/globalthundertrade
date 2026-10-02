import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categoriesData';
import { PRODUCTS } from '../data/productsData';
import { SIDE_PRODUCTS, DETAILS_MATTER_ITEMS } from '../data/sideProductsData';
import { BLANK_PRODUCTS } from '../data/blanksData';
import BlankCard from '../components/BlankCard';
import { BLOG_POSTS } from '../data/blogData';
import { FAQS } from '../data/faqsData';
import { COMPANY } from '../data/companyData';
import { COMPANY_STATS, PRIMARY_BRAND_STAT } from '../data/marketsData';
import { HOME_MEDIA, HERO_MEDIA } from '../data/mediaConfig';
import SafeImage from '../components/SafeImage';
import SafeVideo from '../components/SafeVideo';
import UniversalMedia from '../components/UniversalMedia';
import GlobeCanvas from '../components/GlobeCanvas';
import ProcessWorkflow from '../components/ProcessWorkflow';
import ScrollStoryShowcase from '../components/ScrollStoryShowcase';
import JourneyScrollStory from '../components/JourneyScrollStory';
import AnimatedCounter from '../components/AnimatedCounter';
import ReviewCarousel from '../components/ReviewCarousel';
import CategoryCard from '../components/CategoryCard';
import FAQAccordion from '../components/FAQAccordion';
import { ArrowRight, ArrowUpRight, Check, Sparkles, Send } from 'lucide-react';
import { InstagramIcon, LinkedInIcon, RedditIcon } from '../components/SocialIcons';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  const navigate = useNavigate();
  const { content, products: cmsProducts, blogs: cmsBlogs, categories: cmsCategories } = useCms();
  const heroContent = content?.homepage?.hero || content?.home?.hero;

  const activeCategories = CATEGORIES.map(cat => {
    const cmsCategoryItem = (cmsCategories || []).find(c => c.slug === cat.slug || c.id === cat.id);
    const cmsCat = content?.homepage?.categories?.[cat.slug] || content?.home?.categories?.[cat.slug];
    return {
      ...cat,
      ...(cmsCategoryItem || {}),
      title: cmsCategoryItem?.title || cat.title,
      description: cmsCategoryItem?.description || cat.description,
      image: cmsCat?.image || cmsCategoryItem?.image || cat.image,
      video: cmsCat?.video || cmsCategoryItem?.video || cat.video,
      mode: cmsCat?.mode || cmsCategoryItem?.mode || cat.mode || 'interaction_video',
      mobileMode: cmsCat?.mobileMode || cmsCategoryItem?.mobileMode || cat.mobileMode || 'interaction_video',
      poster: cmsCat?.poster || cmsCategoryItem?.poster || cat.poster || cmsCat?.image || cmsCategoryItem?.image || cat.image
    };
  });

  // Dynamic Blanks
  const dynamicBlanks = (cmsProducts || []).filter(p => 
    p.category === 'premium-blanks' || p.category === 'blanks' || p.isCustomBlank
  );
  const combinedBlanks = [...BLANK_PRODUCTS];
  dynamicBlanks.forEach(db => {
    const existingIdx = combinedBlanks.findIndex(b => b.id === db.id || b.slug === db.slug);
    if (existingIdx >= 0) {
      combinedBlanks[existingIdx] = { ...combinedBlanks[existingIdx], ...db };
    } else {
      combinedBlanks.unshift(db);
    }
  });

  const activeDetailsItems = DETAILS_MATTER_ITEMS.map((sp) => {
    const cmsDetail = content?.homepage?.detailsMatter?.[sp.id];
    return {
      ...sp,
      image: cmsDetail?.image || sp.image,
      video: cmsDetail?.video || sp.video,
      name: cmsDetail?.title || sp.name,
      tagline: cmsDetail?.tagline || sp.tagline
    };
  });

  // Dynamic Blogs
  const homeBlogs = (cmsBlogs && cmsBlogs.length > 0 ? cmsBlogs : BLOG_POSTS).slice(0, 3);

  // Dynamic Portfolio / Our Best Work products
  const bestWorkProducts = (cmsProducts && cmsProducts.length > 0 ? cmsProducts : PRODUCTS).slice(0, 5);

  // Final CTA
  const finalCta = content?.homepage?.finalCta || content?.home?.finalCta;

  const [visibleHomeBlanks, setVisibleHomeBlanks] = useState(8);
  const [activeDetailsId, setActiveDetailsId] = useState(null);

  useEffect(() => {
    const handleTouchOutside = (e) => {
      if (!e.target.closest('#side-products')) {
        setActiveDetailsId(null);
      }
    };
    window.addEventListener('touchstart', handleTouchOutside, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouchOutside);
  }, []);

  return (
    <div className="homepage">
      <SEOHead />
      {/* ============ HERO SECTION ============ */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <p className="hero-eyebrow">{heroContent?.eyebrow || 'GLOBAL THUNDER TRADE — APPAREL MANUFACTURING · PRODUCT DEVELOPMENT'}</p>
            <h1>
              {heroContent?.title ? (
                <span className="reveal-line in"><span>{heroContent.title}</span></span>
              ) : (
                <>
                  <span className="reveal-line in"><span>{heroContent?.title1 || "WE DON'T JUST"}</span></span>
                  <span className="reveal-line in"><span>{heroContent?.title2 || "MANUFACTURE CLOTHES."}</span></span>
                  <span className="reveal-line in" style={{ color: 'var(--black)' }}>
                    <span>{heroContent?.title3 || "WE HELP BUILD BRANDS."}</span>
                  </span>
                </>
              )}
            </h1>
            <p className="lead" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--gray-dark)', maxWidth: 500, margin: '24px 0 36px' }}>
              {heroContent?.lead || heroContent?.subtitle || 'From your first product idea to sampling, cut-and-sew manufacturing, custom trims, brand-ready finishing, and final packaging — Global Thunder Trade helps clothing brands turn concepts into production-ready collections.'}
            </p>
            <div className="hero-ctas" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to={heroContent?.primaryCtaLink || '/contact'} className="btn btn-primary">
                {heroContent?.primaryCtaText || 'Start Your Production'} <ArrowRight size={15} />
              </Link>
              <Link to={heroContent?.secondaryCtaLink || '/products'} className="btn btn-ghost">
                {heroContent?.secondaryCtaText || 'Explore Our Work'} <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="hero-img-wrap" style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
            <video
              ref={(el) => {
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                  const playPromise = el.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                  }
                }
              }}
              key={heroContent?.video || HERO_MEDIA.video || '/media/home/hero/hero-video.mp4'}
              src={heroContent?.video || HERO_MEDIA.video || '/media/home/hero/hero-video.mp4'}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block'
              }}
              className="hero-img"
            />
            <span className="hero-tag">{heroContent?.tagline || HERO_MEDIA.tagline || 'FROM IDEA → PRODUCT'}</span>
          </div>
        </div>
      </section>

      {/* ============ INTERNATIONAL REACH (ROTATING GLOBE) ============ */}
      <section className="section section-dark" id="global">
        <div className="wrap">
          <p className="eyebrow">INTERNATIONAL REACH</p>
          <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', marginTop: 20, maxWidth: 840 }}>
            FROM OUR FACTORY TO BRANDS AROUND THE WORLD.
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 560, marginTop: 18 }}>
            Helping emerging streetwear labels and high-volume clothing brands turn ideas into market-ready products across key international territories.
          </p>

          <GlobeCanvas />

          {/* Centralized International Stats Row */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line-dark)', marginTop: 70, borderTop: '1px solid var(--line-dark)', borderBottom: '1px solid var(--line-dark)' }}>
            {COMPANY_STATS.map((stat, sIdx) => (
              <div key={sIdx} className="stat" style={{ background: 'var(--black)', padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(32px, 3.4vw, 52px)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--white)' }}>
                  <AnimatedCounter value={stat.count} suffix={stat.suffix || ''} />
                </div>
                <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray)', marginTop: 8 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FROM IDEA TO MARKET (6 CATEGORY CARDS) ============ */}
      <section className="section section-off" id="work">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30, marginBottom: 50, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">MANUFACTURING SECTORS</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 16 }}>
                FROM IDEA TO MARKET.
              </h2>
            </div>
            <p style={{ color: 'var(--gray-dark)', maxWidth: 440, fontSize: 15, lineHeight: 1.6 }}>
              We organize our manufacturing infrastructure across five specialized divisions. Each division maintains dedicated machinery, fabric stock, and pattern specialists.
            </p>
          </div>

          {/* 5 Dedicated Category Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 16
            }}
            className="category-cards-grid"
          >
            {activeCategories.map((cat, idx) => (
              <CategoryCard key={cat.id || cat.slug} category={cat} index={idx} />
            ))}
          </div>

          <div style={{ marginTop: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-dark)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
              Full cut-and-sew customization available across all 5 sectors
            </span>
            <Link to="/products" className="btn btn-ghost">
              View All Product Types <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 1200px) {
            .category-cards-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 14px !important;
            }
          }
          @media (max-width: 768px) {
            .category-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
          }
          @media (max-width: 480px) {
            .category-cards-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
          }
        `}</style>
      </section>

      {/* ============ POSITIONING: "YOUR IDEA. OUR EXPERTISE." (8-STAGE SCROLL STORY) ============ */}
      <JourneyScrollStory />

      {/* ============ BLANKS PREVIEW ============ */}
      <section className="section" id="blanks">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30, marginBottom: 50, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">WHOLESALE APPAREL BLANKS</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 16 }}>
                START WITH THE RIGHT BLANK.
              </h2>
            </div>
            <p style={{ color: 'var(--gray-dark)', maxWidth: 440, fontSize: 15, lineHeight: 1.6 }}>
              Need production-ready blanks for rapid collection drops? Our luxury blank program gives you heavyweight fleece and tees ready for immediate printing and custom relabeling.
            </p>
          </div>

          {/* Unified Centralized Blanks Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24
            }}
            className="home-blanks-grid"
          >
            {combinedBlanks.slice(0, visibleHomeBlanks).map((blank) => (
              <BlankCard key={blank.id} product={blank} />
            ))}
          </div>

          {/* Show More & Full Catalogue Navigation Bar */}
          <div 
            style={{ 
              marginTop: 48, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: 20,
              paddingTop: 28,
              borderTop: '1px solid var(--line-light)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--gray-dark)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                Showing {Math.min(visibleHomeBlanks, BLANK_PRODUCTS.length)} of {BLANK_PRODUCTS.length} Blank Silhouettes
              </span>

              {visibleHomeBlanks < BLANK_PRODUCTS.length && (
                <button
                  type="button"
                  onClick={() => setVisibleHomeBlanks(prev => Math.min(prev + 8, BLANK_PRODUCTS.length))}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 20px',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Show More (+8)
                </button>
              )}
            </div>

            <Link to="/blanks" className="btn btn-primary">
              Explore Full 25+ Blanks Catalogue <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 1200px) {
            .home-blanks-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 20px !important;
            }
          }
          @media (max-width: 860px) {
            .home-blanks-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 16px !important;
            }
          }
          @media (max-width: 520px) {
            .home-blanks-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
          }
        `}</style>
      </section>

      {/* ============ FULL CUSTOMIZATION: YOUR PRODUCT. YOUR RULES. (SCROLL-DRIVEN STORYTELLING) ============ */}
      <ScrollStoryShowcase />

      {/* ============ WHY BRANDS WORK WITH US + GOOGLE REVIEWS ============ */}
      <section className="section section-off" id="reviews">
        <div className="wrap">
          <p className="eyebrow">PARTNERSHIP VALUE</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 20 }}>
            WHY BRANDS WORK WITH US.
          </h2>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 30,
              marginTop: 44,
              paddingBottom: 40,
              borderBottom: '1px solid var(--line-light)'
            }}
            className="why-grid-home"
          >
            <div style={{ borderTop: '2px solid var(--black)', paddingTop: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray)' }}>01</span>
              <h3 style={{ fontSize: 17, textTransform: 'none', fontWeight: 800, margin: '14px 0 10px' }}>
                Product Guidance
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-dark)' }}>
                We don't just take orders blindly. We guide yarn weights, shrinkage allowance, and construction methods.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--black)', paddingTop: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray)' }}>02</span>
              <h3 style={{ fontSize: 17, textTransform: 'none', fontWeight: 800, margin: '14px 0 10px' }}>
                Custom Development
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-dark)' }}>
                Every garment is graded around your specific silhouette targets rather than pulling a generic catalog mold.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--black)', paddingTop: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray)' }}>03</span>
              <h3 style={{ fontSize: 17, textTransform: 'none', fontWeight: 800, margin: '14px 0 10px' }}>
                Production Support
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-dark)' }}>
                Dedicated account managers track your run through sampling, cutting, embroidery, and shipping.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--black)', paddingTop: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray)' }}>04</span>
              <h3 style={{ fontSize: 17, textTransform: 'none', fontWeight: 800, margin: '14px 0 10px' }}>
                Brand-Ready Finishing
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-dark)' }}>
                Labels, custom hangtags, branded ziplock polybags, and barcoding ready for direct retail or 3PL fulfillment.
              </p>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .why-grid-home {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (max-width: 540px) {
              .why-grid-home {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Real Google Reviews Carousel Component */}
          <ReviewCarousel />
        </div>
      </section>

      {/* ============ PROCESS: FROM IDEA TO PRODUCT ============ */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="eyebrow">HOW WE WORK</p>
          <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', marginTop: 20 }}>
            FROM IDEA TO PRODUCT.
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 540, marginTop: 14 }}>
            Click any step below to explore how concepts transition from raw sketch to physical sample, bulk manufacturing, and global dispatch.
          </p>

          <ProcessWorkflow />
        </div>
      </section>

      {/* ============ OUR BEST WORK (PORTFOLIO & SOCIAL PROOF) ============ */}
      <section className="section section-dark" style={{ borderTop: '1px solid var(--line-dark)' }}>
        <div className="wrap">
          {/* Social Presence at Top of Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 40, borderBottom: '1px solid var(--line-dark)', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p className="eyebrow">COMMUNITY &amp; INDUSTRY PRESENCE</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', marginTop: 10 }}>
                CONNECT WITH GTT.
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://instagram.com/globalthundertrade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-connect-link"
                title="Follow GTT on Instagram"
              >
                <InstagramIcon size={16} color="#ffffff" /> Instagram
              </a>
              <a 
                href="https://linkedin.com/company/global-thunder-trade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-connect-link"
                title="Connect with GTT on LinkedIn"
              >
                <LinkedInIcon size={16} color="#ffffff" /> LinkedIn
              </a>
              <a 
                href="https://reddit.com/r/streetwearstartup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-connect-link"
                title="Connect with GTT on Reddit r/streetwearstartup"
              >
                <RedditIcon size={16} color="#ffffff" /> Reddit
              </a>
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <p className="eyebrow">PORTFOLIO</p>
            <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', marginTop: 16 }}>
              OUR BEST WORK.
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: 15, marginTop: 14, maxWidth: 500 }}>
              Select pieces engineered for streetwear, contemporary fashion, leather lines, and technical wear.
            </p>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridAutoRows: 140,
                gap: 16,
                marginTop: 40
              }}
              className="gallery-grid"
            >
              {bestWorkProducts.map((p, i) => {
                const isBig = i === 0;
                const isWide = i === 2 || i === 4;
                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.category}/${p.slug}`}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 2,
                      gridColumn: isBig ? 'span 3' : (isWide ? 'span 3' : 'span 2'),
                      gridRow: isBig ? 'span 3' : 'span 2'
                    }}
                    className="gallery-item"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform .7s var(--ease), opacity .7s var(--ease)'
                      }}
                      className="g-img"
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 20
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                            {p.category}
                          </span>
                          <div style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', color: 'var(--white)', marginTop: 2 }}>
                            {p.name}
                          </div>
                        </div>
                        <ArrowUpRight size={18} color="var(--white)" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div style={{ marginTop: 50 }}>
              <Link to="/products" className="btn btn-ghost">
                View All Manufacturing Categories <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .gallery-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              grid-auto-rows: 220px !important;
            }
            .gallery-item {
              grid-column: span 1 !important;
              grid-row: span 1 !important;
            }
          }
          .gallery-item:hover .g-img {
            transform: scale(1.06);
            opacity: 0.85;
          }
        `}</style>
      </section>

      {/* ============ THE DETAILS MATTER (SIDE PRODUCTS STRIP) ============ */}
      <section className="section section-off" id="side-products">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">CUSTOM TRIMS &amp; HARDWARE</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', marginTop: 16 }}>
                THE DETAILS MATTER.
              </h2>
            </div>
            <p style={{ color: 'var(--gray-dark)', fontSize: 15, maxWidth: 440 }}>
              Chains, buckles, zippers, rhinestones, patches, woven damask labels, and precision hardware engineered to complete your collection.
            </p>
          </div>

          <div 
            className="tdm-strip"
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              marginTop: 44,
              paddingBottom: 14,
              scrollbarWidth: 'none'
            }}
          >
            {activeDetailsItems.map((sp) => {
              const isActive = activeDetailsId === sp.id;
              return (
                <Link
                  key={sp.id}
                  to="/side-products"
                  className={`tdm-item ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
                      if (activeDetailsId !== sp.id) {
                        e.preventDefault();
                        setActiveDetailsId(sp.id);
                      }
                    }
                  }}
                  style={{
                    flex: '0 0 auto',
                    width: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div className="tdm-media">
                    <img 
                      src={sp.image} 
                      alt={sp.name} 
                      className="tdm-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="tdm-title">
                    {sp.name}
                  </div>
                  <span className="tdm-tagline">
                    {sp.tagline}
                  </span>
                  <div className="tdm-indicator" />
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 40 }}>
            <Link to="/side-products" className="btn btn-ghost">
              Explore All Side Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          /* ===================================================
             THE DETAILS MATTER — EDITORIAL HOVER & MONOCHROME SYSTEM
             =================================================== */
          .tdm-item {
            position: relative;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            cursor: pointer;
          }

          .tdm-media {
            width: 200px;
            height: 200px;
            border-radius: 2px;
            overflow: hidden;
            background: var(--white);
            border: 1px solid rgba(0, 0, 0, 0.06);
            position: relative;
            box-sizing: border-box;
          }

          /* DEFAULT STATE: High-end Monochrome / Black & White Treatment */
          .tdm-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            filter: grayscale(100%) contrast(102%);
            transform: scale(1);
            transition: filter 400ms cubic-bezier(0.25, 1, 0.5, 1),
                        transform 400ms cubic-bezier(0.25, 1, 0.5, 1);
            will-change: filter, transform;
          }

          .tdm-title {
            margin-top: 13px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: var(--black);
            transition: transform 350ms cubic-bezier(0.25, 1, 0.5, 1),
                        color 350ms ease;
          }

          .tdm-tagline {
            font-size: 11px;
            color: var(--gray-dark);
            margin-top: 2px;
            letter-spacing: .02em;
            transition: color 350ms ease;
          }

          .tdm-indicator {
            width: 0px;
            height: 2px;
            background: var(--black);
            margin-top: 6px;
            transition: width 350ms cubic-bezier(0.25, 1, 0.5, 1);
          }

          /* DESKTOP HOVER: ONLY the individual item hovered blooms into full color */
          @media (hover: hover) and (pointer: fine) {
            .tdm-item:hover .tdm-img,
            .tdm-item:focus-visible .tdm-img {
              filter: grayscale(0%) contrast(100%) brightness(1.02);
              transform: scale(1.03);
            }
            .tdm-item:hover .tdm-title,
            .tdm-item:focus-visible .tdm-title {
              transform: translateY(-1px);
              color: var(--black);
            }
            .tdm-item:hover .tdm-indicator,
            .tdm-item:focus-visible .tdm-indicator {
              width: 24px;
            }
          }

          /* MOBILE / TABLET / TOUCH ACTIVE STATE */
          .tdm-item.is-active .tdm-img {
            filter: grayscale(0%) contrast(100%) brightness(1.02);
            transform: scale(1.03);
          }
          .tdm-item.is-active .tdm-title {
            transform: translateY(-1px);
            color: var(--black);
          }
          .tdm-item.is-active .tdm-indicator {
            width: 24px;
          }
        `}</style>
      </section>

      {/* ============ ABOUT SECTION PREVIEW (FACTORY FLOOR) ============ */}
      <section className="section" id="about">
        <div className="wrap">
          <p className="eyebrow">ABOUT GTT</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 20 }}>
            MADE WITH PURPOSE.
          </h2>
          <p style={{ color: 'var(--gray-dark)', fontSize: 16, maxWidth: 540, marginTop: 16, lineHeight: 1.65 }}>
            Behind every finished product is a disciplined industrial process — from pattern engineering and laser cutting to assembly stitching, screen printing, 4-stage quality control, and export packaging.
          </p>

          <div style={{ aspectRatio: '16/8', overflow: 'hidden', borderRadius: 2, margin: '44px 0 20px', background: 'var(--off-white)' }}>
            <SafeImage 
              src="/media/home/idea-to-market/05-manufacturing.jpg" 
              fallbackSrc="/media/homepage/factory-preview-cutting.jpg"
              alt="GTT Manufacturing Facility" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 14
            }}
            className="factory-mini-grid"
          >
            {HOME_MEDIA.factoryPreview.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                <SafeImage src={item.img} fallbackSrc={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span 
                  style={{
                    position: 'absolute',
                    left: 10,
                    bottom: 10,
                    color: 'var(--white)',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '3px 6px',
                    borderRadius: 2
                  }}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44 }}>
            <Link to="/about" className="btn btn-ghost">
              Read More About GTT <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .factory-mini-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .factory-mini-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="section section-off" id="faq">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 20, marginBottom: 44 }}>
            QUESTIONS? WE'VE GOT ANSWERS.
          </h2>
          <FAQAccordion items={FAQS.slice(0, 6)} />
          <div style={{ marginTop: 30 }}>
            <Link to="/contact" className="btn btn-ghost">
              Have Another Question? Contact GTT <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BLOG / JOURNAL PREVIEW ============ */}
      <section className="section" id="blog">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30, marginBottom: 50, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">FACTORY JOURNAL</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 16 }}>
                FROM THE FACTORY FLOOR.
              </h2>
            </div>
            <p style={{ color: 'var(--gray-dark)', maxWidth: 440, fontSize: 15, lineHeight: 1.6 }}>
              Insights on fabric GSM selection, tech pack drafting, luxury trims, and scaling an independent clothing label.
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 26
            }}
            className="home-blog-grid"
          >
            {homeBlogs.map((post) => (
              <article key={post.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to={`/blog/${post.slug}`} style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: 2, marginBottom: 18, display: 'block' }}>
                  <UniversalMedia
                    media={{
                      image: post.image,
                      video: post.video,
                      mode: post.mediaMode || (post.video ? 'hover_video' : 'image_only'),
                      mobileMode: post.mobileMediaMode || 'image_only',
                      poster: post.poster || post.image,
                      alt: post.title
                    }}
                    objectFit="cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Link>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
                  {post.category} &middot; {post.readTime || '5 min read'}
                </span>
                <h3 style={{ fontSize: 19, textTransform: 'none', fontWeight: 800, margin: '10px 0 8px', lineHeight: 1.3 }}>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-dark)', marginBottom: 16, flexGrow: 1 }}>
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Read Article <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 44 }}>
            <Link to="/blog" className="btn btn-ghost">
              Explore All Journal Articles <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .home-blog-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section section-dark" id="final-cta">
        <div 
          className="wrap final-cta-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 60,
            alignItems: 'center'
          }}
        >
          <div>
            <p className="eyebrow">{finalCta?.eyebrow || 'START PRODUCTION'}</p>
            <h2 style={{ fontSize: 'clamp(36px, 5.5vw, 76px)', lineHeight: 0.96, margin: '20px 0 24px' }}>
              {finalCta?.heading || 'READY TO BUILD SOMETHING?'}
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: 16, lineHeight: 1.65, maxWidth: 460, marginBottom: 36 }}>
              {finalCta?.description || 'Send us your initial concept, tech pack, or sketch. Our technical team will review silhouettes, recommend fabric GSM, and begin sample drafting.'}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to={finalCta?.buttonLink || '/contact'} className="btn btn-primary">
                {finalCta?.buttonText || 'Send Your Mockup'} <ArrowRight size={15} />
              </Link>
              <Link to="/be-a-supplier" className="btn btn-ghost">
                Be a Supplier
              </Link>
            </div>
          </div>

          <div style={{ aspectRatio: '4/5', overflow: 'hidden', borderRadius: 2 }}>
            <UniversalMedia 
              media={{
                image: finalCta?.image || HOME_MEDIA.finalCta.image,
                video: finalCta?.video || '',
                mode: finalCta?.mode || 'image_only',
                mobileMode: finalCta?.mobileMode || 'image_only',
                poster: finalCta?.poster || finalCta?.image,
                alt: finalCta?.alt || HOME_MEDIA.finalCta.alt
              }}
              fallbackImage={HOME_MEDIA.finalCta.fallbackImage || HOME_MEDIA.finalCta.image}
              objectFit="cover"
              objectPosition="center center"
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .final-cta-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}

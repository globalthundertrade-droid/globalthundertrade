import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../data/companyData';
import { ArrowRight, CheckCircle2, ShieldCheck, Factory, Globe2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useCms } from '../context/CmsContext';
import UniversalMedia from '../components/UniversalMedia';

export default function AboutPage() {
  const { content } = useCms();
  const aboutContent = content?.about || {};

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead />
      {/* Header */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="eyebrow">ABOUT GLOBAL THUNDER TRADE</p>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', marginTop: 20 }}>
            {aboutContent.hero?.heading || 'MADE WITH PURPOSE.'}
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 18, maxWidth: 680, marginTop: 18, lineHeight: 1.65 }}>
            {aboutContent.hero?.subheading || COMPANY.tagline}
          </p>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 660, marginTop: 14, lineHeight: 1.65 }}>
            Global Thunder Trade is an international apparel manufacturing and product development company based in Pakistan, serving clothing brands, independent labels, and retail designers worldwide.
          </p>
        </div>
      </section>

      {/* Story & Infrastructure */}
      <section className="section">
        <div className="wrap about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 50px)', marginTop: 16 }}>
              A PRODUCTION PARTNER, NOT JUST A FACTORY.
            </h2>
            <p style={{ color: 'var(--gray-dark)', fontSize: 16, lineHeight: 1.7, marginTop: 20 }}>
              Founded with the vision to bridge emerging fashion creators and industrial apparel manufacturing, Global Thunder Trade delivers complete transparency, premium fabric options, and uncompromising attention to detail.
            </p>
            <p style={{ color: 'var(--gray-dark)', fontSize: 15, lineHeight: 1.7, marginTop: 14 }}>
              From initial tech pack review to fabric knitting, dyeing, precision cut-and-sew, custom embellishment, and final packaging — we manage every milestone under one roof.
            </p>

            <div style={{ marginTop: 30, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid var(--line-light)', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                Fabric Testing
              </span>
              <span style={{ border: '1px solid var(--line-light)', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                Pattern Grading
              </span>
              <span style={{ border: '1px solid var(--line-light)', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                4-Stage Quality Inspection
              </span>
              <span style={{ border: '1px solid var(--line-light)', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                Worldwide Export
              </span>
            </div>
          </div>

          <div style={{ aspectRatio: '5/4', overflow: 'hidden', borderRadius: 2, background: 'var(--off-white)' }}>
            <UniversalMedia 
              media={aboutContent.storyImage || '/media/about/about-studio.jpg'}
              alt="GTT Development & Patternmaking Studio" 
              objectFit="cover"
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .about-story-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>

      {/* Factory Floor Image Slots (7 Dedicated Slots) */}
      <section className="section section-off">
        <div className="wrap">
          <p className="eyebrow">OUR PRODUCTION INFRASTRUCTURE</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', marginTop: 16 }}>
            INSIDE OUR FACTORY.
          </h2>
          <p style={{ color: 'var(--gray-dark)', fontSize: 15, maxWidth: 540, marginTop: 12, lineHeight: 1.6 }}>
            Each department operates with dedicated machinery and experienced operators to maintain precise quality standards.
          </p>

          {/* Main Factory Floor Slot */}
          <div style={{ aspectRatio: '16/7', overflow: 'hidden', borderRadius: 2, margin: '40px 0 20px', background: 'var(--white)' }}>
            <UniversalMedia 
              media={aboutContent.factoryFloor || '/media/about/about-factory-floor.jpg'}
              alt="GTT Main Factory Floor" 
              objectFit="cover"
            />
          </div>

          {/* 6 Specialized Production Slots */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 16
            }}
            className="factory-six-grid"
          >
            {[
              {
                slot: 'pattern',
                title: 'Pattern Grading',
                desc: 'CAD pattern drafting, grading & marker efficiency',
                img: '/media/about/01-pattern-grading.jpg'
              },
              {
                slot: 'cutting',
                title: 'Cutting Department',
                desc: 'Automated spreading & laser precision cutting tables',
                img: '/media/about/cutting.jpg'
              },
              {
                slot: 'stitching',
                title: 'Stitching Lines',
                desc: 'Heavy-duty 4-thread overlock & flatlock industrial machines',
                img: '/media/about/stitching.jpg'
              },
              {
                slot: 'embroidery',
                title: 'Embroidery Suite',
                desc: 'Multi-head automated embroidery for 3D puff and chenille',
                img: '/media/about/embroidery.jpg'
              },
              {
                slot: 'inspection',
                title: 'Quality Control',
                desc: 'Measurement tolerance audits, seam strength tests & trimming',
                img: '/media/about/qc.jpg'
              },
              {
                slot: 'packaging',
                title: 'Brand Finishing',
                desc: 'Steam pressing, woven labeling, tags & frosted polybag seal',
                img: '/media/about/packaging.jpg'
              }
            ].map((slotItem) => {
              const cmsSlotMedia = aboutContent.factorySlots?.[slotItem.slot] || slotItem.img;
              return (
                <div 
                  key={slotItem.slot}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--white)',
                    border: '1px solid var(--line-light)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <UniversalMedia 
                      media={cmsSlotMedia} 
                      alt={slotItem.title} 
                      objectFit="cover" 
                    />
                  </div>
                  <div style={{ padding: 14 }}>
                    <h4 style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 800 }}>
                      {slotItem.title}
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 4, lineHeight: 1.4 }}>
                      {slotItem.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .factory-six-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            .factory-six-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </section>

      {/* Trust Pillars */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">OUR COMMITMENT</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 50px)', marginTop: 16 }}>
            WHY GLOBAL BRANDS WORK WITH US.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 40 }}>
            {[
              {
                icon: <Factory size={24} />,
                title: 'Factory-Direct Pricing',
                desc: 'Eliminating intermediaries so you receive authentic factory-direct cost structures and transparent unit pricing.'
              },
              {
                icon: <CheckCircle2 size={24} />,
                title: 'Flexible MOQs',
                desc: 'From initial 50-piece sample batches to full-scale container orders, built to grow alongside your label.'
              },
              {
                icon: <ShieldCheck size={24} />,
                title: 'Rigorous QC Standards',
                desc: 'Four-stage physical quality inspections guarantee seam integrity, color consistency, and exact measurement tolerance.'
              },
              {
                icon: <Globe2 size={24} />,
                title: 'Worldwide Logistics',
                desc: 'Reliable air and ocean freight delivery to brand warehouses and fulfillment centers globally.'
              }
            ].map((pillar, pIdx) => (
              <div 
                key={pIdx} 
                style={{ 
                  background: 'var(--off-white)', 
                  padding: 32, 
                  borderRadius: 2, 
                  border: '1px solid var(--line-light)' 
                }}
              >
                <div style={{ color: 'var(--black)', marginBottom: 16 }}>{pillar.icon}</div>
                <h3 style={{ fontSize: 18, textTransform: 'uppercase', fontWeight: 800 }}>{pillar.title}</h3>
                <p style={{ color: 'var(--gray-dark)', fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="wrap" style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="eyebrow">START YOUR COLLECTION</p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', marginTop: 16 }}>
            READY TO MANUFACTURE?
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, marginTop: 16, lineHeight: 1.6 }}>
            Share your sketches, mockups, or tech packs. Our team will review your specifications and provide a detailed cost breakdown.
          </p>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              Request Production Quote <ArrowRight size={15} />
            </Link>
            <Link to="/products" className="btn btn-ghost">
              Explore Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

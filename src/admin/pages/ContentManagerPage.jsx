import React, { useState, useEffect } from 'react';
import UniversalMediaControl from '../components/UniversalMediaControl';
import { Save, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

const CATEGORY_SECTORS = [
  { slug: 'street-fashion', title: 'Street & Fashion', route: '/products/street-fashion', defaultImage: '/streetwear and fasion/image.jpg', defaultVideo: '/streetwear and fasion/video.mp4' },
  { slug: 'leather-products', title: 'Leather Products', route: '/products/leather-products', defaultImage: '/leather products/image.jpg', defaultVideo: '/leather products/video.mp4' },
  { slug: 'medical-wear', title: 'Medical Wear', route: '/products/medical-wear', defaultImage: '/medical/image.jpg', defaultVideo: '/medical/video.mp4' },
  { slug: 'premium-blanks', title: 'Premium Blanks', route: '/products/premium-blanks', defaultImage: '/blanks/image.jpg', defaultVideo: '/blanks/video.mp4' },
  { slug: 'industrial-supplies', title: 'Industrial Supplies', route: '/products/industrial-supplies', defaultImage: '/industrial supplies/image.jpg', defaultVideo: '/industrial supplies/video.mp4' }
];

const ABOUT_FACTORY_SLOTS = [
  { id: 'pattern', title: '01 · CAD Pattern Grading', defaultImage: '/media/about/01-pattern-grading.jpg' },
  { id: 'cutting', title: '02 · Precision Fabric Cutting', defaultImage: '/media/about/02-fabric-cutting.jpg' },
  { id: 'stitching', title: '03 · Master Cut-and-Sew', defaultImage: '/media/about/03-stitching.jpg' },
  { id: 'embroidery', title: '04 · 3D Puff & Screen Print', defaultImage: '/media/about/04-embroidery.jpg' },
  { id: 'inspection', title: '05 · 4-Stage Quality Control', defaultImage: '/media/about/05-quality-inspection.jpg' },
  { id: 'packaging', title: '06 · Custom Trims & Packaging', defaultImage: '/media/about/06-packaging.jpg' }
];

const CUSTOMIZATION_STAGES = [
  { id: 'embroidery', number: '01', title: 'Precision Tactile Embroidery', defaultImage: '/media/home/customization/01-embroidery.jpg' },
  { id: 'rhinestones', number: '02', title: 'Glass Crystal & Hardware', defaultImage: '/media/home/customization/04-rhinestones.jpg' },
  { id: 'screen-printing', number: '03', title: 'Industrial Screen Printing', defaultImage: '/media/homepage/factory-preview-printing.jpg' },
  { id: 'dtf-printing', number: '04', title: 'High-Definition Direct-To-Film', defaultImage: '/media/home/customization/02-dtf-printing.jpg' },
  { id: 'dtg-printing', number: '05', title: 'Soft-Hand Direct-To-Garment', defaultImage: '/media/home/customization/03-dtg-printing.jpg' },
  { id: 'custom-labels', number: '06', title: 'Woven Damask & Satin Labels', defaultImage: '/media/products/side-products/custom-labels.jpg' },
  { id: 'custom-tags', number: '07', title: 'Bespoke Debossed Hangtags', defaultImage: '/media/products/side-products/custom-tags.jpg' },
  { id: 'washes-finishing', number: '08', title: 'Vintage Washes & Hand Distressing', defaultImage: '/media/manufacturing/06-customization-branding.jpg' },
  { id: 'packaging', number: '09', title: 'Retail-Ready Luxury Packaging', defaultImage: '/media/home/customization/06-packaging.jpg' }
];

const DETAILS_MATTER_SECTOR_ITEMS = [
  { id: 'chains', name: 'Chains', tagline: 'Industrial & Cuban Links', defaultImage: '/media/the-details-matter/chains.jpg' },
  { id: 'buckles', name: 'Buckles', tagline: 'Tactical & Magnetic Cast', defaultImage: '/media/the-details-matter/buckles.jpg' },
  { id: 'zippers', name: 'Zippers', tagline: 'Precision YKK Systems', defaultImage: '/media/the-details-matter/zippers.jpg' },
  { id: 'rhinestones', name: 'Rhinestones', tagline: 'Precision Glass Crystal', defaultImage: '/media/the-details-matter/rhinestones.jpg' },
  { id: 'patches', name: 'Patches', tagline: 'Chenille & 3D Embroidery', defaultImage: '/media/the-details-matter/patches.jpg' },
  { id: 'labels', name: 'Labels', tagline: 'High-Density Woven Damask', defaultImage: '/media/the-details-matter/labels.jpg' }
];

export default function ContentManagerPage() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data.siteContent || {});
      }
    } catch (err) {
      console.error('[Content Manager Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (page, section, field, value) => {
    setContent(prev => ({
      ...prev,
      [page]: {
        ...(prev[page] || {}),
        [section]: {
          ...(prev[page]?.[section] || {}),
          [field]: value
        },
        [field]: value
      }
    }));
  };

  const handleMediaObjectChange = (page, section, mediaObj) => {
    setContent(prev => {
      const existingSection = prev[page]?.[section] || {};
      return {
        ...prev,
        [page]: {
          ...(prev[page] || {}),
          [section]: {
            ...existingSection,
            image: mediaObj.image,
            video: mediaObj.video,
            mode: mediaObj.mode,
            mobileMode: mediaObj.mobileMode,
            poster: mediaObj.poster,
            alt: mediaObj.alt
          }
        }
      };
    });
  };

  const handleCategoryMediaChange = (catSlug, mediaObj) => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...(prev.homepage || {}),
        categories: {
          ...(prev.homepage?.categories || {}),
          [catSlug]: {
            ...(prev.homepage?.categories?.[catSlug] || {}),
            image: mediaObj.image,
            video: mediaObj.video,
            mode: mediaObj.mode || 'hover_video',
            mobileMode: mediaObj.mobileMode || 'image_only',
            poster: mediaObj.poster,
            alt: mediaObj.alt
          }
        }
      }
    }));
  };

  const handleCustomizationMediaChange = (stageId, mediaObj) => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...(prev.homepage || {}),
        customization: {
          ...(prev.homepage?.customization || {}),
          [stageId]: {
            ...(prev.homepage?.customization?.[stageId] || {}),
            image: mediaObj.image,
            video: mediaObj.video,
            mode: mediaObj.mode || 'image_only',
            mobileMode: mediaObj.mobileMode || 'image_only',
            poster: mediaObj.poster,
            alt: mediaObj.alt
          }
        }
      }
    }));
  };

  const handleDetailsMatterMediaChange = (itemId, mediaObj) => {
    setContent(prev => ({
      ...prev,
      homepage: {
        ...(prev.homepage || {}),
        detailsMatter: {
          ...(prev.homepage?.detailsMatter || {}),
          [itemId]: {
            ...(prev.homepage?.detailsMatter?.[itemId] || {}),
            image: mediaObj.image,
            video: mediaObj.video,
            mode: mediaObj.mode || 'image_only',
            mobileMode: mediaObj.mobileMode || 'image_only',
            poster: mediaObj.poster,
            alt: mediaObj.alt
          }
        }
      }
    }));
  };

  const handleSavePage = async (page) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/content/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(content[page] || {})
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update content.');

      setSaveStatus({ type: 'success', text: `Saved! ${page.toUpperCase()} is updated on the public site.` });
      broadcastCmsUpdate();
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      setSaveStatus({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'blanks', label: 'Blanks' },
    { id: 'contact', label: 'Contact & RFQ' }
  ];

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading site content...</div>;
  }

  const home = content.homepage || {};
  const hero = home.hero || {};
  const cta = home.finalCta || {};

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Universal Website Media & Content Manager</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Control images, videos, hover animations, and text copy across all public sections without touching code.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSavePage(activeTab)}
          disabled={saving}
          className="adm-btn adm-btn-primary"
        >
          {saving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
          <span>Save Changes to Public Site</span>
        </button>
      </div>

      {saveStatus && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 4,
          marginBottom: 20,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: saveStatus.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: saveStatus.type === 'error' ? '#fca5a5' : '#6ee7b7',
          border: `1px solid ${saveStatus.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {saveStatus.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{saveStatus.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="adm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`adm-tab ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. HOMEPAGE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'homepage' && (
        <div>
          {/* Hero Copy & Typography */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; Hero Section Copy</h2>
                <p className="adm-card-desc">The primary banner text above the fold on the homepage.</p>
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Hero Eyebrow Tagline</label>
              <input
                type="text"
                value={hero.eyebrow || ''}
                onChange={(e) => handleFieldChange('homepage', 'hero', 'eyebrow', e.target.value)}
                className="adm-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="adm-form-group">
                <label className="adm-label">Headline Line 1</label>
                <input
                  type="text"
                  value={hero.title1 || ''}
                  onChange={(e) => handleFieldChange('homepage', 'hero', 'title1', e.target.value)}
                  className="adm-input"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Headline Line 2</label>
                <input
                  type="text"
                  value={hero.title2 || ''}
                  onChange={(e) => handleFieldChange('homepage', 'hero', 'title2', e.target.value)}
                  className="adm-input"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Headline Line 3 (Accent)</label>
                <input
                  type="text"
                  value={hero.title3 || ''}
                  onChange={(e) => handleFieldChange('homepage', 'hero', 'title3', e.target.value)}
                  className="adm-input"
                />
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Lead Subtitle / Description</label>
              <textarea
                value={hero.lead || ''}
                onChange={(e) => handleFieldChange('homepage', 'hero', 'lead', e.target.value)}
                className="adm-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Hero Universal Media Control */}
          {/* Hero Universal Media Control */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; Hero Visual Media (VIDEO ONLY)</h2>
                <p className="adm-card-desc">
                  Configure the primary hero video. Per GTT brand identity, Hero strictly plays video with zero image preview or poster flash.
                </p>
              </div>
            </div>

            <UniversalMediaControl
              label="Homepage Hero Video"
              description="VIDEO ONLY &middot; HD ambient manufacturing loop without image fallback."
              media={{
                image: '',
                video: hero.video || '/media/home/hero/hero-video.mp4',
                mode: 'video_only',
                mobileMode: 'same_as_desktop',
                poster: '',
                alt: hero.alt || 'Global Thunder Trade Apparel Manufacturing Facility'
              }}
              allowPoster={false}
              showPresets={false}
              onChange={(updatedMedia) => handleMediaObjectChange('homepage', 'hero', {
                ...updatedMedia,
                mode: 'video_only',
                mobileMode: 'same_as_desktop',
                image: '',
                poster: ''
              })}
              sectionKey="homepage"
              slotKey="hero"
            />
          </div>

          {/* Category Cards Section */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; Manufacturing Categories (Category Cards)</h2>
                <p className="adm-card-desc">
                  Manage Image + Video for each of the 5 manufacturing division cards. Initial state displays the category image; activating the arrow control plays the corresponding category video.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {CATEGORY_SECTORS.map((cat, idx) => {
                const catData = home.categories?.[cat.slug] || {};
                const catMedia = {
                  image: catData.image || cat.defaultImage,
                  video: catData.video || cat.defaultVideo,
                  mode: catData.mode || 'interaction_video',
                  mobileMode: catData.mobileMode || 'interaction_video',
                  poster: catData.poster || catData.image || cat.defaultImage,
                  alt: catData.alt || `${cat.title} Manufacturing`
                };

                return (
                  <div key={cat.slug} style={{
                    background: '#0d0f12',
                    border: '1px solid #262c36',
                    borderRadius: 6,
                    padding: 18
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#8b949e', textTransform: 'uppercase' }}>
                          0{idx + 1} &mdash; CATEGORY DIVISION
                        </span>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 2, textTransform: 'uppercase' }}>
                          {cat.title}
                        </h3>
                        <span style={{ fontSize: 12, color: '#8b949e' }}>
                          Route: <code style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 3 }}>{cat.route}</code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSavePage('homepage')}
                        disabled={saving}
                        className="adm-btn adm-btn-secondary"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        <Save size={13} />
                        <span>Save Category</span>
                      </button>
                    </div>

                    <UniversalMediaControl
                      label={`${cat.title} Visual Media`}
                      description={`Image default &middot; Plays corresponding video from ${cat.title} folder on interaction.`}
                      media={catMedia}
                      onChange={(updatedMedia) => handleCategoryMediaChange(cat.slug, updatedMedia)}
                      sectionKey="homepage"
                      slotKey={`categories.${cat.slug}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customization Stages Section (YOUR PRODUCT. YOUR RULES.) */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; Customization Stages (YOUR PRODUCT. YOUR RULES.)</h2>
                <p className="adm-card-desc">
                  Manage photography and video for each of the 9 bespoke manufacturing stages featured in the interactive scroll story.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {CUSTOMIZATION_STAGES.map((stg) => {
                const stgData = home.customization?.[stg.id] || {};
                const stgMedia = {
                  image: stgData.image || stg.defaultImage,
                  video: stgData.video || '',
                  mode: stgData.mode || 'image_only',
                  mobileMode: stgData.mobileMode || 'image_only',
                  poster: stgData.poster || stgData.image || stg.defaultImage,
                  alt: stgData.alt || `${stg.title} Customization Stage`
                };

                return (
                  <div key={stg.id} style={{
                    background: '#0d0f12',
                    border: '1px solid #262c36',
                    borderRadius: 6,
                    padding: 18
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#8b949e', textTransform: 'uppercase' }}>
                          STAGE {stg.number} &mdash; TECHNIQUE
                        </span>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 2, textTransform: 'uppercase' }}>
                          {stg.title}
                        </h3>
                        <span style={{ fontSize: 12, color: '#8b949e' }}>
                          Key: <code style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 3 }}>homepage.customization.{stg.id}</code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSavePage('homepage')}
                        disabled={saving}
                        className="adm-btn adm-btn-secondary"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        <Save size={13} />
                        <span>Save Stage</span>
                      </button>
                    </div>

                    <UniversalMediaControl
                      label={`${stg.title} Media`}
                      description={`Image or video asset for stage ${stg.number}.`}
                      media={stgMedia}
                      onChange={(updatedMedia) => handleCustomizationMediaChange(stg.id, updatedMedia)}
                      sectionKey="homepage"
                      slotKey={`customization.${stg.id}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* The Details Matter Section (Side Products & Trims) */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; The Details Matter (Side Products &amp; Trims)</h2>
                <p className="adm-card-desc">
                  Manage individual imagery and media behavior for all 6 signature trim elements (Chains, Buckles, Zippers, Rhinestones, Patches, Labels).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {DETAILS_MATTER_SECTOR_ITEMS.map((item, idx) => {
                const itemData = home.detailsMatter?.[item.id] || {};
                const itemMedia = {
                  image: itemData.image || item.defaultImage,
                  video: itemData.video || '',
                  mode: itemData.mode || 'image_only',
                  mobileMode: itemData.mobileMode || 'image_only',
                  poster: itemData.poster || itemData.image || item.defaultImage,
                  alt: itemData.alt || `${item.name} - ${item.tagline}`
                };

                return (
                  <div key={item.id} style={{
                    background: '#0d0f12',
                    border: '1px solid #262c36',
                    borderRadius: 6,
                    padding: 18
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#8b949e', textTransform: 'uppercase' }}>
                          0{idx + 1} &mdash; SIGNATURE TRIM
                        </span>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 2, textTransform: 'uppercase' }}>
                          {item.name}
                        </h3>
                        <span style={{ fontSize: 12, color: '#8b949e' }}>
                          {item.tagline} &middot; <code style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 3 }}>homepage.detailsMatter.{item.id}</code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSavePage('homepage')}
                        disabled={saving}
                        className="adm-btn adm-btn-secondary"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        <Save size={13} />
                        <span>Save Trim</span>
                      </button>
                    </div>

                    <UniversalMediaControl
                      label={`${item.name} Trim Media`}
                      description={`Image or video asset for ${item.name} (${item.tagline}).`}
                      media={itemMedia}
                      onChange={(updatedMedia) => handleDetailsMatterMediaChange(item.id, updatedMedia)}
                      sectionKey="homepage"
                      slotKey={`detailsMatter.${item.id}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Homepage &middot; Final Bottom Call To Action</h2>
                <p className="adm-card-desc">The high-impact conversion section before the footer.</p>
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-label">CTA Headline</label>
              <input
                type="text"
                value={cta.heading || ''}
                onChange={(e) => handleFieldChange('homepage', 'finalCta', 'heading', e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">CTA Description</label>
              <textarea
                value={cta.description || ''}
                onChange={(e) => handleFieldChange('homepage', 'finalCta', 'description', e.target.value)}
                className="adm-textarea"
                rows={2}
              />
            </div>

            <UniversalMediaControl
              label="Final CTA Visual Media"
              description="Configure high-impact background photography or video loop for the conversion banner."
              media={{
                image: cta.image || '/media/homepage/homepage-cta.jpg',
                video: cta.video || '',
                mode: cta.mode || 'image_only',
                mobileMode: cta.mobileMode || 'image_only',
                poster: cta.poster || cta.image || '/media/homepage/homepage-cta.jpg',
                alt: cta.alt || 'Ready to build your next drop'
              }}
              onChange={(updatedMedia) => handleMediaObjectChange('homepage', 'finalCta', updatedMedia)}
              sectionKey="homepage"
              slotKey="finalCta"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SERVICES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Services Page &middot; Header &amp; Visuals</h2>
              <p className="adm-card-desc">Header copy and production showcase media for the commercial services overview.</p>
            </div>
            <button
              type="button"
              onClick={() => handleSavePage('services')}
              disabled={saving}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              <Save size={13} />
              <span>Save Services</span>
            </button>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Services Heading</label>
            <input
              type="text"
              value={content.services?.hero?.heading || 'FROM CONCEPT TO RETAIL-READY COLLECTIONS.'}
              onChange={(e) => handleFieldChange('services', 'hero', 'heading', e.target.value)}
              className="adm-input"
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Services Subheading</label>
            <textarea
              value={content.services?.hero?.subheading || 'Full-package product development, cut-and-sew manufacturing, custom trims, editorial lookbooks, and conversion-engineered e-commerce.'}
              onChange={(e) => handleFieldChange('services', 'hero', 'subheading', e.target.value)}
              className="adm-textarea"
            />
          </div>

          <UniversalMediaControl
            label="Manufacturing Pillar Visual Media"
            description="Visual media representing GTT cut-and-sew manufacturing and sampling."
            media={{
              image: content.services?.manufacturingImage?.image || content.services?.manufacturingImage || '/media/services/01-manufacturing.jpg',
              video: content.services?.manufacturingImage?.video || '',
              mode: content.services?.manufacturingImage?.mode || 'image_only',
              mobileMode: content.services?.manufacturingImage?.mobileMode || 'image_only'
            }}
            onChange={(updatedMedia) => {
              setContent(prev => ({
                ...prev,
                services: {
                  ...(prev.services || {}),
                  manufacturingImage: updatedMedia
                }
              }));
            }}
            sectionKey="services"
            slotKey="manufacturingImage"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ABOUT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <div>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">About Page &middot; Company Story</h2>
                <p className="adm-card-desc">Text and imagery representing GTT's global manufacturing presence.</p>
              </div>
              <button
                type="button"
                onClick={() => handleSavePage('about')}
                disabled={saving}
                className="adm-btn adm-btn-secondary"
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                <Save size={13} />
                <span>Save About Us</span>
              </button>
            </div>

            <div className="adm-form-group">
              <label className="adm-label">About Headline</label>
              <input
                type="text"
                value={content.about?.hero?.heading || "ENGINEERING APPAREL FOR THE WORLD'S MOST AMBITIOUS BRANDS."}
                onChange={(e) => handleFieldChange('about', 'hero', 'heading', e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">About Subheading</label>
              <textarea
                value={content.about?.hero?.subheading || "Headquartered in Pakistan with global brand partners across the US, UK, Europe, Australia, and the Middle East."}
                onChange={(e) => handleFieldChange('about', 'hero', 'subheading', e.target.value)}
                className="adm-textarea"
              />
            </div>

            <UniversalMediaControl
              label="Development & Pattern Studio Visual"
              description="Showcase photography or video of GTT's design studio and master patternmakers."
              media={{
                image: content.about?.storyImage?.image || content.about?.storyImage || '/media/about/about-studio.jpg',
                video: content.about?.storyImage?.video || '',
                mode: content.about?.storyImage?.mode || 'image_only',
                mobileMode: content.about?.storyImage?.mobileMode || 'image_only'
              }}
              onChange={(updatedMedia) => {
                setContent(prev => ({
                  ...prev,
                  about: {
                    ...(prev.about || {}),
                    storyImage: updatedMedia
                  }
                }));
              }}
              sectionKey="about"
              slotKey="storyImage"
            />
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">About Page &middot; Factory Infrastructure Visuals</h2>
                <p className="adm-card-desc">Main factory floor visual and 6 specialized manufacturing departments.</p>
              </div>
              <button
                type="button"
                onClick={() => handleSavePage('about')}
                disabled={saving}
                className="adm-btn adm-btn-secondary"
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                <Save size={13} />
                <span>Save Factory Media</span>
              </button>
            </div>

            <UniversalMediaControl
              label="Main Factory Floor Visual"
              description="High-resolution visual of the main production floor."
              media={{
                image: content.about?.factoryFloor?.image || content.about?.factoryFloor || '/media/about/about-factory-floor.jpg',
                video: content.about?.factoryFloor?.video || '',
                mode: content.about?.factoryFloor?.mode || 'image_only',
                mobileMode: content.about?.factoryFloor?.mobileMode || 'image_only'
              }}
              onChange={(updatedMedia) => {
                setContent(prev => ({
                  ...prev,
                  about: {
                    ...(prev.about || {}),
                    factoryFloor: updatedMedia
                  }
                }));
              }}
              sectionKey="about"
              slotKey="factoryFloor"
            />

            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>6 Specialized Production Departments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ABOUT_FACTORY_SLOTS.map(slot => {
                  const currentSlotMedia = content.about?.factorySlots?.[slot.id] || {};
                  return (
                    <UniversalMediaControl
                      key={slot.id}
                      label={slot.title}
                      media={{
                        image: currentSlotMedia.image || slot.defaultImage,
                        video: currentSlotMedia.video || '',
                        mode: currentSlotMedia.mode || 'image_only',
                        mobileMode: currentSlotMedia.mobileMode || 'image_only'
                      }}
                      onChange={(updatedMedia) => {
                        setContent(prev => ({
                          ...prev,
                          about: {
                            ...(prev.about || {}),
                            factorySlots: {
                              ...(prev.about?.factorySlots || {}),
                              [slot.id]: updatedMedia
                            }
                          }
                        }));
                      }}
                      sectionKey="about"
                      slotKey={`factorySlots.${slot.id}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BLANKS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'blanks' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Premium Blanks &middot; Showcase Visuals</h2>
              <p className="adm-card-desc">Curated wholesale blank apparel imagery and video demonstrations.</p>
            </div>
            <button
              type="button"
              onClick={() => handleSavePage('blanks')}
              disabled={saving}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              <Save size={13} />
              <span>Save Blanks</span>
            </button>
          </div>

          <UniversalMediaControl
            label="Blank Heavyweight Hoodie Media"
            description="Hero showcase media for 450-500 GSM fleece blank hoodies."
            media={{
              image: content.blanks?.blankHoodieImage?.image || content.blanks?.blankHoodieImage || '/media/home/blanks/blank-hoodie.jpg',
              video: content.blanks?.blankHoodieImage?.video || '',
              mode: content.blanks?.blankHoodieImage?.mode || 'hover_video',
              mobileMode: content.blanks?.blankHoodieImage?.mobileMode || 'image_only'
            }}
            onChange={(updatedMedia) => {
              setContent(prev => ({
                ...prev,
                blanks: {
                  ...(prev.blanks || {}),
                  blankHoodieImage: updatedMedia
                }
              }));
            }}
            sectionKey="blanks"
            slotKey="blankHoodieImage"
          />

          <UniversalMediaControl
            label="Blank Vintage Boxy Tee Media"
            description="Hero showcase media for 260-280 GSM single jersey blank t-shirts."
            media={{
              image: content.blanks?.blankTeeImage?.image || content.blanks?.blankTeeImage || '/media/home/blanks/blank-tee.jpg',
              video: content.blanks?.blankTeeImage?.video || '',
              mode: content.blanks?.blankTeeImage?.mode || 'hover_video',
              mobileMode: content.blanks?.blankTeeImage?.mobileMode || 'image_only'
            }}
            onChange={(updatedMedia) => {
              setContent(prev => ({
                ...prev,
                blanks: {
                  ...(prev.blanks || {}),
                  blankTeeImage: updatedMedia
                }
              }));
            }}
            sectionKey="blanks"
            slotKey="blankTeeImage"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONTACT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'contact' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Contact &amp; RFQ Page Copy</h2>
              <p className="adm-card-desc">Direct line instructions for fashion labels and brand founders.</p>
            </div>
            <button
              type="button"
              onClick={() => handleSavePage('contact')}
              disabled={saving}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              <Save size={13} />
              <span>Save Contact</span>
            </button>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Contact Eyebrow</label>
            <input
              type="text"
              value={content.contact?.hero?.eyebrow || content.contact?.eyebrow || 'START PRODUCTION · FACTORY DIRECT'}
              onChange={(e) => handleFieldChange('contact', 'hero', 'eyebrow', e.target.value)}
              className="adm-input"
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Contact Headline</label>
            <input
              type="text"
              value={content.contact?.hero?.heading || content.contact?.heading || 'SEND YOUR MOCKUP & REQUEST QUOTE.'}
              onChange={(e) => handleFieldChange('contact', 'hero', 'heading', e.target.value)}
              className="adm-input"
            />
          </div>
        </div>
      )}

      {/* Floating Bottom Sticky Action Bar */}
      <div style={{
        position: 'sticky',
        bottom: 20,
        zIndex: 40,
        marginTop: 32,
        background: '#15181c',
        border: '1px solid #303642',
        borderRadius: 8,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8b949e' }}>
            Active Section: <strong style={{ color: '#fff' }}>{activeTab.toUpperCase()}</strong>
          </span>
          {saveStatus && (
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: saveStatus.type === 'error' ? '#fca5a5' : '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              {saveStatus.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
              {saveStatus.text}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSavePage(activeTab)}
          disabled={saving}
          className="adm-btn adm-btn-primary"
          style={{ padding: '8px 20px', fontSize: 13 }}
        >
          {saving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
          <span>{saving ? 'Persisting to Database...' : `Save ${activeTab.toUpperCase()} to Public Site`}</span>
        </button>
      </div>
    </div>
  );
}

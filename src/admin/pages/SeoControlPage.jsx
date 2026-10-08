import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Save,
  Check,
  AlertCircle,
  FileCode,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

export default function SeoControlPage() {
  const [seo, setSeo] = useState(null);
  const [sitemapStats, setSitemapStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const [selectedPage, setSelectedPage] = useState('home');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/seo');
      const data = await res.json();
      if (data.success) {
        setSeo(data.seo || {});
        if (data.sitemapStats) {
          setSitemapStats(data.sitemapStats);
        }
      }
    } catch (err) {
      console.error('[SEO Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSeo = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seo)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update SEO.');

      setMessage({ type: 'success', text: 'SEO settings and XML sitemap updated successfully!' });
      broadcastCmsUpdate();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateSitemap = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/seo/regenerate-sitemap', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Synchronized ${data.totalUrls} live URLs to sitemap.xml & robots.txt!` });
        fetchSeo();
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalChange = (field, value) => {
    setSeo(prev => ({
      ...prev,
      global: { ...(prev.global || {}), [field]: value }
    }));
  };

  const handlePageChange = (page, field, value) => {
    setSeo(prev => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        [page]: { ...(prev.pages?.[page] || {}), [field]: value }
      }
    }));
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading SEO settings...</div>;
  }

  const global = seo.global || {};
  const pages = seo.pages || {};
  const curPage = pages[selectedPage] || {};

  const pageList = [
    { id: 'home', name: 'Homepage (/)' },
    { id: 'services', name: 'Services (/services)' },
    { id: 'products', name: 'Products Index (/products)' },
    { id: 'blanks', name: 'Premium Blanks (/blanks)' },
    { id: 'costCalculator', name: 'Cost Calculator (/cost-calculator)' },
    { id: 'about', name: 'About (/about)' },
    { id: 'contact', name: 'Contact (/contact)' },
    { id: 'blog', name: 'The GTT Journal (/blog)' },
    { id: 'beASupplier', name: 'Be A Supplier (/be-a-supplier)' },
    { id: 'reviews', name: 'Reviews (/reviews)' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>SEO, AEO &amp; Structured Data Control Center</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Control global entity metadata, per-page Open Graph tags, canonical URLs, and dynamic sitemap indexing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={handleRegenerateSitemap}
            disabled={saving}
            className="adm-btn adm-btn-secondary"
          >
            <RefreshCw size={14} className={saving ? 'spin' : ''} />
            <span>Regenerate Sitemap.xml</span>
          </button>
          <button
            type="button"
            onClick={handleSaveSeo}
            disabled={saving}
            className="adm-btn adm-btn-primary"
          >
            <Save size={14} /> <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 4,
          marginBottom: 20,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
          border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {message.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="adm-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`adm-tab ${activeTab === 'global' ? 'active' : ''}`}
        >
          Global Organization Entity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`adm-tab ${activeTab === 'pages' ? 'active' : ''}`}
        >
          Page-Level Metadata ({pageList.length} Core Pages)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sitemap')}
          className={`adm-tab ${activeTab === 'sitemap' ? 'active' : ''}`}
        >
          Sitemap &amp; Robots Inspection
        </button>
      </div>

      {/* GLOBAL TAB */}
      {activeTab === 'global' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Global Schema &middot; Organization Entity</h2>
              <p className="adm-card-desc">Grounds Google's Knowledge Graph with authentic GTT company identifiers.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            <div className="adm-form-group">
              <label className="adm-label">Organization Name</label>
              <input
                type="text"
                value={global.organizationName || 'Global Thunder Trade'}
                onChange={(e) => handleGlobalChange('organizationName', e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Canonical Domain URL</label>
              <input
                type="text"
                value={global.canonicalDomain || 'https://globalthundertrade.com'}
                onChange={(e) => handleGlobalChange('canonicalDomain', e.target.value)}
                className="adm-input"
                style={{ fontFamily: 'var(--adm-mono)' }}
              />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Default Global Meta Title Template</label>
            <input
              type="text"
              value={global.siteTitle || ''}
              onChange={(e) => handleGlobalChange('siteTitle', e.target.value)}
              className="adm-input"
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Default Global Meta Description</label>
            <textarea
              rows={3}
              value={global.siteDescription || ''}
              onChange={(e) => handleGlobalChange('siteDescription', e.target.value)}
              className="adm-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="adm-form-group">
              <label className="adm-label">Default OG Image URL (Social Cards)</label>
              <input
                type="text"
                value={global.defaultOgImage || ''}
                onChange={(e) => handleGlobalChange('defaultOgImage', e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Official Contact Email (Schema)</label>
              <input
                type="email"
                value={global.contactEmail || 'globalthundertrade@gmail.com'}
                onChange={(e) => handleGlobalChange('contactEmail', e.target.value)}
                className="adm-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* PAGE LEVEL TAB */}
      {activeTab === 'pages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
          {/* Page Selector */}
          <div className="adm-card" style={{ padding: 12 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--adm-text-muted)', padding: '8px 12px', textTransform: 'uppercase' }}>
              Select Page
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pageList.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPage(p.id)}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: 4,
                    border: 'none',
                    background: selectedPage === p.id ? 'var(--adm-surface-alt)' : 'transparent',
                    color: selectedPage === p.id ? 'var(--adm-primary)' : 'var(--adm-text)',
                    fontWeight: selectedPage === p.id ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: 12.5
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Page Editor */}
          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">{pageList.find(p => p.id === selectedPage)?.name} &middot; Metadata</h2>
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Page SEO Title Tag (&lt;title&gt;)</label>
              <input
                type="text"
                value={curPage.title || ''}
                onChange={(e) => handlePageChange(selectedPage, 'title', e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Meta Description Tag (&lt;meta name="description"&gt;)</label>
              <textarea
                rows={3}
                value={curPage.description || ''}
                onChange={(e) => handlePageChange(selectedPage, 'description', e.target.value)}
                className="adm-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
              <div className="adm-form-group">
                <label className="adm-label">Canonical URL</label>
                <input
                  type="text"
                  value={curPage.canonical || ''}
                  onChange={(e) => handlePageChange(selectedPage, 'canonical', e.target.value)}
                  className="adm-input"
                  style={{ fontFamily: 'var(--adm-mono)', fontSize: 12 }}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Page OG Image</label>
                <input
                  type="text"
                  value={curPage.ogImage || ''}
                  onChange={(e) => handlePageChange(selectedPage, 'ogImage', e.target.value)}
                  className="adm-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <input
                type="checkbox"
                id="idxCheck"
                checked={curPage.index !== false}
                onChange={(e) => handlePageChange(selectedPage, 'index', e.target.checked)}
              />
              <label htmlFor="idxCheck" style={{ fontSize: 13, cursor: 'pointer' }}>
                Allow Search Engines to Index This Page (index / follow)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SITEMAP TAB */}
      {activeTab === 'sitemap' && (
        <div className="adm-card">
          <div className="adm-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="adm-card-title">Dynamic XML Sitemap &amp; Robots Status</h2>
              <p className="adm-card-desc">100% automated &middot; Served live at /sitemap.xml and /robots.txt &middot; Auto-regenerated on all CMS updates.</p>
            </div>
            <button
              onClick={handleRegenerateSitemap}
              disabled={saving}
              className="adm-btn adm-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} className={saving ? 'spin' : ''} />
              <span>Sync Files Now</span>
            </button>
          </div>

          {/* Dynamic Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            marginBottom: 24,
            padding: 16,
            background: 'var(--adm-bg)',
            border: '1px solid var(--adm-border)',
            borderRadius: 6
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total URLs</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--adm-primary)', marginTop: 2 }}>
                {sitemapStats?.total || '100+'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Core Storefront</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.core ?? 11}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Categories</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.categories ?? 7}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Products</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.products ?? 26}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Blanks</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.blanks ?? 25}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Side Products</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.sideProducts ?? 15}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Blog Articles</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--adm-text)', marginTop: 2 }}>
                {sitemapStats?.blogs ?? 15}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>ROBOTS.TXT PREVIEW</span>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--adm-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Open Live File</span> <ExternalLink size={11} />
                </a>
              </div>
              <pre style={{
                background: 'var(--adm-bg)',
                padding: 16,
                borderRadius: 4,
                border: '1px solid var(--adm-border)',
                fontFamily: 'var(--adm-mono)',
                fontSize: 12,
                color: '#34d399'
              }}>
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin
Disallow: /api/

Sitemap: ${global.canonicalDomain || 'https://globalthundertrade.com'}/sitemap.xml`}
              </pre>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>DYNAMIC SITEMAP STATUS</span>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--adm-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Open Live XML</span> <ExternalLink size={11} />
                </a>
              </div>
              <div style={{
                background: 'var(--adm-bg)',
                padding: 16,
                borderRadius: 4,
                border: '1px solid var(--adm-border)',
                fontSize: 12.5,
                lineHeight: 1.7
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontWeight: 600 }}>
                  <Check size={16} /> Fully Automated Dynamic Engine
                </div>
                <div style={{ color: 'var(--adm-text)', marginTop: 8, fontSize: 12 }}>
                  <strong>No manual additions needed.</strong> Whenever you create, modify, publish, or delete:
                </div>
                <ul style={{ color: 'var(--adm-text-muted)', fontSize: 11.5, marginTop: 6, paddingLeft: 18, lineHeight: 1.6 }}>
                  <li>Products &amp; custom variants</li>
                  <li>Premium blanks &amp; catalogue items</li>
                  <li>Side products, hardware &amp; branding items</li>
                  <li>Journal &amp; SEO blog posts</li>
                  <li>Category routes &amp; canonical domains</li>
                </ul>
                <div style={{ marginTop: 10, fontSize: 11, color: '#34d399' }}>
                  ✓ Served live on /sitemap.xml and synchronized to public/sitemap.xml
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

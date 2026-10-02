import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  BookOpen,
  Image as ImageIcon,
  Inbox,
  Calculator,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    blogsCount: 0,
    mediaCount: 0,
    inquiriesCount: 0,
    unreadInquiries: 0,
    recentInquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('gtt_admin_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [healthRes, inqRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/cms/inquiries', { headers })
        ]);

        const health = await healthRes.json();
        const inqData = inqRes.ok ? await inqRes.json() : { inquiries: [] };

        setStats({
          productsCount: health.productsCount || 0,
          blogsCount: health.blogsCount || 0,
          mediaCount: health.mediaCount || 0,
          inquiriesCount: inqData.total || 0,
          unreadInquiries: inqData.unreadCount || 0,
          recentInquiries: (inqData.inquiries || []).slice(0, 5)
        });
      } catch (err) {
        console.error('[Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      {/* Metric Cards Row */}
      <div className="adm-metric-grid">
        <div className="adm-metric-card">
          <div className="adm-metric-header">
            <span>Catalog Products</span>
            <ShoppingBag size={16} />
          </div>
          <div className="adm-metric-val">{stats.productsCount}</div>
          <div className="adm-metric-sub">Across 6 commercial divisions</div>
        </div>

        <div className="adm-metric-card">
          <div className="adm-metric-header">
            <span>The GTT Journal</span>
            <BookOpen size={16} />
          </div>
          <div className="adm-metric-val">{stats.blogsCount}</div>
          <div className="adm-metric-sub">Technical guides &amp; SEO articles</div>
        </div>

        <div className="adm-metric-card">
          <div className="adm-metric-header">
            <span>Media Library</span>
            <ImageIcon size={16} />
          </div>
          <div className="adm-metric-val">{stats.mediaCount}</div>
          <div className="adm-metric-sub">Curated commercial assets</div>
        </div>

        <div className="adm-metric-card" style={{ borderColor: stats.unreadInquiries > 0 ? 'var(--adm-warning)' : 'var(--adm-border)' }}>
          <div className="adm-metric-header">
            <span>Customer Inquiries</span>
            <Inbox size={16} style={{ color: stats.unreadInquiries > 0 ? 'var(--adm-warning)' : 'inherit' }} />
          </div>
          <div className="adm-metric-val" style={{ color: stats.unreadInquiries > 0 ? '#fbbf24' : 'inherit' }}>
            {stats.inquiriesCount}
          </div>
          <div className="adm-metric-sub">
            {stats.unreadInquiries > 0 ? `${stats.unreadInquiries} pending review` : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Quick Action Control Hub */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2 className="adm-card-title">CMS Command Center &middot; Quick Access</h2>
            <p className="adm-card-desc">Manage every aspect of the Global Thunder Trade public website without touching code.</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16
        }}>
          <Link to="/admin/content" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <Layers size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>Website Content</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Edit Hero, sections &amp; replace images</div>
            </div>
          </Link>

          <Link to="/admin/products" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <ShoppingBag size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>Products &amp; Variants</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Add garments, colors &amp; Google ProductGroup</div>
            </div>
          </Link>

          <Link to="/admin/calculator" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <Calculator size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>Cost Calculator</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Edit base costs, GSM &amp; quantity tiers</div>
            </div>
          </Link>

          <Link to="/admin/blogs" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <BookOpen size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>Blog CMS</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Publish articles with Rich Text &amp; FAQs</div>
            </div>
          </Link>

          <Link to="/admin/media" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <ImageIcon size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>Media Library</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Drag &amp; drop uploads, replace &amp; optimize</div>
            </div>
          </Link>

          <Link to="/admin/seo" className="adm-nav-item" style={{ border: '1px solid var(--adm-border)', padding: 16 }}>
            <Search size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>SEO Control Center</div>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 2 }}>Dynamic sitemaps, robots &amp; schema tags</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Inbox Preview */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2 className="adm-card-title">Recent Submissions &amp; Quote Requests</h2>
            <p className="adm-card-desc">Leads originating from Contact Form, Cost Calculator, and Supplier Intake.</p>
          </div>
          <Link to="/admin/inquiries" className="adm-btn adm-btn-secondary adm-btn-sm">
            <span>View All Inquiries</span> <ArrowRight size={13} />
          </Link>
        </div>

        {stats.recentInquiries.length > 0 ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Contact Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Product / Detail</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>
                      <span className={`adm-badge ${inq.status === 'unread' ? 'adm-badge-warning' : 'adm-badge-muted'}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{inq.name}</td>
                    <td style={{ color: 'var(--adm-text-muted)' }}>{inq.email}</td>
                    <td>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--adm-primary)', fontFamily: 'var(--adm-mono)' }}>
                        {inq.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{inq.product || inq.data?.companyName || 'General Inquiry'}</td>
                    <td style={{ fontSize: 11, color: 'var(--adm-text-dim)' }}>
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--adm-text-dim)' }}>
            No recent submissions captured yet.
          </div>
        )}
      </div>
    </div>
  );
}

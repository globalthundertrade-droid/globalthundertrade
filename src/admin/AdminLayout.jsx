import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  BookOpen,
  Image as ImageIcon,
  Calculator,
  Search,
  Inbox,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import GttWordmark from '../components/GttWordmark';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('gtt_admin_token');
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', end: true, label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/content', label: 'Website Content', icon: <Layers size={16} /> },
    { to: '/admin/products', label: 'Products & Variants', icon: <ShoppingBag size={16} /> },
    { to: '/admin/blogs', label: 'Blog & Articles', icon: <BookOpen size={16} /> },
    { to: '/admin/media', label: 'Media Library', icon: <ImageIcon size={16} /> },
    { to: '/admin/calculator', label: 'Cost Calculator', icon: <Calculator size={16} /> },
    { to: '/admin/seo', label: 'SEO Control Center', icon: <Search size={16} /> },
    { to: '/admin/inquiries', label: 'Inquiries & Leads', icon: <Inbox size={16} /> },
    { to: '/admin/reviews', label: 'Reviews', icon: <Star size={16} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-badge" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <GttWordmark variant="admin-sidebar" />
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em', color: '#8b949e', textTransform: 'uppercase' }}>CMS &middot; COMMAND</div>
              <div style={{ fontSize: 9, color: '#484f58', letterSpacing: '.06em', textTransform: 'uppercase' }}>RESTRICTED ACCESS</div>
            </div>
          </div>
          <button
            type="button"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
            onClick={() => setMobileOpen(false)}
            style={{ display: window.innerWidth <= 1024 ? 'flex' : 'none' }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-category">Management</div>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">GTT Administrator</span>
            <span className="admin-user-role">Super Admin</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <button
              type="button"
              className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              onClick={() => setMobileOpen(true)}
              style={{ display: window.innerWidth <= 1024 ? 'flex' : 'none' }}
            >
              <Menu size={16} />
            </button>
            <span className="admin-page-heading">GTT Management Console</span>
          </div>

          <div className="admin-topbar-actions">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-btn adm-btn-secondary adm-btn-sm"
            >
              <ExternalLink size={13} />
              <span>View Public Website</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="adm-btn adm-btn-secondary adm-btn-sm"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

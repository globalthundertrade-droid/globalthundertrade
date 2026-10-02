import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Database,
  Mail,
  ShieldCheck,
  Check,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Download,
  Cloud,
  UploadCloud,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [health, setHealth] = useState(null);
  const [backingUp, setBackingUp] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);

  const [supabaseStatus, setSupabaseStatus] = useState(null);
  const [loadingSupabase, setLoadingSupabase] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    fetchHealth();
    fetchSupabaseStatus();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('[Health Fetch Error]', err);
    }
  };

  const fetchSupabaseStatus = async () => {
    setLoadingSupabase(true);
    try {
      const res = await fetch('/api/cms/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err) {
      console.error('[Supabase Status Error]', err);
    } finally {
      setLoadingSupabase(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/cms/supabase/sync', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
      fetchSupabaseStatus();
    } catch (err) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password.');

      setPasswordStatus({ type: 'success', text: 'Admin security password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>System &amp; Security Settings</h1>
        <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
          Manage admin access credentials, server diagnostics, and automated database backups.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Security & Password Card */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Key size={18} style={{ color: 'var(--adm-primary)' }} />
              <div>
                <h2 className="adm-card-title">Change Admin Password</h2>
                <p className="adm-card-desc">Requires current session verification &middot; Uses scrypt key derivation</p>
              </div>
            </div>
          </div>

          {passwordStatus && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 4,
              marginBottom: 16,
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: passwordStatus.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: passwordStatus.type === 'error' ? '#fca5a5' : '#6ee7b7',
              border: `1px solid ${passwordStatus.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              {passwordStatus.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
              <span>{passwordStatus.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="adm-form-group">
              <label className="adm-label">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">New Password (Min 8 Characters)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="adm-input"
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="adm-input"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="adm-btn adm-btn-primary"
              style={{ marginTop: 8 }}
            >
              {updatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Diagnostic Status Card */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HardDrive size={18} style={{ color: 'var(--adm-primary)' }} />
              <div>
                <h2 className="adm-card-title">Server &amp; Storage Health</h2>
                <p className="adm-card-desc">Persistent CMS engine and outbound email status</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'var(--adm-surface-alt)',
              border: '1px solid var(--adm-border)',
              borderRadius: 4,
              padding: 14,
              fontSize: 13
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--adm-text-muted)' }}>CMS Database Engine:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>Atomic File-Backed JSON</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--adm-text-muted)' }}>Storage Location:</span>
                <span style={{ fontFamily: 'var(--adm-mono)', fontSize: 11 }}>server/data/cms_db.json</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--adm-text-muted)' }}>Active Admin Account:</span>
                <span>{health?.adminUser || 'admin@globalthundertrade.com'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-muted)' }}>Outbound SMTP Email:</span>
                <span style={{ color: health?.smtpConfigured ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                  {health?.smtpConfigured ? 'Configured & Active' : 'Logged Locally (SMTP optional)'}
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--adm-surface-alt)',
              border: '1px solid var(--adm-border)',
              borderRadius: 4,
              padding: 14,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'var(--adm-text-muted)'
            }}>
              <strong style={{ color: 'var(--adm-text)' }}>Outbound Email Configuration:</strong><br />
              All leads from the Contact Form, Cost Calculator, and Supplier Intake are saved locally in the database. To enable live email dispatch to GTT inboxes, populate the <code>SMTP_HOST</code>, <code>SMTP_USER</code>, and <code>SMTP_PASS</code> variables in <code>.env</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Cloud Integration Card */}
      <div className="adm-card" style={{ marginTop: 24 }}>
        <div className="adm-card-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cloud size={20} style={{ color: '#3ecf8e' }} />
              <div>
                <h2 className="adm-card-title">Supabase Cloud Database &amp; Storage</h2>
                <p className="adm-card-desc">Live PostgreSQL persistence, real-time lead capture &amp; CDN media bucket</p>
              </div>
            </div>
            <button
              onClick={fetchSupabaseStatus}
              disabled={loadingSupabase}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={13} className={loadingSupabase ? 'adm-spin' : ''} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{
            background: 'var(--adm-surface-alt)',
            border: '1px solid var(--adm-border)',
            borderRadius: 6,
            padding: 14,
            fontSize: 13
          }}>
            <div style={{ color: 'var(--adm-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Cloud Database Connection
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: supabaseStatus?.databaseConnected ? '#10b981' : '#f59e0b'
              }} />
              <strong style={{ color: supabaseStatus?.databaseConnected ? '#34d399' : '#fbbf24' }}>
                {supabaseStatus?.databaseConnected ? 'Connected & Tables Active' : 'Connected to Gateway (Pending Schema Run)'}
              </strong>
            </div>
            <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--adm-text-muted)' }}>
              Project: <code style={{ color: 'var(--adm-primary)' }}>mclxalvjcwlmyzyszspp</code>
            </div>
          </div>

          <div style={{
            background: 'var(--adm-surface-alt)',
            border: '1px solid var(--adm-border)',
            borderRadius: 6,
            padding: 14,
            fontSize: 13
          }}>
            <div style={{ color: 'var(--adm-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Supabase Storage Bucket
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <strong style={{ color: '#34d399' }}>gtt-media (Live &amp; Public)</strong>
            </div>
            <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--adm-text-muted)' }}>
              Uploads in Media Library sync to Supabase CDN bucket
            </div>
          </div>

          <div style={{
            background: 'var(--adm-surface-alt)',
            border: '1px solid var(--adm-border)',
            borderRadius: 6,
            padding: 14,
            fontSize: 13
          }}>
            <div style={{ color: 'var(--adm-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Sync Architecture
            </div>
            <strong style={{ color: 'var(--adm-text)' }}>Two-Way Cloud &amp; Local Persistence</strong>
            <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--adm-text-muted)' }}>
              Local atomic JSON cache + Live Supabase synchronization
            </div>
          </div>
        </div>

        {syncResult && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 20,
            fontSize: 13,
            background: syncResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${syncResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: syncResult.success ? '#6ee7b7' : '#fde68a'
          }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {syncResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{syncResult.success ? 'Supabase Sync Completed Successfully!' : 'Supabase Sync Notice'}</span>
            </div>
            {syncResult.summary && (
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                Synced: {syncResult.summary.products} Products, {syncResult.summary.blogs} Blogs, {syncResult.summary.reviews} Reviews, {syncResult.summary.categories} Categories, {syncResult.summary.inquiries} Inquiries, {syncResult.summary.siteContent} Site Sections.
                {syncResult.summary.errors?.length > 0 && (
                  <div style={{ marginTop: 6, color: '#fca5a5' }}>
                    Notes: {syncResult.summary.errors.join(' | ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{
          background: 'rgba(62, 207, 142, 0.05)',
          border: '1px solid rgba(62, 207, 142, 0.2)',
          borderRadius: 6,
          padding: 16,
          marginBottom: 20
        }}>
          <h4 style={{ fontSize: 13.5, fontWeight: 600, color: '#3ecf8e', marginBottom: 8 }}>
            Initial Supabase Schema Setup (1-Time Step)
          </h4>
          <p style={{ fontSize: 12.5, color: 'var(--adm-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
            To create the 9 tables (<code>products</code>, <code>blogs</code>, <code>inquiries</code>, <code>reviews</code>, <code>categories</code>, <code>site_content</code>, <code>calculator_settings</code>, <code>seo_settings</code>, <code>media</code>) and configure Row Level Security in Supabase:
          </p>
          <ol style={{ fontSize: 12.5, color: 'var(--adm-text)', paddingLeft: 18, lineHeight: 1.8, marginBottom: 14 }}>
            <li>Open the generated <a href="file:///c:/Users/Huzaima%20Irfan/Desktop/Global%20Thunder%20Trade/supabase_schema.sql" target="_blank" rel="noreferrer" style={{ color: 'var(--adm-primary)', textDecoration: 'underline' }}>supabase_schema.sql</a> in your project root.</li>
            <li>Click the button below to open your project's <strong>Supabase SQL Editor</strong>.</li>
            <li>Paste the SQL script and click <strong>"Run"</strong>.</li>
            <li>Come back and click <strong>"Sync All Local Data to Supabase"</strong> below to populate all records!</li>
          </ol>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="https://supabase.com/dashboard/project/mclxalvjcwlmyzyszspp/sql/new"
              target="_blank"
              rel="noreferrer"
              className="adm-btn adm-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={handleSyncToSupabase}
              disabled={syncingSupabase}
              className="adm-btn adm-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, background: '#3ecf8e', borderColor: '#3ecf8e', color: '#000', fontWeight: 600 }}
            >
              <UploadCloud size={16} className={syncingSupabase ? 'adm-spin' : ''} />
              <span>{syncingSupabase ? 'Pushing Data to Supabase...' : 'Sync All Local Data to Supabase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

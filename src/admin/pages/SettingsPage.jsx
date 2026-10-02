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
  Download
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

  useEffect(() => {
    fetchHealth();
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
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import GttWordmark from '../../components/GttWordmark';
import '../admin.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('globalthundertrade@gmail.com');
  const [password, setPassword] = useState('d3v8l999');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/admin';

  const handleQuickDevLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Quick login failed.');
      }
      localStorage.setItem('gtt_admin_token', data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      localStorage.setItem('gtt_admin_token', data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0b0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#15181c',
        border: '1px solid #262c36',
        borderRadius: 8,
        padding: 36,
        boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 16 }}>
            <GttWordmark variant="login" />
          </div>
          <p style={{ fontSize: 11, color: '#8b949e', marginTop: 10, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            CMS &middot; Command Center &middot; Restricted Access
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 4,
            color: '#fca5a5',
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="adm-form-group">
            <label className="adm-label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="adm-input"
                placeholder="admin@globalthundertrade.com"
                style={{ paddingLeft: 38 }}
              />
              <Mail size={15} style={{ position: 'absolute', left: 12, top: 12, color: '#5d6775' }} />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Admin Security Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="adm-input"
                placeholder="••••••••••••"
                style={{ paddingLeft: 38 }}
              />
              <Lock size={15} style={{ position: 'absolute', left: 12, top: 12, color: '#5d6775' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="adm-btn adm-btn-primary"
            style={{ width: '100%', marginTop: 10, padding: '11px 16px' }}
          >
            {loading ? 'Authenticating Session...' : (
              <>Sign In to Console <ArrowRight size={14} /></>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickDevLogin}
            disabled={loading}
            className="adm-btn adm-btn-secondary"
            style={{ width: '100%', marginTop: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid #363e4d' }}
          >
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>1-Click Quick Sign In (Admin)</span>
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: '1px solid #262c36',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          color: '#5d6775',
          fontSize: 11
        }}>
          <ShieldCheck size={14} />
          <span>Server-Side scrypt Verification &middot; 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
}

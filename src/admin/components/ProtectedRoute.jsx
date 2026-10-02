import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({
    checked: false,
    authenticated: false,
    user: null
  });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('gtt_admin_token');
        const res = await fetch('/api/auth/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAuthState({
              checked: true,
              authenticated: true,
              user: data.user
            });
          }
          return;
        }

        // Seamless developer auto-authentication on localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.hostname === '0.0.0.0';
        if (isLocalhost) {
          try {
            const devRes = await fetch('/api/auth/dev-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            if (devRes.ok) {
              const devData = await devRes.json();
              if (devData.token) {
                localStorage.setItem('gtt_admin_token', devData.token);
              }
              if (isMounted) {
                setAuthState({
                  checked: true,
                  authenticated: true,
                  user: devData.user
                });
              }
              return;
            }
          } catch (devErr) {
            console.warn('[Admin Auth Guard] Dev auto-login attempted:', devErr);
          }
        }
      } catch (err) {
        console.error('[Admin Auth Guard] Error checking session:', err);
      }

      if (isMounted) {
        setAuthState({ checked: true, authenticated: false, user: null });
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [location.pathname]);

  if (!authState.checked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0b0d',
        color: '#8b949e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        letterSpacing: '.05em'
      }}>
        VERIFYING GTT SECURE CREDENTIALS...
      </div>
    );
  }

  if (!authState.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

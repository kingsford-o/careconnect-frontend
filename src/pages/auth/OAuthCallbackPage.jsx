import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/authStore';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      setLoading(true);

      const hash = window.location.hash || '';
      const hashParams = new URLSearchParams(hash.replace(/^#/, ''));

      let finalSession = null;
      let resolvedRole = 'patient';

      if (hashParams.has('access_token') && hashParams.has('refresh_token')) {
        const { data, error } = await supabase.auth.setSession({
          access_token: hashParams.get('access_token'),
          refresh_token: hashParams.get('refresh_token'),
        });

        if (error) throw error;
        if (!data.session) {
          throw new Error('No session found in OAuth callback hash');
        }

        finalSession = data.session;
      } else {
        // Exchange the code for a session using Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // Try to get session from URL hash
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) throw error;
          if (!data.session) {
            throw new Error('No session found in OAuth callback');
          }
          finalSession = data.session;
        } else {
          finalSession = session;
        }
      }

      if (!finalSession) {
        throw new Error('Failed to establish session');
      }

      const requestedRole = sessionStorage.getItem('signup_role') || 'patient';

      // Try to call backend with timeout, but don't fail if unavailable
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: finalSession.user.email,
            fullName: finalSession.user.user_metadata?.full_name || finalSession.user.email.split('@')[0],
            role: requestedRole,
            accessToken: finalSession.access_token,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const callbackData = await response.json();
          resolvedRole = (callbackData.role || requestedRole || 'patient').toLowerCase();
        } else {
          console.log('Backend callback failed, using local role');
          resolvedRole = requestedRole;
        }
      } catch (fetchError) {
        // Backend unavailable - use local role from session storage
        console.log('Backend unavailable, using local session');
        resolvedRole = requestedRole;
      }

      // Store auth token
      if (finalSession.access_token) {
        localStorage.setItem('auth_token', finalSession.access_token);
      }
      sessionStorage.removeItem('signup_role');

      // Hydrate the auth store with the session
      await hydrate();

      // Wait a moment to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate based on role
      if (resolvedRole === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else if (resolvedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/home', { replace: true });
      }
    } catch (err) {
      console.error('❌ OAuth callback error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="auth-page-premium">
        <div className="auth-container">
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-premium">
      <div className="auth-container">
        <div className="loading-spinner"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
}

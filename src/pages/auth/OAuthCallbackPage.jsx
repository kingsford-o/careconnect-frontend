import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../../store/authStore';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

      if (hashParams.has('access_token') && hashParams.has('refresh_token')) {
        const { data, error } = await supabase.auth.setSession({
          access_token: hashParams.get('access_token'),
          refresh_token: hashParams.get('refresh_token'),
        });

        if (error) throw error;
        if (!data.session) {
          throw new Error('No session found in OAuth callback hash');
        }

        const finalSession = data.session;

        const requestedRole = sessionStorage.getItem('signup_role') || 'patient';

        // Check if user exists in our backend
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
        });

        const callbackData = await response.json();

        if (!response.ok) {
          throw new Error(callbackData.error || 'OAuth callback failed');
        }

        const resolvedRole = (callbackData.role || requestedRole || 'patient').toLowerCase();

        if (finalSession.access_token) {
          localStorage.setItem('auth_token', finalSession.access_token);
        }
        sessionStorage.removeItem('signup_role');

        await hydrate();
        await new Promise(resolve => setTimeout(resolve, 100));

        if (resolvedRole === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (resolvedRole === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/patient/home', { replace: true });
        }
        return;
      }

      // Exchange the code for a session using Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      let finalSession = session;

      if (sessionError || !session) {
        // Try to get session from URL hash
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) throw error;
        if (!data.session) {
          throw new Error('No session found in OAuth callback');
        }
        finalSession = data.session;
      }

      // Prefer the backend-resolved user role over any stale local value.
      const requestedRole = sessionStorage.getItem('signup_role') || 'patient';

      // Check if user exists in our backend
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OAuth callback failed');
      }

      const resolvedRole = (data.role || requestedRole || 'patient').toLowerCase();

      // Store auth token
      if (finalSession.access_token) {
        localStorage.setItem('auth_token', finalSession.access_token);
      }
      sessionStorage.removeItem('signup_role');

      // Hydrate the auth store with the validated session
      await hydrate();

      // Wait a moment to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate based on the actual backend role to avoid stale role redirects.
      if (resolvedRole === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else if (resolvedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/home', { replace: true });
      }
    } catch (err) {
      console.error('❌ OAuth callback error:', err);
      setError(err.message);
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

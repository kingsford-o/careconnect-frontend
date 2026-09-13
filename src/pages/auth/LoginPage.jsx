import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Logo from '../../components/brand/Logo';
import PasswordInput from '../../components/common/PasswordInput';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);
  const adminLogin = useAuthStore(state => state.adminLogin);
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const queryRole = new URLSearchParams(location.search).get('role');
  const [role, setRole] = useState(queryRole || 'patient');
  const [adminAuthMode, setAdminAuthMode] = useState('passkey'); // 'passkey' | 'credentials'

  useEffect(() => {
    if (queryRole && ['patient', 'doctor', 'admin'].includes(queryRole)) {
      setRole(queryRole);
    }
  }, [queryRole]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passkey: '',
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    // NO STORAGE - Update URL param only
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('role', newRole);
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    console.log('🔐 Form submission - Role:', role, 'Admin Mode:', adminAuthMode);
    console.log('🔐 Form data:', role === 'admin' && adminAuthMode === 'passkey' ? { passkey: '***' } : { email: formData.email, password: '***' });

    setLoading(true);
    setError('');

    try {
      let result;
      if (role === 'admin' && adminAuthMode === 'passkey') {
        console.log('🔐 Calling adminLogin with passkey');
        if (!formData.passkey.trim()) {
          throw new Error('Please enter the admin passkey');
        }
        result = await adminLogin(formData.passkey);
      } else {
        console.log('🔐 Calling regular login');
        result = await login(formData.email, formData.password, role);
      }

      console.log('🔐 Login result:', result);

      const userRole = result?.role || (role === 'admin' ? 'admin' : (role === 'doctor' ? 'doctor' : 'patient'));
      const destination = location.state?.from;
      let defaultDestination = '/patient/home';
      if (userRole === 'admin') {
        defaultDestination = '/admin/dashboard';
      } else if (userRole === 'doctor') {
        defaultDestination = '/doctor/dashboard';
      }

      console.log('🔐 Navigating to:', destination ? `${destination.pathname}${destination.search}${destination.hash}` : defaultDestination);

      navigate(
        destination ? `${destination.pathname}${destination.search}${destination.hash}` : defaultDestination,
        { replace: true }
      );
    } catch (err) {
      console.error('🔐 Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const destination = location.state?.from;
      // NO STORAGE - Pass destination through URL params if needed
      const googleRole = destination?.pathname?.startsWith('/patient/')
        ? 'patient'
        : role || 'patient';
      await signInWithGoogle(googleRole);
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Google sign in failed. Please try again.');
    }
  };

  return (
    <div className="auth-page-premium login-page-premium">
      <div className="auth-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>

      <div className="auth-container">
        <div className="auth-header">
          <Logo size={48} />
          <h1>Welcome back</h1>
          <p>
            {role === 'admin'
              ? adminAuthMode === 'passkey'
                ? 'Enter the admin passkey to access the dashboard'
                : 'Sign in with your admin credentials'
              : role === 'doctor'
              ? 'Sign in to access your doctor dashboard and appointments'
              : 'Sign in to your account to continue your healthcare journey'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="auth-role-tabs" role="tablist" aria-label="Select role">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'patient'}
            className={`auth-role-tab ${role === 'patient' ? 'active' : ''}`}
            onClick={() => handleRoleChange('patient')}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Patient
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'doctor'}
            className={`auth-role-tab ${role === 'doctor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('doctor')}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Doctor
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'admin'}
            className={`auth-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" action="#" autoComplete="off">
          {error && (
            <div className="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {role === 'admin' && adminAuthMode === 'passkey' ? (
            <div className="form-group">
              <label htmlFor="passkey">Admin Passkey</label>
              <input
                id="passkey"
                type="password"
                placeholder="Enter admin passkey"
                value={formData.passkey}
                onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <div className="form-actions">
                  <button type="button" className="forgot-password">Forgot Password?</button>
                </div>
              </div>
            </>
          )}

          {role === 'admin' && (
            <div className="admin-mode-toggle">
              <button
                type="button"
                className="admin-mode-btn"
                onClick={() => {
                  setAdminAuthMode(adminAuthMode === 'passkey' ? 'credentials' : 'passkey');
                  setError('');
                }}
                disabled={loading}
              >
                {adminAuthMode === 'passkey'
                  ? 'Sign in with Admin Email & Password instead'
                  : 'Sign in with Admin Passkey instead'}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
            formNoValidate
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {role !== 'admin' && (
          <>
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className="btn btn-google btn-large"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Connecting...' : 'Sign in with Google'}
            </button>
          </>
        )}

        <div className="auth-footer">
          <div className="footer-links">
            <button type="button" onClick={() => navigate('/')} className="auth-link">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


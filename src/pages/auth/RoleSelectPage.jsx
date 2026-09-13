import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Logo from '../../components/brand/Logo';

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const resetForRoleSelection = useAuthStore(state => state.resetForRoleSelection);

  const handleRoleSelect = async (role) => {
    await resetForRoleSelection();
    // NO STORAGE - Pass role through URL params
    navigate(role === 'admin' ? '/auth/login?role=admin' : `/auth/signup?role=${role}`);
  };

  return (
    <div className="auth-page-premium role-select-premium">
      <div className="auth-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>

      <div className="auth-container">
        <div className="auth-header">
          <Logo size={48} />
          <h1>Welcome to CareConnect</h1>
          <p>Your health journey starts here. Choose how you'd like to join our platform.</p>
        </div>

        <div className="role-cards">
          <button
            type="button"
            className="role-card patient-card"
            onClick={() => handleRoleSelect('patient')}
          >
            <div className="role-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="role-content">
              <h3>Patient</h3>
              <p>Find doctors, book appointments, and manage your health records</p>
            </div>
            <div className="role-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            type="button"
            className="role-card doctor-card"
            onClick={() => handleRoleSelect('doctor')}
          >
            <div className="role-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="role-content">
              <h3>Doctor</h3>
              <p>Connect with patients, manage appointments, and grow your practice</p>
            </div>
            <div className="role-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            type="button"
            className="role-card admin-card"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="role-content">
              <h3>Admin</h3>
              <p>Manage doctor applications and oversee platform operations</p>
            </div>
            <div className="role-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <div className="auth-footer">
          <div className="footer-links">
            <button type="button" onClick={() => navigate('/')} className="auth-link">
              Back to Home
            </button>
            <span className="footer-divider">|</span>
            <p>By continuing, you agree to our <a href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

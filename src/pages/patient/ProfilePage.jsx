import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const showModal = useUIStore(state => state.showModal);

  if (!user) {
    return (
      <div className="patient-dashboard-premium">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading patient profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    showModal(
      <ConfirmDialog
        title="Sign Out of CareConnect"
        message="Are you sure you want to log out of your patient portal session?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        onConfirm={() => logout()}
        variant="danger"
      />
    );
  };

  const patientName = user.full_name || 'Patient Account';
  const patientEmail = user.email || 'No email registered';

  return (
    <div className="patient-dashboard-premium profile-page-premium">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              type="button" 
              onClick={() => navigate('/patient/home')}
              className="btn btn-outline btn-sm mb-2"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
            >
              ← Back to Dashboard
            </button>
            <h1 className="dashboard-title">Patient Account & Settings</h1>
            <p className="dashboard-subtitle">
              Manage your personal health profile and account preferences
            </p>
          </div>
        </div>
      </header>

      <div className="profile-container-premium">
        {/* Profile Card Summary */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-large-avatar">
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt={patientName} />
              ) : user.avatar ? (
                <span className="avatar-char">{user.avatar}</span>
              ) : (
                <span className="avatar-char">{patientName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-hero-info">
              <div className="d-flex align-center gap-2 mb-1 flex-wrap">
                <span className="portal-badge-sm">
                  <span className="live-dot"></span>
                  Verified Patient
                </span>
              </div>
              <h2 className="profile-hero-name">{patientName}</h2>
              <p className="profile-hero-email">{patientEmail}</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/patient/edit-profile')}
          >
            Edit Profile
          </button>
        </div>

        {/* Settings Sections */}
        <div className="profile-sections-grid">
          {/* Account Settings */}
          <div className="profile-group-card">
            <h3 className="profile-group-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: '-2px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Account Preferences
            </h3>
            <div className="profile-action-list">
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/patient/edit-profile')}
              >
                <span>Edit Personal Details</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/patient/appointments')}
              >
                <span>View Consultation History</span>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Clinical Support & Legal */}
          <div className="profile-group-card">
            <h3 className="profile-group-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: '-2px' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Help & Compliance
            </h3>
            <div className="profile-action-list">
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/contact')}
              >
                <span>CareConnect Support Desk</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/legal/privacy')}
              >
                <span>Patient Privacy & Data Protection</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/legal/terms')}
              >
                <span>Platform Terms of Service</span>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Session & Security */}
          <div className="profile-group-card danger-zone">
            <h3 className="profile-group-title text-danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: '-2px' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Session Management
            </h3>
            <div className="profile-action-list">
              <button 
                type="button" 
                className="profile-action-btn danger-btn"
                onClick={handleLogout}
              >
                <span>Sign Out of Account</span>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


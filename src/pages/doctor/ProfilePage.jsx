import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const doctorProfile = useAuthStore(state => state.doctorProfile);
  const logout = useAuthStore(state => state.logout);
  const showModal = useUIStore(state => state.showModal);

  if (!user) {
    return (
      <div className="doctor-dashboard-premium">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading practitioner profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    showModal(
      <ConfirmDialog
        title="Sign Out of CareConnect"
        message="Are you sure you want to end your clinical session?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        onConfirm={() => logout()}
        variant="danger"
      />
    );
  };

  const doctorName = user.full_name || 'Practitioner';
  const specialty = doctorProfile?.specialty || 'General Practitioner';
  const hospital = doctorProfile?.hospital_name || 'CareConnect Virtual Clinic';
  const license = doctorProfile?.medical_license || 'Verified License';
  const experience = doctorProfile?.years_experience || 0;
  const rate = doctorProfile?.hourly_rate || 0;
  const status = doctorProfile?.verification_status || 'approved';

  return (
    <div className="doctor-dashboard-premium profile-page-premium">
      {/* Header */}
      <header className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div className="header-content">
          <button 
            type="button" 
            onClick={() => navigate('/doctor/dashboard')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
          >
            ← Back to Dashboard
          </button>
          <h1 className="dashboard-title">Practitioner Profile & Credentials</h1>
          <p className="dashboard-subtitle">
            Manage your clinical credentials, consultation settings, and account preferences
          </p>
        </div>
      </header>

      <div className="profile-container-premium">
        {/* Profile Hero Card */}
        <div className="profile-hero-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px', marginBottom: '2rem' }}>
          <div className="profile-hero-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="profile-large-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt={doctorName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : user.avatar ? (
                <span>{user.avatar}</span>
              ) : (
                <span>{doctorName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-hero-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <StatusBadge status={status} />
                <span className="portal-badge-sm" style={{ background: 'var(--surface-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {specialty}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dr. {doctorName}</h2>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => navigate('/doctor/edit-profile')}
          >
            Edit Profile Details
          </button>
        </div>

        {/* Clinical Credentials Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Specialty</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{specialty}</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Medical License</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-600)' }}>{license}</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Hospital / Clinic</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{hospital}</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Clinical Experience</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{experience} Years</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Consultation Fee</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success-600)' }}>GHS {rate} / hr</div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="profile-sections-grid">
          {/* Practice Settings */}
          <div className="profile-group-card">
            <h3 className="profile-group-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem', verticalAlign: '-2px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Practice Preferences
            </h3>
            <div className="profile-action-list">
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/doctor/edit-profile')}
              >
                <span>Edit Clinical Information</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/doctor/appointments')}
              >
                <span>Manage Patient Schedule</span>
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
              Support & Compliance
            </h3>
            <div className="profile-action-list">
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/contact')}
              >
                <span>Practitioner Support Desk</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/legal/privacy')}
              >
                <span>Healthcare Privacy Policy</span>
                <span className="action-arrow">→</span>
              </button>
              <button 
                type="button" 
                className="profile-action-btn"
                onClick={() => navigate('/legal/terms')}
              >
                <span>Terms of Medical Service</span>
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


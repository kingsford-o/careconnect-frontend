import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const showModal = useUIStore(state => state.showModal);

  if (!user) {
    return <div className="loading-state">Loading profile...</div>;
  }

  const handleLogout = () => {
    showModal(
      <ConfirmDialog
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => logout()}
        variant="danger"
      />
    );
  };

  return (
    <div className="profile-page">
      <header>
        <button type="button" onClick={() => window.history.back()}>← Back</button>
        <h1>My Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-header">
          {user.profile_image_url ? (
            <img src={user.profile_image_url} alt="Profile" className="profile-avatar-image" />
          ) : (
            <div className="profile-avatar-display">{user.avatar || user.full_name?.charAt(0) || 'D'}</div>
          )}
          <h2>Dr. {user.full_name || 'Doctor'}</h2>
          <p>{user.email || ''}</p>
          <span className="badge badge-info">Doctor</span>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Profile Settings</h3>
            <button type="button" className="profile-action" onClick={() => navigate('/doctor/edit-profile')}>
              Edit Profile
            </button>
            <button type="button" className="profile-action" disabled>Change Password</button>
            <button type="button" className="profile-action" disabled>Availability Settings</button>
            <button type="button" className="profile-action" disabled>Notification Settings</button>
          </div>

          <div className="profile-section">
            <h3>Support</h3>
            <button type="button" className="profile-action" onClick={() => navigate('/contact')}>Contact Support</button>
            <button type="button" className="profile-action" onClick={() => navigate('/legal/terms')}>Terms of Service</button>
            <button type="button" className="profile-action" onClick={() => navigate('/legal/privacy')}>Privacy Policy</button>
          </div>

          <div className="profile-section">
            <h3>Danger Zone</h3>
            <button type="button" className="profile-action danger" onClick={handleLogout}>
              Logout
            </button>
            <button type="button" className="profile-action danger" disabled>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

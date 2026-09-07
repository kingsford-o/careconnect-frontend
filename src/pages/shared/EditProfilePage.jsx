import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ProfileHeader from '../../components/common/ProfileHeader';
import ProfileCard from '../../components/common/ProfileCard';
import ProfileForm from '../../components/common/ProfileForm';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const loading = useAuthStore(state => state.loading);
  
  if (!user) {
    return <div className="loading-state">Loading profile...</div>;
  }

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🐱');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSelectedAvatar(user?.avatar || '🐱');
  }, [user]);

  const handleSubmit = async (formData) => {
    if (loading) return;

    setSuccessMessage('');
    setErrorMessage('');

    try {
      const profileData = {
        ...formData,
        avatar: selectedAvatar,
      };

      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      
      // Navigate back after a short delay
      setTimeout(() => {
        if (user?.role === 'patient') {
          navigate('/patient/profile');
        } else if (user?.role === 'doctor') {
          navigate('/doctor/profile');
        }
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user?.role === 'patient') {
      navigate('/patient/profile');
    } else if (user?.role === 'doctor') {
      navigate('/doctor/profile');
    }
  };

  return (
    <div className="edit-profile-page-premium">
      <ProfileHeader
        title="Edit Profile"
        description="Update your personal information and preferences"
      />

      {successMessage && (
        <div className="notification-widget slide-in-top" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
          <div className="notification-icon">✓</div>
          <div className="notification-content">
            <div className="notification-title">Success</div>
            <div className="notification-message">{successMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="notification-widget slide-in-top" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
          <div className="notification-icon">✕</div>
          <div className="notification-content">
            <div className="notification-title">Error</div>
            <div className="notification-message">{errorMessage}</div>
          </div>
        </div>
      )}

      <div className="edit-profile-content-premium">
        <ProfileCard
          user={user}
          avatar={selectedAvatar}
          onAvatarChange={setSelectedAvatar}
          loading={loading}
        />

        <div className="profile-form-section-premium">
          <ProfileForm
            user={user}
            role={user?.role}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <div className="form-actions-secondary">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

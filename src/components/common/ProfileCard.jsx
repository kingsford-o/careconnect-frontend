import { useState } from 'react';
import AvatarPicker from './AvatarPicker';

export default function ProfileCard({ user, avatar, onAvatarChange, loading = false }) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  return (
    <div className="profile-card">
      <div className="profile-avatar-section">
        <div className="current-avatar">
          <span className="avatar-display">{avatar || user?.avatar || '🐱'}</span>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
          disabled={loading}
          aria-expanded={showAvatarPicker}
          aria-controls="avatar-picker"
        >
          {showAvatarPicker ? 'Cancel' : 'Change Avatar'}
        </button>
      </div>

      {showAvatarPicker && (
        <div id="avatar-picker" className="avatar-picker-container">
          <AvatarPicker
            selectedAvatar={avatar || user?.avatar || '🐱'}
            onSelect={(newAvatar) => {
              onAvatarChange(newAvatar);
              setShowAvatarPicker(false);
            }}
            label="Select your new avatar"
          />
        </div>
      )}

      <div className="profile-info">
        <h2>{user?.full_name || 'User'}</h2>
        <p>{user?.email || ''}</p>
        <span className={`badge badge-${user?.role || 'info'}`}>
          {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
        </span>
      </div>
    </div>
  );
}

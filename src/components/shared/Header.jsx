import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Header({ title, showBack = false, showProfile = false }) {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  return (
    <header className="header">
      {showBack && (
        <button type="button" className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
      )}
      <h1>{title}</h1>
      <div className="header-right">
        {showProfile && (
          <button
            type="button"
            className="profile-btn"
            onClick={() => navigate(user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile')}
          >
            <img src={user?.profile_image_url || '/default-avatar.png'} alt="Profile" />
          </button>
        )}
      </div>
    </header>
  );
}

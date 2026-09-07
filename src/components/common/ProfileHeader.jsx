import { useNavigate } from 'react-router-dom';

export default function ProfileHeader({ title, description, showBackButton = true }) {
  const navigate = useNavigate();

  return (
    <header className="profile-header">
      {showBackButton && (
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      <div className="profile-header-content">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </header>
  );
}

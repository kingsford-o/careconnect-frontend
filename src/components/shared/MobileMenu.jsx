import { useNavigate, Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

export default function MobileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const isDarkMode = useUIStore(state => state.isDarkMode);
  const toggleDarkMode = useUIStore(state => state.toggleDarkMode);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>

        <nav className="mobile-nav">
          <Link to="/" onClick={onClose}>Home</Link>
          <button type="button" onClick={() => { navigate('/auth/role'); onClose(); }}>Features</button>
          <button type="button" onClick={() => { navigate('/auth/role'); onClose(); }}>Contact</button>
        </nav>

        <div className="mobile-menu-actions">
          <button
            type="button"
            className="btn btn-outline btn-full"
            onClick={() => {
              navigate('/auth/role');
              onClose();
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() => {
              navigate('/auth/role');
              onClose();
            }}
          >
            Get Started
          </button>
        </div>

        <div className="mobile-menu-footer">
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}

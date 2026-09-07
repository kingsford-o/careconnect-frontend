import { useUIStore } from '../../store/uiStore';

export default function FloatingThemeToggle() {
  const isDarkMode = useUIStore(state => state.isDarkMode);
  const toggleDarkMode = useUIStore(state => state.toggleDarkMode);

  return (
    <button
      className="floating-theme-toggle"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <span className="theme-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

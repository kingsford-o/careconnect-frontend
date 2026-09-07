import { useUIStore } from '../../store/uiStore';

export default function DarkModeToggle() {
  const isDarkMode = useUIStore(state => state.isDarkMode);
  const toggleDarkMode = useUIStore(state => state.toggleDarkMode);

  return (
    <button
      type="button"
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

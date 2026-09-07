import { Link } from 'react-router-dom';

export default function BackToHomeButton() {
  return (
    <Link to="/" className="back-to-home-button">
      <span className="back-arrow">←</span>
      <span>Back to Home</span>
    </Link>
  );
}

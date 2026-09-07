import { Component } from 'react';
import { useNavigate } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    // Log error details for debugging without exposing to user
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1>Something went wrong</h1>
        <p>CareConnect couldn't load this page. This might be a temporary issue.</p>
        <div className="error-actions">
          <button onClick={handleTryAgain} className="btn btn-primary">
            Try Again
          </button>
          <button onClick={handleGoHome} className="btn btn-outline">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

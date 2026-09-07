import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import MobileMenu from '../components/shared/MobileMenu';
import Footer from '../components/shared/Footer';
import Logo from '../components/brand/Logo';
import useHideOnScroll from '../hooks/useHideOnScroll';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isHidden, isScrolling } = useHideOnScroll({ 
    threshold: 80, 
    isMobileMenuOpen 
  });

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/auth/role');
    }
  };

  return (
    <div className="landing-page-premium">
      {/* Premium Header */}
      <header 
        className={`premium-header ${isHidden ? 'navbar-hidden' : ''} ${isScrolling ? 'navbar-scrolling' : ''}`}
      >
        <div className="header-container">
          <Link to="/" className="logo-link">
            <Logo size={36} />
          </Link>
          <nav className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <button type="button" className="nav-link" onClick={() => navigate('/auth/role')}>Features</button>
            <button type="button" className="nav-link" onClick={() => navigate('/auth/role')}>Contact</button>
          </nav>
          <div className="header-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/auth/role')}>
              Sign In
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/auth/role')}>
              Get Started
            </button>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Premium Hero Section - Asymmetrical Layout */}
      <section className="premium-hero">
        <div className="hero-container">
          <div className="hero-content text-left space-y-6">
            <div className="trust-badge">
              <div className="badge-stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <span>Your trusted healthcare platform</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">Healthcare</span>
              <span className="title-line title-gradient">Simplified</span>
              <span className="title-line">for Modern Families</span>
            </h1>
            
            <p className="hero-description">
              Skip the waiting room. Connect with top-rated doctors, book appointments instantly, 
              and manage your health records in one secure workspace designed for the modern patient.
            </p>

            {/* Integrated Search Bar */}
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>

            <div className="hero-stats">
              <div className="mini-stat">
                <span className="stat-value">Secure</span>
                <span className="stat-label">Platform</span>
              </div>
              <div className="mini-stat-divider"></div>
              <div className="mini-stat">
                <span className="stat-value">Verified</span>
                <span className="stat-label">Doctors</span>
              </div>
              <div className="mini-stat-divider"></div>
              <div className="mini-stat">
                <span className="stat-value">Easy</span>
                <span className="stat-label">Booking</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-visuals">
            <div className="hero-main-image">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=1000&fit=crop&q=80"
                alt="Friendly doctor providing patient care"
                className="main-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mixed Layout */}
      <section className="features-section-premium">
        <div className="section-header">
          <div className="section-badge">Features</div>
          <h2>Everything you need for better health</h2>
          <p>Comprehensive tools designed to simplify your healthcare journey</p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-large">
            <div className="feature-icon gradient-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Find the Right Doctor</h3>
            <p>Search through thousands of verified professionals by specialty, location, insurance, and patient reviews. Make informed decisions with detailed profiles.</p>
            <button type="button" className="feature-link" onClick={() => navigate('/auth/role')}>
              Explore Doctors
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3>Easy Booking</h3>
            <p>Book appointments instantly with real-time availability. Choose in-person or virtual consultations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>Digital Records</h3>
            <p>Access your medical history prescriptions, and test results all in one secure place.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Secure Messaging</h3>
            <p>Communicate directly with your healthcare team through encrypted messaging.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3>Virtual Consultations</h3>
            <p>Connect with doctors from home through high-quality video consultations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Privacy First</h3>
            <p>Your health data is protected with enterprise-grade security and HIPAA compliance.</p>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <div className="section-badge">FAQ</div>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about CareConnect</p>
        </div>

        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I book an appointment?</h3>
            <p>Simply search for a doctor, view their profile, and select an available time slot. You'll receive instant confirmation and reminders.</p>
          </div>
          <div className="faq-item">
            <h3>Is my health data secure?</h3>
            <p>Absolutely. We use enterprise-grade encryption and are fully HIPAA compliant. Your privacy is our top priority.</p>
          </div>
          <div className="faq-item">
            <h3>Can I have virtual consultations?</h3>
            <p>Yes! Many of our doctors offer video consultations. You can connect from anywhere with our secure video platform.</p>
          </div>
          <div className="faq-item">
            <h3>How are doctors verified?</h3>
            <p>Every doctor on our platform undergoes rigorous verification including license checks, credential reviews, and background checks.</p>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="premium-cta-section">
        <div className="cta-background">
          <div className="gradient-blob blob-cta"></div>
        </div>
        <div className="cta-container">
          <h2>Ready to transform your healthcare experience?</h2>
          <p>Join millions of patients who have already made the switch to smarter, simpler healthcare.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/auth/role')}>
              Get Started Free
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate('/auth/role')}>
              Learn More
            </button>
          </div>
          <div className="cta-trust">
            <span>No credit card required</span>
            <span>•</span>
            <span>Free to sign up</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      <Footer />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
}

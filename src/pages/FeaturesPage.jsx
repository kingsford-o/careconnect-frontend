import { useNavigate, useLocation, Link } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import Logo from '../components/brand/Logo';
import useHideOnScroll from '../hooks/useHideOnScroll';

export default function FeaturesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { isHidden, isScrolling } = useHideOnScroll({ threshold: 80 });

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: 'Book Appointments Online',
      description: 'Schedule appointments with your preferred doctors in just a few clicks. No more waiting on hold.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      title: 'Doctor Dashboard',
      description: 'Comprehensive dashboard for healthcare providers to manage appointments, patients, and schedules efficiently.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: 'Patient Dashboard',
      description: 'Personalized dashboard for patients to track appointments, view medical history, and manage health records.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: 'Appointment Management',
      description: 'Seamlessly manage, reschedule, or cancel appointments with real-time updates and notifications.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with encrypted data storage and secure authentication for peace of mind.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: 'Real-Time Status',
      description: 'Get instant updates on appointment status, doctor availability, and booking confirmations.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: 'Mobile-Friendly',
      description: 'Access CareConnect from any device. Our responsive design ensures a seamless experience everywhere.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      title: 'Dark Mode',
      description: 'Switch between light and dark themes for comfortable viewing in any lighting condition.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'Responsive Design',
      description: 'Beautifully designed interface that adapts perfectly to screens of all sizes.'
    }
  ];

  const benefits = [
    'Save time with online booking',
    'Access verified healthcare professionals',
    'Manage your health records securely',
    '24/7 appointment availability',
    'Real-time notifications',
    'Secure and private platform'
  ];

  return (
    <div className="features-page-premium">
      <header 
        className={`landing-header ${isHidden ? 'navbar-hidden' : ''} ${isScrolling ? 'navbar-scrolling' : ''}`}
      >
        <div className="header-container">
          <div className="logo">
            <Link to="/" className="logo-link">
              <Logo size={32} />
            </Link>
          </div>
          <nav className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/features" className={isActive('/features') ? 'active' : ''}>Features</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          </nav>
          <div className="header-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/auth/login')}>
              Sign In
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/auth/role')}>
              Get Started
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="features-hero-premium">
        <div className="features-hero-container">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <h1 className="display-lg">Powerful Features for Modern Healthcare</h1>
          <p className="body-lg">
            Experience the future of healthcare management with our comprehensive suite of tools 
            designed for both patients and healthcare providers.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/auth/role')}>
            Book an Appointment
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="features-grid-section-premium">
        <div className="features-container">
          <div className="section-header">
            <h2 className="heading-2">Everything You Need</h2>
            <p className="body-base">Comprehensive features designed to simplify healthcare management</p>
          </div>
          <div className="features-grid-premium stagger-children">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-premium fade-in-up">
                <div className="feature-icon-premium">{feature.icon}</div>
                <h3 className="heading-4">{feature.title}</h3>
                <p className="body-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section-premium">
        <div className="features-container">
          <div className="section-header">
            <h2 className="heading-2">How It Works</h2>
            <p className="body-base">Get started in three simple steps</p>
          </div>
          <div className="timeline-premium">
            <div className="timeline-item fade-in-up">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3 className="heading-4">Create an Account</h3>
                <p className="body-sm">Sign up as a patient or healthcare provider in minutes</p>
              </div>
            </div>
            <div className="timeline-item fade-in-up">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3 className="heading-4">Book an Appointment</h3>
                <p className="body-sm">Browse available doctors and schedule your appointment</p>
              </div>
            </div>
            <div className="timeline-item fade-in-up">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3 className="heading-4">Meet Your Doctor</h3>
                <p className="body-sm">Connect with your healthcare provider through in-person or virtual visits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section-premium">
        <div className="features-container">
          <div className="section-header">
            <h2 className="heading-2">Why Choose CareConnect</h2>
            <p className="body-base">Benefits that make healthcare management effortless</p>
          </div>
          <div className="benefits-grid-premium stagger-children">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item fade-in-up">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="benefit-check">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="body-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta-section-premium">
        <div className="features-cta-container">
          <h2 className="display-md">Ready to Transform Your Healthcare Experience?</h2>
          <p className="body-lg">Join thousands of users who have already made the switch to smarter healthcare management.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/auth/role')}>
              Get Started
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

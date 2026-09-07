import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import Logo from '../components/brand/Logo';
import useHideOnScroll from '../hooks/useHideOnScroll';

export default function ContactPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { isHidden, isScrolling } = useHideOnScroll({ threshold: 80 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by creating an account, browsing available doctors, and selecting a time slot that works for you.'
    },
    {
      question: 'Is my medical information secure?',
      answer: 'Yes, we use enterprise-grade encryption and security measures to protect your personal and medical information.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule appointments through your patient dashboard up to 24 hours before your scheduled time.'
    },
    {
      question: 'Do you offer virtual consultations?',
      answer: 'Yes, many of our healthcare providers offer virtual consultations. Check the doctor\'s profile for availability.'
    },
    {
      question: 'How do I become a healthcare provider on CareConnect?',
      answer: 'Healthcare providers can join by selecting "Join as a Professional" on our homepage and completing the verification process.'
    }
  ];

  return (
    <div className="contact-page-premium">
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
      <section className="contact-hero-premium">
        <div className="contact-hero-container">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <h1 className="display-lg">Get in Touch</h1>
          <p className="body-lg">
            Have questions or need assistance? We're here to help. Reach out to us 
            and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section-premium">
        <div className="contact-container">
          <div className="contact-grid-premium">
            {/* Contact Form */}
            <div className="contact-form-wrapper-premium">
              <h2 className="heading-2">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form-premium">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-wrapper-premium">
              <h2 className="heading-2">Contact Information</h2>
              <div className="contact-info-premium">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3 className="heading-5">Email</h3>
                    <p className="body-sm">contact@careconnect.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3 className="heading-5">Phone</h3>
                    <p className="body-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3 className="heading-5">Location</h3>
                    <p className="body-sm">123 Healthcare Avenue<br />Accra, Ghana</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h3 className="heading-5">Office Hours</h3>
                    <p className="body-sm">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="map-placeholder-premium">
                <div className="map-placeholder-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  <p className="body-sm">Map will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section-premium">
        <div className="contact-container">
          <div className="section-header">
            <h2 className="heading-2">Frequently Asked Questions</h2>
            <p className="body-base">Find answers to common questions about CareConnect</p>
          </div>
          <div className="faq-grid-premium stagger-children">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item fade-in-up">
                <h3 className="heading-4">{faq.question}</h3>
                <p className="body-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section-premium">
        <div className="contact-container">
          <div className="section-header">
            <h2 className="heading-2">Follow Us</h2>
            <p className="body-base">Stay connected with CareConnect on social media</p>
          </div>
          <div className="social-links-premium">
            <a href="https://github.com/kingsford-o" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="social-icon" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
              <span className="body-sm">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/obosukingsford/" className="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="social-icon" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
              </svg>
              <span className="body-sm">LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/nanak1ng" className="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="social-icon" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
              <span className="body-sm">Instagram</span>
            </a>
            <a href="https://www.telegram.com/nanak1ng" className="social-link" aria-label="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="social-icon" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
              </svg>
              <span className="body-sm">Telegram</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

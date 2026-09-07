import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../brand/Logo';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="premium-footer">
      <div className="footer-background">
        <div className="gradient-blob blob-footer-1"></div>
        <div className="gradient-blob blob-footer-2"></div>
      </div>
      
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Logo size={40} />
            </div>
            <p className="footer-description">
              Your trusted healthcare platform for connecting patients with top-rated doctors. 
              Making healthcare accessible, simple, and human.
            </p>
            <div className="footer-social">
              <button type="button" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </button>
              <button type="button" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </button>
              <button type="button" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Product</h4>
            <nav className="footer-nav">
              <button type="button" onClick={() => navigate('/')} className="footer-link">Home</button>
              <button type="button" onClick={() => navigate('/auth/role')} className="footer-link">Features</button>
              <button type="button" onClick={() => navigate('/auth/role')} className="footer-link">Contact</button>
              <button type="button" onClick={() => navigate('/auth/role')} className="footer-link">Get Started</button>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Company</h4>
            <nav className="footer-nav">
              <button type="button" className="footer-link">About Us</button>
              <button type="button" className="footer-link">Careers</button>
              <button type="button" className="footer-link">Blog</button>
              <button type="button" className="footer-link">Press</button>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <nav className="footer-nav">
              <button type="button" className="footer-link">Help Center</button>
              <button type="button" className="footer-link">Privacy Policy</button>
              <button type="button" className="footer-link">Terms of Service</button>
              <button type="button" onClick={() => navigate('/auth/role')} className="footer-link">Contact Us</button>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="footer-section footer-newsletter">
            <h4 className="footer-section-title">Stay Updated</h4>
            <p className="newsletter-description">
              Get the latest healthcare tips and platform updates.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-branding">
            <p className="footer-copyright">
              © {currentYear} CareConnect. All rights reserved.
            </p>
          </div>
          <div className="footer-legal">
            <button className="footer-legal-link">Privacy</button>
            <button className="footer-legal-link">Terms</button>
            <button className="footer-legal-link">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

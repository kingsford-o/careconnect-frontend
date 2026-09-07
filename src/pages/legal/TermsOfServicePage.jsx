import { Link } from 'react-router-dom';
import Logo from '../../components/brand/Logo';
import BackToHomeButton from '../../components/shared/BackToHomeButton';

export default function TermsOfServicePage() {
  return (
    <div className="legal-page">
      <BackToHomeButton />
      
      <div className="legal-container">
        <div className="legal-header">
          <Logo size={48} />
          <h1>Terms of Service</h1>
          <p>Last updated: August 2026</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CareConnect, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. User Accounts</h2>
            <p>
              CareConnect allows users to create accounts as patients, doctors, or administrators. 
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
            <p>
              <strong>For Patients:</strong> You must provide accurate and complete information when 
              booking appointments and communicating with healthcare providers.
            </p>
            <p>
              <strong>For Doctors:</strong> You must be a licensed healthcare professional and provide 
              valid credentials. Your account is subject to verification by CareConnect administrators.
            </p>
            <p>
              <strong>For Administrators:</strong> Admin accounts are restricted to authorized personnel 
              only. Unauthorized access to admin functions is strictly prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Medical Services Disclaimer</h2>
            <p>
              CareConnect is a platform that connects patients with healthcare providers. We do not 
              provide medical advice, diagnosis, or treatment. The content on this platform is for 
              informational purposes only and should not be considered medical advice.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any 
              questions you may have regarding a medical condition. Never disregard professional 
              medical advice or delay in seeking it because of something you have read on this platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of CareConnect, to understand our practices. By using CareConnect, you agree 
              to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Intellectual Property</h2>
            <p>
              All content, features, and functionality of CareConnect, including but not limited to 
              text, graphics, logos, and software, are the exclusive property of CareConnect and are 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any illegal purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Provide false or misleading information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use the platform to solicit medical advice in emergencies</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Appointment Booking and Cancellations</h2>
            <p>
              Patients may book appointments through the platform. Cancellations should be made at 
              least 24 hours in advance. Repeated no-shows or late cancellations may result in 
              account restrictions.
            </p>
            <p>
              Doctors may cancel appointments in case of emergencies. CareConnect is not liable for 
              any damages resulting from cancelled appointments.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              CareConnect shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of or inability to 
              access or use the service.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Termination</h2>
            <p>
              CareConnect reserves the right to terminate or suspend your account at any time, 
              without prior notice, for conduct that we believe violates these Terms of Service 
              or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which CareConnect operates, without regard to its conflict of law 
              provisions.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to Terms</h2>
            <p>
              CareConnect reserves the right to modify these terms at any time. We will notify users 
              of significant changes via email or through the platform. Your continued use of the 
              platform after such modifications constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@careconnect.com<br />
              <strong>Address:</strong> CareConnect Headquarters<br />
              Healthcare Technology District<br />
              San Francisco, CA 94102
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

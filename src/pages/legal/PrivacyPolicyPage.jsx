import { Link } from 'react-router-dom';
import Logo from '../../components/brand/Logo';
import BackToHomeButton from '../../components/shared/BackToHomeButton';

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <BackToHomeButton />
      
      <div className="legal-container">
        <div className="legal-header">
          <Logo size={48} />
          <h1>Privacy Policy</h1>
          <p>Last updated: August 2026</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              CareConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
              Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our healthcare platform. Please read this policy carefully.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Date of birth and gender</li>
              <li>Medical history and health information</li>
              <li>Insurance information</li>
              <li>Payment information for services</li>
              <li>Profile photos and identification documents</li>
            </ul>

            <h3>Doctor-Specific Information</h3>
            <p>For healthcare providers, we additionally collect:</p>
            <ul>
              <li>Medical license number and credentials</li>
              <li>Specialty and qualifications</li>
              <li>Hospital or clinic affiliation</li>
              <li>Years of experience</li>
              <li>Professional references</li>
              <li>Verification documents</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our platform:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website information</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To provide and maintain our healthcare platform services</li>
              <li>To facilitate appointment bookings and communications</li>
              <li>To verify doctor credentials and qualifications</li>
              <li>To process payments and insurance claims</li>
              <li>To send appointment reminders and healthcare notifications</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal obligations and healthcare regulations</li>
              <li>To prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing</h2>
            <p>We may share your information in the following circumstances:</p>

            <h3>With Healthcare Providers</h3>
            <p>
              We share relevant information with doctors you book appointments with to facilitate 
              your healthcare services. This includes your name, contact information, and relevant 
              medical history necessary for your care.
            </p>

            <h3>With Service Providers</h3>
            <p>
              We may share information with third-party service providers who perform services on 
              our behalf, such as payment processing, data hosting, and email delivery. These providers 
              are contractually obligated to protect your information.
            </p>

            <h3>For Legal Compliance</h3>
            <p>
              We may disclose your information when required by law or to protect our rights, property, 
              or safety, or that of our users or others.
            </p>

            <h3>Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be 
              transferred to the new owner.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information, 
              including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Compliance with HIPAA and healthcare data protection standards</li>
              <li>Limited access to personal health information (PHI)</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain uses of your information</li>
              <li><strong>Restriction:</strong> Request restriction of processing your information</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@careconnect.com. We will respond 
              within 30 days of your request.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Health Information (HIPAA)</h2>
            <p>
              CareConnect is designed to be HIPAA-compliant. Protected Health Information (PHI) is 
              handled with special care and only shared with authorized healthcare providers and 
              personnel who need it to provide care.
            </p>
            <p>
              We maintain Business Associate Agreements (BAAs) with all third parties who may access 
              PHI on our behalf.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect 
              personal information from children under 18. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience, analyze usage, and 
              personalize content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply 
              with legal obligations. Healthcare records are retained according to applicable medical 
              record retention laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with this Privacy Policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant 
              changes by posting the new policy on our platform and sending you an email. Your 
              continued use of the platform after such changes constitutes acceptance of the updated 
              policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Contact Information</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <p>
              <strong>Email:</strong> privacy@careconnect.com<br />
              <strong>Address:</strong> CareConnect Privacy Officer<br />
              Healthcare Technology District<br />
              San Francisco, CA 94102
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

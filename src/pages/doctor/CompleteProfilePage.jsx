import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import BackToHomeButton from '../../components/shared/BackToHomeButton';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const completeDoctorProfile = useAuthStore(state => state.completeDoctorProfile);
  const showToast = useUIStore(state => state.showToast);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [profileData, setProfileData] = useState({
    specialty: '',
    bio: '',
    hospital: '',
    yearsExperience: '',
    hourlyRate: '',
    medicalLicense: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.specialty || !profileData.medicalLicense || !profileData.hourlyRate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (loading) return;

    setLoading(true);
    setFormError('');

    try {
      
      await completeDoctorProfile({
        specialty: profileData.specialty,
        bio: profileData.bio,
        hospital_name: profileData.hospital,
        years_experience: parseInt(profileData.yearsExperience) || 0,
        hourly_rate: parseInt(profileData.hourlyRate) || 0,
        medical_license: profileData.medicalLicense,
      });

      showToast('Profile completed successfully!', 'success');
      navigate('/doctor/dashboard', { replace: true });
    } catch (error) {
      console.error('Profile completion error:', error);
      showToast(error.message || 'Failed to complete profile', 'error');
      setFormError(error.message || 'Failed to complete profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-dashboard-premium" style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div className="auth-nav-buttons" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <BackToHomeButton />
        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <span>Step 2 of 2: Practitioner Onboarding</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
            Complete Your Medical Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>
            Provide your verified clinical credentials so patients and administration can verify your practice
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {formError && (
            <div className="notification-widget slide-in-top" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)', border: '1px solid var(--danger-200)', borderRadius: '12px', padding: '1rem' }} role="alert">
              <div className="notification-icon" style={{ color: 'var(--danger-600)' }}>⚠️</div>
              <div className="notification-content">
                <div className="notification-title" style={{ fontWeight: 600 }}>Validation Error</div>
                <div className="notification-message">{formError}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Primary Medical Specialty <span style={{ color: 'var(--danger-500)' }}>*</span>
            </label>
            <select 
              value={profileData.specialty}
              onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
              required
              className="form-input"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-primary)' }}
            >
              <option value="">Select Primary Specialty</option>
              <option value="General Practice">General Practice</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
              <option value="Oncology">Oncology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Otolaryngology (ENT)">Otolaryngology (ENT)</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Anesthesiology">Anesthesiology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Surgery (General)">Surgery (General)</option>
              <option value="Urology">Urology</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Rheumatology">Rheumatology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Infectious Disease">Infectious Disease</option>
              <option value="Hematology">Hematology</option>
              <option value="Pathology">Pathology</option>
              <option value="Family Medicine">Family Medicine</option>
              <option value="Sports Medicine">Sports Medicine</option>
              <option value="Plastic Surgery">Plastic Surgery</option>
              <option value="Neurosurgery">Neurosurgery</option>
              <option value="Cardiothoracic Surgery">Cardiothoracic Surgery</option>
              <option value="Vascular Surgery">Vascular Surgery</option>
              <option value="Pediatric Surgery">Pediatric Surgery</option>
              <option value="Geriatrics">Geriatrics</option>
              <option value="Physical Medicine & Rehabilitation">Physical Medicine & Rehabilitation</option>
              <option value="Medical Genetics">Medical Genetics</option>
              <option value="Preventive Medicine">Preventive Medicine</option>
              <option value="Occupational Medicine">Occupational Medicine</option>
              <option value="Public Health">Public Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Hospital or Clinic Affiliation <span style={{ color: 'var(--danger-500)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Korle Bu Teaching Hospital or CareConnect Virtual Clinic"
              value={profileData.hospital}
              onChange={(e) => setProfileData({ ...profileData, hospital: e.target.value })}
              required
              className="form-input"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Years of Clinical Experience <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                placeholder="e.g. 8"
                value={profileData.yearsExperience}
                onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                required
                className="form-input"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Consultation Rate (GHS / hr) <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={profileData.hourlyRate}
                onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                required
                className="form-input"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Official Medical License Number <span style={{ color: 'var(--danger-500)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MD12345, GMC12345 or MED10001"
              value={profileData.medicalLicense}
              onChange={(e) => setProfileData({ ...profileData, medicalLicense: e.target.value })}
              required
              className="form-input"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
            />
            <small style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
              Format: Prefix + digits (e.g. MD12345). Verified against administrative medical registers.
            </small>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Clinical Biography & Areas of Practice
            </label>
            <textarea
              placeholder="Share your clinical background, areas of subspecialty, and treatment philosophy with patients..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              maxLength={500}
              rows={4}
              className="form-input"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{profileData.bio.length} / 500 characters</small>
            </div>
          </div>

          <div className="verification-notice" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--surface-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary-600)', flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your credentials will be reviewed by the CareConnect Medical Administration team within 24-48 hours. You will receive live status notifications on your dashboard.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Submitting Application...' : 'Complete Profile & Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}

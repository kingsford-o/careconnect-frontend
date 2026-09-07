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
    <div className="complete-profile-screen">
      <div className="auth-nav-buttons">
        <BackToHomeButton />
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <header>
        <h2>Complete Your Profile</h2>
        <p>Help patients get to know you better</p>
      </header>

      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="error-alert" role="alert">
            {formError}
          </div>
        )}
        <div className="form-group">
          <label>Specialty</label>
          <select 
            value={profileData.specialty}
            onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
            required
          >
            <option value="">Select Specialty</option>
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
          <label>Bio</label>
          <textarea
            placeholder="Tell patients about yourself..."
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            maxLength={500}
          />
          <small>{profileData.bio.length}/500</small>
        </div>

        <div className="form-group">
          <label>Hospital / Clinic</label>
          <input
            type="text"
            placeholder="Where do you work?"
            value={profileData.hospital}
            onChange={(e) => setProfileData({ ...profileData, hospital: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              min="1"
              value={profileData.yearsExperience}
              onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Hourly Rate (GHS)</label>
            <input
              type="number"
              min="0"
              value={profileData.hourlyRate}
              onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Medical License Number</label>
          <input
            type="text"
            placeholder="Enter your medical license number"
            value={profileData.medicalLicense}
            onChange={(e) => setProfileData({ ...profileData, medicalLicense: e.target.value })}
            required
          />
          <small className="form-hint">Your license will be verified by our admin team</small>
        </div>

        <div className="verification-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>Your medical license will be verified within 24-48 hours. You can still use the platform during verification.</p>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
}

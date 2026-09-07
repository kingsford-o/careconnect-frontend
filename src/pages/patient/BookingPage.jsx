import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/common/StatusBadge';

export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    consultationType: 'telehealth',
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoadingDoctor(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${doctorId}`);
      if (res.ok) {
        const data = await res.json();
        setDoctor(data);
      }
    } catch (err) {
      console.error('Error fetching doctor for booking:', err);
    } finally {
      setLoadingDoctor(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      setError('Please select an appointment date and time slot.');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            patientId: user?.id,
            doctorId,
            appointmentDate,
            reason: formData.reason,
            consultationType: formData.consultationType,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit appointment request');
      }

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 1800);
    } catch (err) {
      setError(err.message || 'An error occurred while booking');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = ['08:30', '09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00'];
  const doctorName = doctor?.users?.full_name || doctor?.name || 'Medical Specialist';
  const doctorSpecialty = doctor?.specialty || 'General Practitioner';
  const doctorHospital = doctor?.hospital_name || doctor?.hospital || 'CareConnect Clinic';
  const doctorRate = doctor?.hourly_rate || 100;

  return (
    <div className="patient-dashboard-premium booking-page-layout">
      {/* Header with Back Button */}
      <header className="dashboard-header mb-3">
        <button 
          type="button" 
          onClick={() => navigate(`/patient/doctors/${doctorId}`)}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          ← Back to Practitioner Profile
        </button>
      </header>

      <div className="booking-workflow-grid">
        {/* Left Column: Booking Form */}
        <div className="booking-form-column">
          <div className="booking-form-header">
            <h1 className="booking-title">Schedule Clinical Consultation</h1>
            <p className="booking-subtitle">
              Select your consultation format, date, and preferred time slot
            </p>
          </div>

          {success && (
            <div className="clinical-alert success mb-4" role="alert">
              <div className="alert-icon">✓</div>
              <div className="alert-body">
                <strong>Appointment Request Submitted!</strong>
                <p>Your request has been forwarded to Dr. {doctorName}. Redirecting to your schedule...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="clinical-alert danger mb-4" role="alert">
              <div className="alert-icon">✕</div>
              <div className="alert-body">
                <strong>Booking Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="clinical-booking-card">
            {/* Step 1: Format Selection */}
            <div className="booking-step-section">
              <label className="step-label">1. Consultation Format</label>
              <div className="consultation-format-selector">
                <button
                  type="button"
                  className={`format-option-card ${formData.consultationType === 'telehealth' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, consultationType: 'telehealth' })}
                >
                  <div className="format-icon">💻</div>
                  <div className="format-text">
                    <strong className="format-title">Telehealth Consultation</strong>
                    <span className="format-desc">Encrypted video appointment from home</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`format-option-card ${formData.consultationType === 'in-person' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, consultationType: 'in-person' })}
                >
                  <div className="format-icon">🏥</div>
                  <div className="format-text">
                    <strong className="format-title">In-Person Visit</strong>
                    <span className="format-desc">Attend clinic in person: {doctorHospital}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Date Picker */}
            <div className="booking-step-section">
              <label className="step-label" htmlFor="appointment-date-input">
                2. Select Date
              </label>
              <input
                id="appointment-date-input"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
                className="clinical-date-input"
              />
            </div>

            {/* Step 3: Time Slot Selector */}
            <div className="booking-step-section">
              <label className="step-label">3. Select Time Slot</label>
              <div className="slots-picker-grid">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`slot-chip-btn ${formData.time === time ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, time })}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Reason for Visit */}
            <div className="booking-step-section">
              <label className="step-label" htmlFor="visit-reason-input">
                4. Primary Reason for Visit <span className="optional-tag">(Optional)</span>
              </label>
              <textarea
                id="visit-reason-input"
                placeholder="Briefly describe your symptoms, health concerns, or goals for this consultation..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                maxLength={500}
                rows={3}
                className="clinical-textarea"
              />
              <span className="char-counter">{formData.reason.length}/500</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large w-full mt-2"
              disabled={submitting || !formData.date || !formData.time}
            >
              {submitting ? 'Submitting Request...' : 'Confirm & Request Consultation'}
            </button>
          </form>
        </div>

        {/* Right Column: Doctor & Summary Sidebar */}
        <aside className="booking-summary-column">
          <div className="booking-practitioner-card">
            <h3 className="sidebar-section-title">Selected Practitioner</h3>
            {loadingDoctor ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading practitioner info...</p>
            ) : doctor ? (
              <div className="sidebar-doc-details">
                <div className="sidebar-doc-avatar">
                  {doctor.users?.profile_image_url || doctor.profile_image_url ? (
                    <img src={doctor.users?.profile_image_url || doctor.profile_image_url} alt={doctorName} />
                  ) : (
                    <span>🩺</span>
                  )}
                </div>
                <div>
                  <h4 className="sidebar-doc-name">Dr. {doctorName}</h4>
                  <p className="sidebar-doc-spec">{doctorSpecialty}</p>
                  <p className="sidebar-doc-hosp">{doctorHospital}</p>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Practitioner details unavailable</p>
            )}

            <hr className="divider-line" />

            <h3 className="sidebar-section-title">Consultation Summary</h3>
            <div className="summary-data-rows">
              <div className="summary-row">
                <span className="summary-k">Date:</span>
                <span className="summary-v">{formData.date || 'Not selected'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-k">Time:</span>
                <span className="summary-v">{formData.time || 'Not selected'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-k">Format:</span>
                <span className="summary-v">
                  <StatusBadge status={formData.consultationType} />
                </span>
              </div>
              <div className="summary-row total-fee-row">
                <span className="summary-k">Consultation Fee:</span>
                <span className="summary-v fee-accent">GHS {doctorRate}</span>
              </div>
            </div>

            <div className="booking-guarantee-note">
              🔒 Patient privacy and medical records are strictly protected under clinical data protocols.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


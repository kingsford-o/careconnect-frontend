import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function DoctorDetailPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
    fetchReviews();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/doctors/${doctorId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch doctor: ${response.status}`);
      }
      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ratings/${doctorId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  if (loading) {
    return (
      <div className="patient-dashboard-premium">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading practitioner profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="patient-dashboard-premium">
        <EmptyState
          variant="doctors"
          title="Doctor Not Found"
          description="The requested practitioner profile could not be retrieved."
          action="Back to Directory"
          onAction={() => navigate('/patient/doctors')}
        />
      </div>
    );
  }

  const doctorName = doctor.users?.full_name || doctor.name || 'Medical Specialist';
  const doctorAvatar = doctor.users?.profile_image_url || doctor.profile_image_url;
  const specialty = doctor.specialty || 'General Practitioner';
  const hospital = doctor.hospital_name || doctor.hospital || 'CareConnect Affiliated Clinic';
  const experience = doctor.years_experience || 0;
  const rate = doctor.hourly_rate || 100;
  const license = doctor.medical_license || 'Verified License';
  const bio = doctor.bio || 'Experienced healthcare professional dedicated to providing comprehensive and patient-centered clinical care.';
  const ratingValue = doctor.average_rating ? Number(doctor.average_rating).toFixed(1) : null;
  const totalConsults = doctor.total_consultations || reviews.length || 0;

  return (
    <div className="patient-dashboard-premium doctor-detail-page">
      {/* Navigation Header */}
      <header className="dashboard-header mb-3">
        <button 
          type="button" 
          onClick={() => navigate('/patient/doctors')}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          ← Back to Specialists
        </button>
      </header>

      <div className="doctor-detail-layout">
        {/* Main Content Column */}
        <div className="doctor-detail-main">
          {/* Hero Card */}
          <div className="doctor-hero-card">
            <div className="doctor-hero-header">
              <div className="doctor-detail-avatar-wrapper">
                {doctorAvatar ? (
                  <img src={doctorAvatar} alt={doctorName} className="doctor-detail-avatar-img" />
                ) : (
                  <div className="doctor-detail-avatar-fallback">
                    {doctorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="verified-badge-icon" title="Admin Verified Doctor">✓</div>
              </div>

              <div className="doctor-detail-intro">
                <div className="d-flex align-center gap-2 mb-1 flex-wrap">
                  <span className="portal-badge-sm">
                    <span className="live-dot"></span>
                    Verified Practitioner
                  </span>
                  <StatusBadge status={doctor.verification_status || 'approved'} />
                </div>
                <h1 className="doctor-detail-title">Dr. {doctorName}</h1>
                <p className="doctor-detail-specialty">{specialty}</p>
                <p className="doctor-detail-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.35rem', verticalAlign: '-2px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {hospital}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="doctor-detail-stats-grid">
              <div className="detail-stat-item">
                <span className="detail-stat-label">Rating</span>
                <span className="detail-stat-val">
                  {ratingValue ? `⭐ ${ratingValue}` : '⭐ New'}
                </span>
                <span className="detail-stat-sub">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
              </div>

              <div className="detail-stat-item">
                <span className="detail-stat-label">Experience</span>
                <span className="detail-stat-val">{experience} Years</span>
                <span className="detail-stat-sub">Clinical Practice</span>
              </div>

              <div className="detail-stat-item">
                <span className="detail-stat-label">Consultation Fee</span>
                <span className="detail-stat-val" style={{ color: 'var(--primary-600)' }}>GHS {rate}</span>
                <span className="detail-stat-sub">Per session</span>
              </div>

              <div className="detail-stat-item">
                <span className="detail-stat-label">Consultations</span>
                <span className="detail-stat-val">{totalConsults}</span>
                <span className="detail-stat-sub">Completed</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="detail-section-card">
            <h2 className="detail-card-heading">About Practitioner</h2>
            <p className="detail-bio-text">{bio}</p>
          </div>

          {/* Verified Credentials */}
          <div className="detail-section-card">
            <h2 className="detail-card-heading">Medical Credentials & Registration</h2>
            <div className="credentials-list-grid">
              <div className="credential-box">
                <span className="credential-label">Medical License Number</span>
                <span className="credential-code">{license}</span>
                <span className="credential-status">Verified by Medical Board</span>
              </div>
              <div className="credential-box">
                <span className="credential-label">Primary Specialization</span>
                <span className="credential-code">{specialty}</span>
                <span className="credential-status">Board Certified</span>
              </div>
              <div className="credential-box">
                <span className="credential-label">Primary Medical Facility</span>
                <span className="credential-code">{hospital}</span>
                <span className="credential-status">Clinical Staff Member</span>
              </div>
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="detail-section-card">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h2 className="detail-card-heading" style={{ margin: 0 }}>
                Patient Feedback ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="empty-reviews-box">
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  No patient reviews submitted yet for Dr. {doctorName}. Be the first to leave feedback after your appointment.
                </p>
              </div>
            ) : (
              <div className="reviews-feed">
                {reviews.map(review => (
                  <div key={review.id} className="review-card-item">
                    <div className="review-card-top">
                      <div className="review-stars-display">
                        {'★'.repeat(review.stars || 5)}{'☆'.repeat(Math.max(0, 5 - (review.stars || 5)))}
                      </div>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="review-comment-text">{review.review || 'No written comments provided.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Consultation Sidebar / CTA */}
        <aside className="doctor-detail-sidebar">
          <div className="booking-summary-card">
            <h3 className="booking-sidebar-title">Book Consultation</h3>
            <p className="booking-sidebar-subtitle">
              Schedule a private telehealth or in-clinic appointment with Dr. {doctorName}
            </p>

            <div className="booking-fee-row">
              <span>Standard Consultation</span>
              <strong>GHS {rate}</strong>
            </div>

            <div className="booking-feature-list">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>Secure Telehealth Video & In-Person options</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>Direct practitioner confirmation</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>Medical appointment reminders</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary btn-large w-full mt-3"
              onClick={() => navigate(`/patient/book/${doctorId}`)}
            >
              Book Appointment Now
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}


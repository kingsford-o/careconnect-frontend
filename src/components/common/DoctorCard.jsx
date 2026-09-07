import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ doctor, onViewProfile }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onViewProfile) {
      onViewProfile();
    } else {
      navigate(`/patient/doctors/${doctor.id}`);
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    navigate(`/patient/book/${doctor.id}`);
  };

  const specialties = doctor.specialty
    ? doctor.specialty.split(',').map(s => s.trim()).filter(Boolean)
    : ['General Practice'];

  const rating = doctor.average_rating ? Number(doctor.average_rating).toFixed(1) : null;
  const consultations = doctor.total_consultations || 0;
  const experienceYears = doctor.years_experience || 0;

  return (
    <div className="doctor-card-modern" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="doctor-card-top">
        <div className="doctor-avatar-container">
          {doctor.profile_image_url ? (
            <img
              src={doctor.profile_image_url}
              alt={`Dr. ${doctor.name || 'Doctor'}`}
              className="doctor-avatar-img"
            />
          ) : (
            <div className="doctor-avatar-initials">
              {(doctor.name || 'D').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="doctor-verified-tag" title="Verified Practitioner">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Verified
          </span>
        </div>

        <div className="doctor-primary-info">
          <h3 className="doctor-title">Dr. {doctor.name || 'Practitioner'}</h3>
          <div className="doctor-specialty-tags">
            {specialties.slice(0, 2).map((specialty, idx) => (
              <span key={idx} className="specialty-pill">{specialty}</span>
            ))}
            {specialties.length > 2 && (
              <span className="specialty-pill-more">+{specialties.length - 2}</span>
            )}
          </div>
          {doctor.hospital_name && (
            <p className="doctor-hospital-name">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{doctor.hospital_name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="doctor-card-metrics">
        <div className="metric-chip">
          <span className="metric-label">Experience</span>
          <span className="metric-value">{experienceYears} {experienceYears === 1 ? 'yr' : 'yrs'}</span>
        </div>
        <div className="metric-chip">
          <span className="metric-label">Rating</span>
          <span className="metric-value">
            {rating ? `★ ${rating}` : 'New'}
            {consultations > 0 && <small className="metric-sub">({consultations})</small>}
          </span>
        </div>
        <div className="metric-chip">
          <span className="metric-label">Consultation</span>
          <span className="metric-value">GHS {doctor.hourly_rate || 0}</span>
        </div>
      </div>

      <div className="doctor-card-bottom">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleCardClick}
        >
          View Profile
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleBookClick}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}


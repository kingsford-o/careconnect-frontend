import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DoctorCard from '../../components/common/DoctorCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }
    fetchFeaturedDoctors();
    fetchAppointments();

    const handleRefresh = () => {
      fetchFeaturedDoctors();
      fetchAppointments();
    };

    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user, isAuthenticated]);

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors?limit=6`);
      const data = await response.json();
      const doctorsArray = Array.isArray(data) ? data : [];
      setDoctors(doctorsArray);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${user.id}/patient`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }
      );
      const data = await response.json();
      const appointmentsArray = Array.isArray(data) ? data : [];
      setAppointments(appointmentsArray);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    }
  };

  // Filter upcoming & completed
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const nextAppointment = upcomingAppointments[0];

  const uniqueDoctorsCount = new Set(
    appointments.map(apt => apt.doctor_id?.id || apt.doctor_id).filter(Boolean)
  ).size;

  if (!user || !isAuthenticated) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading your health dashboard...</p>
      </div>
    );
  }

  if (error && doctors.length === 0 && appointments.length === 0) {
    return (
      <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-600)', marginBottom: '1rem' }}>{error}</p>
        <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="patient-dashboard-premium">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="portal-badge-sm">
              <span className="live-dot"></span>
              Patient Portal
            </div>
            <h1 className="dashboard-title">
              {greeting}, {firstName}
            </h1>
            <p className="dashboard-subtitle">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => navigate('/patient/profile')} 
            className="profile-button"
            aria-label="View Profile"
          >
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt={user.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : user.avatar ? (
              <span className="profile-avatar-display">{user.avatar}</span>
            ) : (
              <div className="profile-avatar-placeholder">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Next Upcoming Appointment Banner (If available) */}
      {nextAppointment && (
        <section className="next-appointment-banner">
          <div className="next-apt-card">
            <div className="next-apt-badge">
              <span className="clock-icon">🕒</span> Next Consultation
            </div>
            <div className="next-apt-body">
              <div className="next-apt-doctor">
                <div className="doc-avatar-sm">
                  {nextAppointment.doctor_id?.users?.profile_image_url ? (
                    <img src={nextAppointment.doctor_id.users.profile_image_url} alt="Doctor" />
                  ) : (
                    <span>🩺</span>
                  )}
                </div>
                <div>
                  <h3 className="doc-name">
                    Dr. {nextAppointment.doctor_id?.users?.full_name || 'Assigned Specialist'}
                  </h3>
                  <p className="doc-meta">
                    {nextAppointment.doctor_id?.specialty || 'Healthcare Provider'} • {nextAppointment.doctor_id?.hospital_name || 'CareConnect Clinic'}
                  </p>
                </div>
              </div>

              <div className="next-apt-schedule">
                <div className="schedule-item">
                  <span className="schedule-label">Date & Time</span>
                  <span className="schedule-val">
                    {new Date(nextAppointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(nextAppointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Format</span>
                  <StatusBadge status={nextAppointment.consultation_type || 'telehealth'} />
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Status</span>
                  <StatusBadge status={nextAppointment.status} />
                </div>
              </div>

              <div className="next-apt-actions">
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/patient/appointments')}
                >
                  Manage Booking
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Clinical Metrics Snapshot */}
      <section className="health-snapshot">
        <div className="snapshot-grid">
          <div className="snapshot-card">
            <div className="card-icon appointments">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-label">Upcoming Appointments</div>
              <div className="card-value">{upcomingAppointments.length}</div>
              <div className="card-sub">Scheduled consultations</div>
            </div>
          </div>

          <div className="snapshot-card">
            <div className="card-icon messages">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-label">Completed Consults</div>
              <div className="card-value">{completedAppointments.length}</div>
              <div className="card-sub">Past medical visits</div>
            </div>
          </div>

          <div className="snapshot-card">
            <div className="card-icon medications">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-label">Care Team</div>
              <div className="card-value">{uniqueDoctorsCount}</div>
              <div className="card-sub">Consulted doctors</div>
            </div>
          </div>

          <div className="snapshot-card">
            <div className="card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-label">Account Status</div>
              <div className="card-value" style={{ fontSize: '1.25rem', color: 'var(--success-600)' }}>Active & Verified</div>
              <div className="card-sub">Standard patient profile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="quick-actions-section">
        <div className="section-header">
          <h2>Care Hub Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <button type="button" onClick={() => navigate('/patient/doctors')} className="quick-action-card">
            <div className="action-icon search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="action-content">
              <h3>Find a Specialist</h3>
              <p>Browse verified practitioners</p>
            </div>
            <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button type="button" onClick={() => navigate('/patient/appointments')} className="quick-action-card">
            <div className="action-icon calendar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="action-content">
              <h3>Appointments</h3>
              <p>View schedule & history</p>
            </div>
            <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button type="button" onClick={() => navigate('/patient/profile')} className="quick-action-card">
            <div className="action-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="action-content">
              <h3>My Health Profile</h3>
              <p>Account details & settings</p>
            </div>
            <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Verified Doctors Spotlight */}
      <section className="featured-doctors-section">
        <div className="section-header">
          <div>
            <h2>Verified Specialists</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Certified healthcare professionals available for booking
            </p>
          </div>
          <button type="button" onClick={() => navigate('/patient/doctors')} className="view-all-btn">
            Explore All Doctors
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading medical specialists...</p>
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            variant="doctors"
            title="No specialists available yet"
            description="Our medical network is currently expanding. Check back shortly."
            action="Refresh Directory"
            onAction={() => fetchFeaturedDoctors()}
          />
        ) : (
          <div className="doctors-grid-premium">
            {doctors.map(doctor => (
              <DoctorCard 
                key={doctor.id}
                doctor={doctor}
                onViewProfile={() => navigate(`/patient/doctors/${doctor.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity Timeline */}
      <section className="activity-section">
        <div className="section-header">
          <h2>Recent Care Activity</h2>
        </div>
        {appointments.length === 0 ? (
          <EmptyState
            variant="messages"
            title="No activity recorded"
            description="Your consultation history and updates will appear here."
            size="small"
          />
        ) : (
          <div className="activity-list">
            {appointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="activity-item">
                <div className={`activity-indicator ${apt.status === 'completed' ? 'completed' : apt.status === 'confirmed' ? 'reminder' : 'upcoming'}`} />
                <div className="activity-content">
                  <p>
                    <strong>Consultation with Dr. {apt.doctor_id?.users?.full_name || 'Specialist'}</strong>
                    <span style={{ marginLeft: '0.5rem' }}>
                      <StatusBadge status={apt.status} />
                    </span>
                  </p>
                  <small>
                    {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {apt.consultation_type || 'Telehealth'}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


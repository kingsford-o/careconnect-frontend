import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const showModal = useUIStore(state => state.showModal);
  const showToast = useUIStore(state => state.showToast);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchAppointments();
    const handleRefresh = () => fetchAppointments();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${user.id}/patient`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed'
  ).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const completedAppointments = appointments.filter(
    apt => apt.status === 'completed'
  ).sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  const cancelledAppointments = appointments.filter(
    apt => apt.status === 'cancelled' || apt.status === 'declined'
  ).sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  const displayAppointments = activeTab === 'upcoming' 
    ? upcomingAppointments 
    : activeTab === 'completed'
    ? completedAppointments
    : cancelledAppointments;

  const handleCancel = (appointmentId) => {
    showModal(
      <ConfirmDialog
        title="Cancel Clinical Appointment"
        message="Are you sure you want to cancel this consultation? This action will notify your practitioner and release the reserved time slot."
        confirmText="Confirm Cancellation"
        cancelText="Keep Appointment"
        onConfirm={async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({ status: 'cancelled' }),
              }
            );
            if (!response.ok) throw new Error('Cancellation failed');
            
            showToast('Appointment cancelled successfully', 'success');
            fetchAppointments();
          } catch (error) {
            showToast(error.message || 'Error cancelling appointment', 'error');
          }
        }}
        variant="danger"
      />
    );
  };

  const handleReschedule = (appointmentId) => {
    navigate(`/patient/reschedule/${appointmentId}`);
  };

  return (
    <div className="patient-dashboard-premium appointments-page-premium">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              type="button" 
              onClick={() => navigate('/patient/home')}
              className="btn btn-outline btn-sm mb-2"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
            >
              ← Back to Dashboard
            </button>
            <h1 className="dashboard-title">Clinical Appointments</h1>
            <p className="dashboard-subtitle">
              Manage your upcoming consultations, past visits, and medical records
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => navigate('/patient/doctors')}
            className="btn btn-primary"
          >
            + New Appointment
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-premium mb-4">
        <button
          type="button"
          className={`tab-premium ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming & Pending ({upcomingAppointments.length})
        </button>
        <button
          type="button"
          className={`tab-premium ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedAppointments.length})
        </button>
        <button
          type="button"
          className={`tab-premium ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled & Declined ({cancelledAppointments.length})
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your appointments schedule...</p>
        </div>
      ) : displayAppointments.length === 0 ? (
        <EmptyState
          variant="appointments"
          title={`No ${activeTab} appointments`}
          description={
            activeTab === 'upcoming' 
              ? "You do not have any pending or confirmed appointments at this time." 
              : activeTab === 'completed'
              ? "No completed medical consultations recorded yet."
              : "No cancelled or declined appointments in your history."
          }
          action="Find a Specialist"
          onAction={() => navigate('/patient/doctors')}
        />
      ) : (
        <div className="appointments-list-premium">
          {displayAppointments.map((apt) => {
            const doctorObj = apt.doctor_id || {};
            const docName = doctorObj.users?.full_name || apt.doctor_name || 'Medical Specialist';
            const docAvatar = doctorObj.users?.profile_image_url;
            const specialty = doctorObj.specialty || apt.specialty || 'General Practice';
            const hospital = doctorObj.hospital_name || doctorObj.hospital || 'CareConnect Clinic';
            const aptDate = new Date(apt.appointment_date);

            return (
              <div key={apt.id} className="appointment-card-premium">
                <div className="appointment-header-premium">
                  <div className="appointment-doctor">
                    <div className="doctor-avatar">
                      {docAvatar ? (
                        <img src={docAvatar} alt={docName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span>{docName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="heading-4">Dr. {docName}</h3>
                      <p className="body-sm">{specialty} • {hospital}</p>
                    </div>
                  </div>
                  <div className="d-flex align-center gap-2">
                    <StatusBadge status={apt.consultation_type || 'telehealth'} />
                    <StatusBadge status={apt.status} />
                  </div>
                </div>

                {apt.reason && (
                  <div className="appointment-reason-box" style={{ background: 'var(--surface-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Reason for Consultation:</span>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{apt.reason}</p>
                  </div>
                )}

                <div className="appointment-details-premium">
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="body-sm">{aptDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="body-sm">{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="body-sm">{apt.consultation_type === 'telehealth' ? 'Virtual Video Consultation' : hospital}</span>
                  </div>
                </div>

                <div className="appointment-actions-premium">
                  {apt.status === 'confirmed' && (
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      onClick={() => showToast('Opening video call portal...', 'info')}
                    >
                      Join Consultation Room
                    </button>
                  )}

                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleReschedule(apt.id)}
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger-600)', borderColor: 'var(--danger-300)' }}
                        onClick={() => handleCancel(apt.id)}
                      >
                        Cancel Consultation
                      </button>
                    </>
                  )}

                  {apt.status === 'completed' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/patient/review/${apt.id}`)}
                      >
                        Rate & Review Specialist
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/patient/book/${doctorObj.id || apt.doctor_id}`)}
                      >
                        Book Follow-up
                      </button>
                    </>
                  )}

                  {(apt.status === 'cancelled' || apt.status === 'declined') && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/patient/book/${doctorObj.id || apt.doctor_id}`)}
                    >
                      Re-book Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


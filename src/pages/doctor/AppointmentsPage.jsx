import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import EmptyState from '../../components/common/EmptyState';
import AppointmentResponseModal from '../../components/common/AppointmentResponseModal';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const showModal = useUIStore(state => state.showModal);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    const handleRefresh = () => fetchAppointments();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${user.id}/doctor`,
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
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed'
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'declined'
  );

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const handleConfirm = async (appointmentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({ status: 'confirmed' }),
        }
      );

      if (response.ok) {
        setNotification({ type: 'success', message: 'Appointment confirmed! Patient notified.' });
        fetchAppointments();
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  const handleReschedule = async (appointmentId, newDate, newTime) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({ 
            status: 'confirmed',
            appointment_date: `${newDate}T${newTime}:00`
          }),
        }
      );

      if (response.ok) {
        setNotification({ type: 'success', message: 'Appointment rescheduled! Patient notified.' });
        fetchAppointments();
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  const handleOpenResponseModal = (appointment) => {
    setSelectedAppointment(appointment);
    showModal(
      <AppointmentResponseModal
        appointment={appointment}
        onAccept={handleConfirm}
        onReschedule={handleReschedule}
        onDecline={handleDecline}
        onClose={() => setSelectedAppointment(null)}
      />
    );
  };

  const handleDecline = async (appointmentId, reason) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({ status: 'declined', reason }),
        }
      );

      if (response.ok) {
        setNotification({ type: 'success', message: 'Appointment declined. Patient notified.' });
        fetchAppointments();
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'var(--success-600)';
      case 'pending': return 'var(--warning-600)';
      case 'cancelled': return 'var(--danger-600)';
      case 'declined': return 'var(--danger-600)';
      case 'completed': return 'var(--primary-600)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'confirmed': return 'var(--success-50)';
      case 'pending': return 'var(--warning-50)';
      case 'cancelled': return 'var(--danger-50)';
      case 'declined': return 'var(--danger-50)';
      case 'completed': return 'var(--primary-50)';
      default: return 'var(--surface-tertiary)';
    }
  };

  return (
    <div className="appointments-page-premium">
      <div className="appointments-header">
        <h1 className="display-md">Appointments</h1>
        <p className="body-base">Manage your patient appointments and schedule</p>
      </div>

      {notification.message && (
        <div className="notification-widget slide-in-top" style={{ background: notification.type === 'success' ? 'var(--success-50)' : 'var(--danger-50)', color: notification.type === 'success' ? 'var(--success-600)' : 'var(--danger-600)' }}>
          <div className="notification-icon">{notification.type === 'success' ? '✓' : '✕'}</div>
          <div className="notification-content">
            <div className="notification-title">{notification.type === 'success' ? 'Success' : 'Error'}</div>
            <div className="notification-message">{notification.message}</div>
          </div>
        </div>
      )}

      <div className="tabs-premium">
        <button
          type="button"
          className={`tab-premium ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
        <button
          type="button"
          className={`tab-premium ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastAppointments.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="skeleton skeleton-card"></div>
        </div>
      ) : displayAppointments.length === 0 ? (
        <EmptyState
          variant="appointments"
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming' ? "You don't have any upcoming appointments." : "You don't have any past appointments yet."}
        />
      ) : (
        <div className="appointments-list-premium stagger-children">
          {displayAppointments.map((apt, index) => (
            <div key={apt.id} className="appointment-card-premium fade-in-up">
              <div className="appointment-header-premium">
                <div className="appointment-doctor">
                  <div className="doctor-avatar">
                    {apt.patient_id?.users?.full_name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="heading-4">{apt.patient_id?.users?.full_name || apt.patient_name}</h3>
                    <p className="body-sm">{new Date(apt.appointment_date).toLocaleDateString()} at {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span 
                  className="status-badge"
                  style={{ 
                    background: getStatusBg(apt.status), 
                    color: getStatusColor(apt.status) 
                  }}
                >
                  {apt.status.toUpperCase()}
                </span>
              </div>

              <div className="appointment-details-premium">
                <div className="detail-item">
                  {apt.consultation_type === 'telehealth' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  )}
                  <span className="body-sm">{apt.consultation_type === 'telehealth' ? 'Telehealth' : 'In-Person'}</span>
                </div>
                {apt.reason_for_visit && (
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span className="body-sm">Reason: {apt.reason_for_visit}</span>
                  </div>
                )}
              </div>

              <div className="appointment-actions-premium">
                {apt.status === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleOpenResponseModal(apt)}
                  >
                    Respond to Request
                  </button>
                )}
                {apt.status === 'confirmed' && (
                  <>
                    {apt.consultation_type === 'telehealth' && (
                      <button type="button" className="btn btn-primary">Start Call</button>
                    )}
                    <button type="button" className="btn btn-outline">Details</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

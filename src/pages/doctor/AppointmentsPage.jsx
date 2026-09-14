import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import AppointmentResponseModal from '../../components/common/AppointmentResponseModal';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DoctorAppointmentsPage() {
  const user = useAuthStore(state => state.user);
  const showModal = useUIStore(state => state.showModal);
  const showToast = useUIStore(state => state.showToast);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    const handleRefresh = () => fetchAppointments();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user]);

  const fetchAppointments = async () => {
    if (!user?.id) return;
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
        showToast('Appointment confirmed! Patient notified in real-time.', 'success');
        fetchAppointments();
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to confirm appointment', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Network error', 'error');
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
        showToast('Appointment rescheduled! Patient notified in real-time.', 'success');
        fetchAppointments();
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to reschedule appointment', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Network error', 'error');
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
          body: JSON.stringify({ status: 'declined', reason: reason || 'Doctor unavailable' }),
        }
      );

      if (response.ok) {
        showToast('Appointment declined. Patient notified.', 'info');
        fetchAppointments();
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to decline appointment', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Network error', 'error');
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'rescheduled'
  );

  const completedAppointments = appointments.filter(
    apt => apt.status === 'completed'
  );

  const cancelledAppointments = appointments.filter(
    apt => apt.status === 'cancelled' || apt.status === 'declined'
  );

  const getFilteredList = () => {
    let list = [];
    if (activeTab === 'upcoming') list = upcomingAppointments;
    else if (activeTab === 'completed') list = completedAppointments;
    else list = cancelledAppointments;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(apt => {
      const patientName = (apt.patient_id?.users?.full_name || apt.patient_name || '').toLowerCase();
      const reason = (apt.reason_for_visit || '').toLowerCase();
      const type = (apt.consultation_type || '').toLowerCase();
      return patientName.includes(q) || reason.includes(q) || type.includes(q);
    });
  };

  const displayAppointments = getFilteredList();

  return (
    <div className="appointments-page-premium">
      <div className="appointments-header">
        <div>
          <h1 className="display-md">Appointments Schedule</h1>
          <p className="body-base">Review booking requests, schedule consultations, and manage your patient roster</p>
        </div>
      </div>

      <div className="appointments-toolbar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div className="tabs-premium" style={{ marginBottom: 0 }}>
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

        <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search patient, reason, or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="skeleton skeleton-card" style={{ height: '140px', marginBottom: '1rem' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '140px' }}></div>
        </div>
      ) : displayAppointments.length === 0 ? (
        <EmptyState
          variant="appointments"
          title={`No ${activeTab} appointments`}
          description={
            searchQuery.trim()
              ? `No appointments match "${searchQuery}".`
              : activeTab === 'upcoming'
              ? "You don't have any pending or upcoming appointments right now."
              : activeTab === 'completed'
              ? "No completed consultations recorded yet."
              : "No cancelled or declined appointments."
          }
        />
      ) : (
        <div className="appointments-list-premium stagger-children">
          {displayAppointments.map((apt) => (
            <div key={apt.id} className="appointment-card-premium fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
              <div className="appointment-header-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="appointment-doctor" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="doctor-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1.25rem' }}>
                    {apt.patient_id?.users?.full_name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="heading-4" style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                      {apt.patient_id?.users?.full_name || apt.patient_name || 'Patient'}
                    </h3>
                    <p className="body-sm" style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
                      {new Date(apt.appointment_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              <div className="appointment-details-premium" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', background: 'var(--surface-secondary)', borderRadius: '12px' }}>
                <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {apt.consultation_type === 'telehealth' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary-600)' }}>
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary-600)' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  )}
                  <span style={{ fontWeight: 500 }}>{apt.consultation_type === 'telehealth' ? 'Telehealth Consultation' : 'In-Person Consultation'}</span>
                </div>
                {apt.reason_for_visit && (
                  <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span><strong>Reason:</strong> {apt.reason_for_visit}</span>
                  </div>
                )}
              </div>

              <div className="appointment-actions-premium" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                {apt.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleConfirm(apt.id)}
                    >
                      Confirm Appointment
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleOpenResponseModal(apt)}
                    >
                      Reschedule / Decline
                    </button>
                  </>
                )}
                {apt.status === 'confirmed' && (
                  <>
                    {apt.consultation_type === 'telehealth' && (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => showToast('Connecting to secure clinical video channel...', 'info')}
                      >
                        Start Telehealth Call
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleOpenResponseModal(apt)}
                    >
                      Reschedule
                    </button>
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


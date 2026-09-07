import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import EmptyState from '../../components/common/EmptyState';
import VerificationStatus from '../../components/doctor/VerificationStatus';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const doctorProfile = useAuthStore(state => state.doctorProfile);
  const profileComplete = useAuthStore(state => state.profileComplete);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    thisWeekAppointments: 0,
    rating: 0,
    completionRate: 0,
    totalPatients: 0,
    availability: 'Available',
    weeklyRevenue: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [isAvailable, setIsAvailable] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [patients, setPatients] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);


  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }
    // Check if doctor profile is complete, redirect if not
    if (user?.role === 'doctor' && !profileComplete) {
      navigate('/doctor/complete-profile');
      return;
    }
    fetchDashboardData();
    fetchVerificationStatus();
    const handleRefresh = () => {
      fetchDashboardData();
      fetchVerificationStatus();
    };
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [profileComplete, user, isAuthenticated, navigate]);

  const fetchVerificationStatus = async () => {
    if (!doctorProfile?.id) {
      console.error('No doctor profile ID available');
      return;
    }
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${doctorProfile.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data.verification_status || 'pending');
        setRejectionReason(data.rejection_reason || null);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!user?.id) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${user.id}/doctor`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }
      );
      const appointments = await response.json();
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];

      const today = new Date().toDateString();
      const thisWeekStart = new Date();
      thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

      const todayApts = appointmentsArray.filter(
        apt => new Date(apt.appointment_date).toDateString() === today
      );

      const thisWeekApts = appointmentsArray.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate >= thisWeekStart;
      });

      const completedApts = appointmentsArray.filter(apt => apt.status === 'completed');
      const completionRate = appointmentsArray.length > 0 
        ? Math.round((completedApts.length / appointmentsArray.length) * 100)
        : 0;

      // Calculate unique patients from appointments
      const uniquePatients = new Set(appointmentsArray.map(apt => apt.patient_id)).size;

      setStats({
        todayAppointments: todayApts.length,
        thisWeekAppointments: thisWeekApts.length,
        rating: 0, // Will be fetched from ratings API
        completionRate,
        totalPatients: uniquePatients,
        availability: 'Available',
        weeklyRevenue: 0, // Will be calculated from completed appointments
      });

      setTodayAppointments(todayApts.sort((a, b) => 
        new Date(a.appointment_date) - new Date(b.appointment_date)
      ));

      // Create activity items from appointments
      if (appointmentsArray.length > 0) {
        const appointmentActivities = appointmentsArray.slice(0, 3).map(apt => ({
          type: apt.status === 'completed' ? 'completed' : apt.status === 'pending' ? 'appointment' : 'message',
          title: apt.status === 'completed' ? 'Appointment completed' : 'New appointment booked',
          sub: `${apt.patient_id?.users?.full_name || 'Patient'} - ${apt.consultation_type}`,
          time: apt.status === 'completed' ? 'Recently' : 'Just now'
        }));
        setRecentActivity(appointmentActivities);
      }

      // Extract unique patients from appointments
      const uniquePatientsMap = new Map();
      appointmentsArray.forEach(apt => {
        if (apt.patient_id && apt.patient_id.users) {
          const patientId = apt.patient_id.id;
          if (!uniquePatientsMap.has(patientId)) {
            uniquePatientsMap.set(patientId, {
              id: patientId,
              name: apt.patient_id.users.full_name || 'Patient',
              email: apt.patient_id.users.email || '',
              lastAppointment: apt.appointment_date,
              consultationType: apt.consultation_type,
              status: apt.status
            });
          } else {
            // Update with most recent appointment
            const existing = uniquePatientsMap.get(patientId);
            if (new Date(apt.appointment_date) > new Date(existing.lastAppointment)) {
              uniquePatientsMap.set(patientId, {
                ...existing,
                lastAppointment: apt.appointment_date,
                consultationType: apt.consultation_type,
                status: apt.status
              });
            }
          }
        }
      });
      setPatients(Array.from(uniquePatientsMap.values()).sort((a, b) => 
        new Date(b.lastAppointment) - new Date(a.lastAppointment)
      ));
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setTodayAppointments([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appointmentId) => {
    setActionLoading(appointmentId);
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
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({ status: 'declined' }),
        }
      );

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error declining appointment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    setStats(prev => ({ ...prev, availability: isAvailable ? 'Unavailable' : 'Available' }));
  };

  // Show loading state if user data is not available
  if (!user || !isAuthenticated) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Show error state if API fetch failed
  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', textAlign: 'center' }}>
        <h2>Data Fetch Error</h2>
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '10px 20px' }}>
          Retry
        </button>
      </div>
    );
  }

  try {
    return (
      <div className="doctor-dashboard-premium">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, Dr. {user.full_name?.split(' ')[1] || user.full_name}
          </p>
        </div>
        <button type="button" onClick={() => navigate('/doctor/profile')} className="profile-button">
          {user.avatar ? (
            <span className="profile-avatar-display">{user.avatar}</span>
          ) : (
            <div className="profile-avatar-placeholder">
              {user.full_name?.charAt(0) || 'D'}
            </div>
          )}
        </button>
      </header>

      {/* Verification Status */}
      <section className="verification-section">
        <VerificationStatus 
          status={verificationStatus} 
          rejectionReason={rejectionReason} 
        />
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">{stats.todayAppointments}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{stats.totalPatients}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Completion Rate</div>
              <div className="stat-value">{stats.completionRate}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Appointments */}
      <section className="appointments-section">
        <div className="section-header">
          <h2>Today's Appointments</h2>
          <button type="button" onClick={() => navigate('/doctor/appointments')} className="view-all-btn">View All</button>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : todayAppointments.length === 0 ? (
          <EmptyState
            variant="appointments"
            title="No appointments today"
            description="You're all caught up for today"
          />
        ) : (
          <div className="appointments-list">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-time">
                  {new Date(appointment.appointment_date).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="appointment-details">
                  <h4>{appointment.patient_id?.users?.full_name || 'Patient'}</h4>
                  <p>{appointment.consultation_type}</p>
                </div>
                <div className="appointment-actions">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConfirm(appointment.id)}
                        className="btn btn-sm btn-primary"
                        disabled={actionLoading === appointment.id}
                      >
                        {actionLoading === appointment.id ? 'Confirming...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecline(appointment.id)}
                        className="btn btn-sm btn-outline"
                        disabled={actionLoading === appointment.id}
                      >
                        {actionLoading === appointment.id ? 'Declining...' : 'Decline'}
                      </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <span className="status-badge confirmed">Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <EmptyState
            variant="messages"
            title="No recent activity"
            description="Start by accepting appointments"
            size="small"
          />
        ) : (
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-indicator ${activity.type}`} />
                <div className="activity-content">
                  <p>{activity.title}</p>
                  <small>{activity.sub}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Patients */}
      <section className="patients-section">
        <div className="section-header">
          <h2>Patients You've Helped</h2>
          <button type="button" onClick={() => navigate('/doctor/patients')} className="view-all-btn">View All</button>
        </div>
        {patients.length === 0 ? (
          <EmptyState
            variant="search"
            title="No patients yet"
            description="Start by accepting appointments"
            size="small"
          />
        ) : (
          <div className="patients-list">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="patient-card">
                <div className="patient-avatar">
                  <div className="avatar-placeholder">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="patient-info">
                  <h4>{patient.name}</h4>
                  <p>{patient.consultationType}</p>
                  <small>Last appointment: {new Date(patient.lastAppointment).toLocaleDateString()}</small>
                </div>
                <div className="patient-status">
                  <span className={`status-badge ${patient.status}`}>{patient.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    );
  } catch (renderError) {
    console.error('❌ Render error in Doctor Dashboard:', renderError);
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', textAlign: 'center' }}>
        <h2>Render Error</h2>
        <p>Something went wrong while rendering the dashboard.</p>
        <button type="button" onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '10px 20px' }}>
          Retry
        </button>
      </div>
    );
  }
}

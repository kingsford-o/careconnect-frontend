import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RejectDialog from '../../components/common/RejectDialog';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const showToast = useUIStore(state => state.showToast);
  const showModal = useUIStore(state => state.showModal);
  
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const [statsRes, pendingRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/doctors/status/pending`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      if (!statsRes.ok) {
        throw new Error('Failed to fetch stats');
      }

      const statsData = await statsRes.json();
      setStats(statsData);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingDoctors(pendingData || []);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Failed to load dashboard data');
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }
    fetchDashboardData();
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user, isAuthenticated, fetchDashboardData]);

  const handleApprove = (doctor) => {
    showModal(
      <ConfirmDialog
        title="Approve Practitioner"
        message={`Are you sure you want to approve Dr. ${doctor.users?.full_name || 'this doctor'}? They will immediately become discoverable to patients.`}
        confirmText="Approve License"
        onConfirm={() => approveDoctor(doctor.id)}
        variant="primary"
      />
    );
  };

  const handleReject = (doctor) => {
    showModal(
      <RejectDialog
        title={`Decline Application - Dr. ${doctor.users?.full_name || ''}`}
        message="Please provide a reason for declining this application. The practitioner will be notified."
        onReject={(reason) => rejectDoctor(doctor.id, reason)}
      />
    );
  };

  const approveDoctor = async (doctorId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctorId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve doctor');
      }

      showToast('Doctor license approved and verified in real-time!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error('Error approving doctor:', err);
      showToast('Failed to approve doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const rejectDoctor = async (doctorId, reason) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctorId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject doctor');
      }

      showToast('Application declined and applicant notified.', 'info');
      fetchDashboardData();
    } catch (err) {
      console.error('Error rejecting doctor:', err);
      showToast('Failed to reject doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading administrative console...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading real-time platform metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>System Alert</h2>
        <p style={{ color: 'var(--danger-600)' }}>{error}</p>
        <button type="button" onClick={() => fetchDashboardData()} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-700)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-500)', display: 'inline-block' }}></span>
            <span>CareConnect Executive Console • Real-Time Synchronized</span>
          </div>
          <h1 className="dashboard-title" style={{ margin: '0.25rem 0' }}>Administration Dashboard</h1>
          <p className="dashboard-subtitle" style={{ margin: 0 }}>
            Welcome back, {user?.full_name || 'System Administrator'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/doctors?status=pending')}
          className="btn btn-primary"
        >
          Review Doctor Queue ({stats?.pendingDoctors || 0})
        </button>
      </header>

      {/* KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <button 
          type="button" 
          className="stat-card stat-card-pending" 
          onClick={() => navigate('/admin/doctors?status=pending')}
          style={{ textAlign: 'left' }}
        >
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.pendingDoctors || 0}</div>
            <div className="stat-label">Pending Verifications</div>
          </div>
        </button>

        <button 
          type="button" 
          className="stat-card stat-card-approved" 
          onClick={() => navigate('/admin/doctors?status=approved')}
          style={{ textAlign: 'left' }}
        >
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.approvedDoctors || 0}</div>
            <div className="stat-label">Approved Doctors</div>
          </div>
        </button>

        <button 
          type="button" 
          className="stat-card stat-card-rejected" 
          onClick={() => navigate('/admin/doctors?status=rejected')}
          style={{ textAlign: 'left' }}
        >
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.rejectedDoctors || 0}</div>
            <div className="stat-label">Rejected Applications</div>
          </div>
        </button>

        <div className="stat-card stat-card-patients">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalPatients || 0}</div>
            <div className="stat-label">Registered Patients</div>
          </div>
        </div>

        <div className="stat-card stat-card-appointments">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalAppointments || 0}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>
      </div>

      {/* Pending Doctor Applications Review Queue */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
              Pending Practitioner Verification Queue
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              New doctor applications requiring administrative medical license verification
            </p>
          </div>
          {pendingDoctors.length > 0 && (
            <button 
              type="button" 
              onClick={() => navigate('/admin/doctors?status=pending')}
              className="btn btn-outline btn-sm"
            >
              View Full Queue ({pendingDoctors.length})
            </button>
          )}
        </div>

        {pendingDoctors.length === 0 ? (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 600 }}>Verification Queue Clean</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              All doctor applications have been processed. New submissions will appear here in real-time.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingDoctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="doctor-card-admin" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                <div className="doctor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="doctor-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {doctor.users?.profile_image_url ? (
                        <img src={doctor.users.profile_image_url} alt={doctor.users.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span>{doctor.users?.full_name?.charAt(0) || 'D'}</span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Dr. {doctor.users?.full_name || 'Practitioner'}
                      </h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {doctor.specialty} • {doctor.hospital_name} • License: <strong style={{ color: 'var(--primary-600)' }}>{doctor.medical_license}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                      className="btn btn-sm btn-outline"
                      disabled={actionLoading}
                    >
                      Inspect File
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(doctor)}
                      className="btn btn-sm btn-primary"
                      disabled={actionLoading}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(doctor)}
                      className="btn btn-sm btn-danger"
                      disabled={actionLoading}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


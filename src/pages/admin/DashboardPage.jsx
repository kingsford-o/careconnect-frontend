import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const showToast = useUIStore(state => state.showToast);
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }
    fetchStats();
  }, [user, isAuthenticated]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard stats');
      showToast('Failed to load dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
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
      <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.full_name || 'Admin'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <button type="button" className="stat-card stat-card-pending" onClick={() => navigate('/admin/doctors/pending')}>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.pendingDoctors || 0}</div>
            <div className="stat-label">Pending Applications</div>
          </div>
        </button>

        <button type="button" className="stat-card stat-card-approved" onClick={() => navigate('/admin/doctors')}>
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

        <div className="stat-card stat-card-rejected">
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
        </div>

        <div className="stat-card stat-card-patients">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalPatients || 0}</div>
            <div className="stat-label">Total Patients</div>
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

      {stats?.pendingDoctors === 0 && stats?.approvedDoctors === 0 && (
        <EmptyState
          variant="doctors"
          title="No doctor applications yet"
          description="Doctor applications will appear here for review"
        />
      )}
    </div>
    );
  } catch (renderError) {
    console.error('❌ Render error in Admin Dashboard:', renderError);
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

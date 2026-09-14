import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RejectDialog from '../../components/common/RejectDialog';
import EmptyState from '../../components/common/EmptyState';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DoctorApplicationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore(state => state.user);
  const showToast = useUIStore(state => state.showToast);
  const showModal = useUIStore(state => state.showModal);
  
  const initialStatus = searchParams.get('status') || 'pending';
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [doctors, setDoctors] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && ['pending', 'approved', 'rejected'].includes(statusFromUrl)) {
      setActiveTab(statusFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDoctors(activeTab);
    fetchCounts();
    const handleRefresh = () => {
      fetchDoctors(activeTab);
      fetchCounts();
    };
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [activeTab, user]);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCounts({
          pending: data.pendingDoctors || 0,
          approved: data.approvedDoctors || 0,
          rejected: data.rejectedDoctors || 0
        });
      }
    } catch (err) {
      console.error('Error fetching admin counts:', err);
    }
  };

  const fetchDoctors = async (status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/status/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} doctors`);
      }

      const data = await response.json();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showToast(`Failed to load ${status} doctors`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ status: tab });
  };

  const handleApprove = (doctor) => {
    showModal(
      <ConfirmDialog
        title="Approve Practitioner"
        message={`Are you sure you want to approve Dr. ${doctor.users?.full_name || 'this doctor'}? Once approved, they will immediately appear in the patient discovery directory.`}
        confirmText="Approve Practitioner"
        onConfirm={() => approveDoctor(doctor.id)}
        variant="primary"
      />
    );
  };

  const handleReject = (doctor) => {
    showModal(
      <RejectDialog
        title={`Decline Application - Dr. ${doctor.users?.full_name || ''}`}
        message="Please provide a clear clinical reason for why this credential file was declined. The applicant will be notified."
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

      showToast('Doctor credentials approved! Real-time notifications dispatched.', 'success');
      fetchDoctors(activeTab);
      fetchCounts();
    } catch (error) {
      console.error('Error approving doctor:', error);
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
      fetchDoctors(activeTab);
      fetchCounts();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      showToast('Failed to reject doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (doc.users?.full_name || '').toLowerCase();
    const specialty = (doc.specialty || '').toLowerCase();
    const hospital = (doc.hospital_name || '').toLowerCase();
    const email = (doc.users?.email || '').toLowerCase();
    const license = (doc.medical_license || '').toLowerCase();
    return name.includes(q) || specialty.includes(q) || hospital.includes(q) || email.includes(q) || license.includes(q);
  });

  return (
    <div className="admin-dashboard admin-doctors-page" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
          >
            ← Back to Admin Console
          </button>
          <h1 className="dashboard-title">Medical Staff Applications & Directory</h1>
          <p className="dashboard-subtitle">
            Review submitted medical licenses, verify practitioners, and manage platform staff
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div className="tabs-premium" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`tab-premium ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            Pending Review ({counts.pending})
          </button>
          <button
            type="button"
            className={`tab-premium ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => handleTabChange('approved')}
          >
            Approved Directory ({counts.approved})
          </button>
          <button
            type="button"
            className={`tab-premium ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => handleTabChange('rejected')}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        <div style={{ minWidth: '240px', flex: '1 1 260px', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by doctor name, specialty, license, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading practitioner records...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          variant="doctors"
          title={`No ${activeTab} doctor records found`}
          description={
            searchQuery.trim()
              ? `No records match "${searchQuery}".`
              : activeTab === 'pending'
              ? 'There are currently no doctor applications awaiting verification.'
              : activeTab === 'approved'
              ? 'No verified doctors registered yet.'
              : 'No rejected applications.'
          }
        />
      ) : (
        <div className="doctors-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card-admin" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
              <div className="doctor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="doctor-avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.35rem' }}>
                    {doctor.users?.profile_image_url ? (
                      <img src={doctor.users.profile_image_url} alt={doctor.users.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span>{doctor.users?.full_name?.charAt(0) || 'D'}</span>
                    )}
                  </div>
                  <div className="doctor-info">
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Dr. {doctor.users?.full_name || 'Practitioner'}
                    </h3>
                    <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {doctor.specialty || 'General Practice'} • {doctor.hospital_name || 'Hospital affiliation not specified'}
                    </p>
                    <StatusBadge status={doctor.verification_status || 'pending'} />
                  </div>
                </div>

                <div className="doctor-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                    className="btn btn-sm btn-outline"
                    disabled={actionLoading}
                  >
                    Review Full File
                  </button>
                  {doctor.verification_status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(doctor)}
                        className="btn btn-sm btn-primary"
                        disabled={actionLoading}
                      >
                        Approve License
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(doctor)}
                        className="btn btn-sm btn-danger"
                        disabled={actionLoading}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="doctor-card-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div className="detail-item">
                  <span className="detail-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Medical License</span>
                  <span className="detail-value" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{doctor.medical_license || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Contact Email</span>
                  <span className="detail-value">{doctor.users?.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Experience</span>
                  <span className="detail-value">{doctor.years_experience || 0} years</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Rate</span>
                  <span className="detail-value">GHS {doctor.hourly_rate || 0} / hr</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Application Date</span>
                  <span className="detail-value">
                    {new Date(doctor.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

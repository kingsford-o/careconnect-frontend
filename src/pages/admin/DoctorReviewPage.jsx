import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RejectDialog from '../../components/common/RejectDialog';
import EmptyState from '../../components/common/EmptyState';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DoctorReviewPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const showToast = useUIStore(state => state.showToast);
  const showModal = useUIStore(state => state.showModal);
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
    const handleRefresh = () => fetchDoctorDetails();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }

      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      showToast('Failed to load doctor credentials file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    showModal(
      <ConfirmDialog
        title="Approve Practitioner Credentials"
        message={`Are you sure you want to verify Dr. ${doctor.users?.full_name || doctor.name || 'this doctor'}? Once approved, their clinical profile will immediately be visible to patients across CareConnect.`}
        confirmText="Approve Credentials"
        onConfirm={() => approveDoctor()}
        variant="primary"
      />
    );
  };

  const handleReject = () => {
    showModal(
      <RejectDialog
        title={`Decline Application - Dr. ${doctor.users?.full_name || doctor.name || ''}`}
        message="Please provide a specific clinical reason for why this credential application was declined. The doctor will receive this feedback."
        onReject={(reason) => rejectDoctor(reason)}
      />
    );
  };

  const approveDoctor = async () => {
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

      showToast('Doctor credentials verified successfully! In-app notifications dispatched.', 'success');
      navigate('/admin/doctors?status=approved');
    } catch (error) {
      console.error('Error approving doctor:', error);
      showToast('Failed to approve doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const rejectDoctor = async (reason) => {
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

      showToast('Doctor application declined.', 'info');
      navigate('/admin/doctors?status=rejected');
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      showToast('Failed to reject doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading practitioner credentials file...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="admin-dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <EmptyState
          variant="doctors"
          title="Doctor record not found"
          description="The requested practitioner record does not exist or has been removed."
          action="Back to Applications"
          onAction={() => navigate('/admin/doctors?status=pending')}
        />
      </div>
    );
  }

  const doctorName = doctor.name || doctor.users?.full_name || 'Practitioner';
  const doctorEmail = doctor.email || doctor.users?.email || 'N/A';
  const doctorPhone = doctor.phone || doctor.users?.phone || 'N/A';

  return (
    <div className="admin-dashboard admin-doctor-review-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            type="button" 
            onClick={() => navigate('/admin/doctors?status=pending')} 
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
          >
            ← Back to Applications Queue
          </button>
          <h1 className="dashboard-title">Practitioner Credential Review</h1>
          <p className="dashboard-subtitle">Medical license verification and credential audit</p>
        </div>
      </div>

      <div className="doctor-review-content" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <div className="doctor-profile-section" style={{ padding: '2rem' }}>
          <div className="doctor-profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="doctor-avatar-large" style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {doctor.profile_image_url || doctor.users?.profile_image_url ? (
                  <img src={doctor.profile_image_url || doctor.users?.profile_image_url} alt={doctorName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span>{doctorName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="doctor-profile-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <StatusBadge status={doctor.verification_status || 'pending'} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Applied {new Date(doctor.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Dr. {doctorName}
                </h2>
                <p style={{ margin: 0, color: 'var(--primary-600)', fontWeight: 600, fontSize: '1rem' }}>
                  {doctor.specialty || 'General Practice'}
                </p>
              </div>
            </div>

            <div className="doctor-review-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {doctor.verification_status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Approve Medical License'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="btn btn-danger"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Decline Application'}
                  </button>
                </>
              )}
              {doctor.verification_status === 'approved' && (
                <div className="status-message status-approved" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 600 }}>
                  <span>✓ Verified Practitioner in Platform Directory</span>
                </div>
              )}
              {doctor.verification_status === 'rejected' && (
                <div className="status-message status-rejected" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontWeight: 600 }}>
                  <div>✗ Application Declined</div>
                  {doctor.rejection_reason && (
                    <div style={{ fontWeight: 400, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Reason: {doctor.rejection_reason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="doctor-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="detail-section" style={{ background: 'var(--surface-secondary)', borderRadius: '14px', padding: '1.5rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Contact Details</h3>
              <div className="detail-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Email Address</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doctorEmail}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Phone Contact</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doctorPhone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section" style={{ background: 'var(--surface-secondary)', borderRadius: '14px', padding: '1.5rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Professional Credentials</h3>
              <div className="detail-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Medical License Number</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '1.125rem' }}>{doctor.medical_license || 'Pending Registration'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Hospital / Clinic Affiliation</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doctor.hospital_name || doctor.hospital || 'Not specified'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Years of Clinical Experience</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doctor.years_experience || 0} Years</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Hourly Consultation Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-600)' }}>GHS {doctor.hourly_rate || 0} / hr</span>
                </div>
              </div>
            </div>

            <div className="detail-section detail-section-full" style={{ gridColumn: '1 / -1', background: 'var(--surface-secondary)', borderRadius: '14px', padding: '1.5rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Bio & Practice Statement</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {doctor.bio || 'No personal statement or bio was submitted with this application.'}
              </p>
            </div>

            {doctor.verified_at && (
              <div className="detail-section" style={{ background: 'var(--surface-secondary)', borderRadius: '14px', padding: '1.5rem', border: '1px solid var(--border-light)' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Verification Audit Record</h3>
                <div className="detail-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Verified Timestamp</span>
                    <span style={{ fontWeight: 500 }}>{new Date(doctor.verified_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Verified By Admin ID</span>
                    <span style={{ fontWeight: 500 }}>{doctor.verified_by}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


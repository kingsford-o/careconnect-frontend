import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RejectDialog from '../../components/common/RejectDialog';
import EmptyState from '../../components/common/EmptyState';

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
      showToast('Failed to load doctor details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    showModal(
      <ConfirmDialog
        title="Approve Doctor"
        message={`Are you sure you want to approve ${doctor.users?.full_name || 'this doctor'}? Once approved, this doctor will become visible to patients and can receive appointments.`}
        confirmText="Approve Doctor"
        onConfirm={() => approveDoctor()}
        variant="primary"
      />
    );
  };

  const handleReject = () => {
    showModal(
      <RejectDialog
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

      showToast('Doctor approved successfully', 'success');
      navigate('/admin/doctors/pending');
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

      showToast('Doctor rejected successfully', 'success');
      navigate('/admin/doctors/pending');
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      showToast('Failed to reject doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <EmptyState
        variant="doctors"
        title="Doctor not found"
        description="The doctor you're looking for doesn't exist or has been removed"
        action="Back to Applications"
        onAction={() => navigate('/admin/doctors/pending')}
      />
    );
  }

  return (
    <div className="admin-doctor-review-page">
      <div className="page-header">
        <button type="button" onClick={() => navigate('/admin/doctors/pending')} className="btn btn-outline btn-sm">
          ← Back to Applications
        </button>
        <div>
          <h1>Doctor Review</h1>
          <p>Review doctor application details</p>
        </div>
      </div>

      <div className="doctor-review-content">
        <div className="doctor-profile-section">
          <div className="doctor-profile-header">
            <div className="doctor-avatar-large">
              {doctor.users?.profile_image_url ? (
                <img src={doctor.users.profile_image_url} alt={doctor.users.full_name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {doctor.users?.full_name?.charAt(0) || 'D'}
                </div>
              )}
            </div>
            <div className="doctor-profile-info">
              <h2>{doctor.users?.full_name || 'Unknown'}</h2>
              <p className="doctor-specialty">{doctor.specialty || 'Not specified'}</p>
              <div className="doctor-meta">
                <StatusBadge status={doctor.verification_status || 'pending'} />
                <span className="meta-divider">•</span>
                <span>Applied {new Date(doctor.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="doctor-review-actions">
              {doctor.verification_status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Approving...' : 'Approve Doctor'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="btn btn-danger"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject Application'}
                  </button>
                </>
              )}
              {doctor.verification_status === 'approved' && (
                <div className="status-message status-approved">
                  ✓ This doctor has been approved
                </div>
              )}
              {doctor.verification_status === 'rejected' && (
                <div className="status-message status-rejected">
                  ✗ This application was rejected
                  {doctor.rejection_reason && (
                    <p className="rejection-reason">Reason: {doctor.rejection_reason}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="doctor-details-grid">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{doctor.users?.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{doctor.users?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Professional Information</h3>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">Specialty</span>
                  <span className="detail-value">{doctor.specialty || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Years of Experience</span>
                  <span className="detail-value">{doctor.years_experience || 0} years</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hospital/Clinic</span>
                  <span className="detail-value">{doctor.hospital_name || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Medical License</span>
                  <span className="detail-value">{doctor.medical_license || 'Pending'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hourly Rate</span>
                  <span className="detail-value">${doctor.hourly_rate || 0}/hour</span>
                </div>
              </div>
            </div>

            <div className="detail-section detail-section-full">
              <h3>About</h3>
              <p className="doctor-bio">
                {doctor.bio || 'No bio provided.'}
              </p>
            </div>

            {doctor.verified_at && (
              <div className="detail-section">
                <h3>Verification Details</h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Verified At</span>
                    <span className="detail-value">
                      {new Date(doctor.verified_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Verified By</span>
                    <span className="detail-value">Admin ID: {doctor.verified_by}</span>
                  </div>
                </div>
              </div>
            )}

            {doctor.rejection_reason && (
              <div className="detail-section detail-section-full">
                <h3>Rejection Reason</h3>
                <p className="rejection-reason-full">{doctor.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

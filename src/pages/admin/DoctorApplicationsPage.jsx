import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RejectDialog from '../../components/common/RejectDialog';
import EmptyState from '../../components/common/EmptyState';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function DoctorApplicationsPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const showToast = useUIStore(state => state.showToast);
  const showModal = useUIStore(state => state.showModal);
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingDoctors();
    const handleRefresh = () => fetchPendingDoctors();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user]);

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/status/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending doctors');
      }

      const data = await response.json();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      showToast('Failed to load pending applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (doctor) => {
    showModal(
      <ConfirmDialog
        title="Approve Doctor"
        message={`Are you sure you want to approve ${doctor.users?.full_name || 'this doctor'}? Once approved, this doctor will become visible to patients and can receive appointments.`}
        confirmText="Approve Doctor"
        onConfirm={() => approveDoctor(doctor.id)}
        variant="primary"
      />
    );
  };

  const handleReject = (doctor) => {
    showModal(
      <RejectDialog
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

      showToast('Doctor approved successfully', 'success');
      fetchPendingDoctors();
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

      showToast('Doctor rejected successfully', 'success');
      fetchPendingDoctors();
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
        <p>Loading pending applications...</p>
      </div>
    );
  }

  return (
    <div className="admin-doctors-page">
      <div className="page-header">
        <div>
          <h1>Pending Doctor Applications</h1>
          <p>Review and approve doctor applications</p>
        </div>
      </div>

      {doctors.length === 0 ? (
        <EmptyState
          variant="doctors"
          title="No pending applications"
          description="Doctor applications awaiting review will appear here"
        />
      ) : (
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card-admin">
              <div className="doctor-card-header">
                <div className="doctor-avatar">
                  {doctor.users?.profile_image_url ? (
                    <img src={doctor.users.profile_image_url} alt={doctor.users.full_name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {doctor.users?.full_name?.charAt(0) || 'D'}
                    </div>
                  )}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.users?.full_name || 'Unknown'}</h3>
                  <p>{doctor.specialty || 'Not specified'}</p>
                  <StatusBadge status="pending" size="sm" />
                </div>
                <div className="doctor-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                    className="btn btn-sm btn-outline"
                    disabled={actionLoading}
                  >
                    View
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
                    Reject
                  </button>
                </div>
              </div>
              
              <div className="doctor-card-details">
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{doctor.users?.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{doctor.users?.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{doctor.years_experience || 0} years</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hospital:</span>
                  <span className="detail-value">{doctor.hospital_name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied:</span>
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

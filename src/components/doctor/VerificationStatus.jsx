import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function VerificationStatus({ status, rejectionReason }) {
  const statusContent = {
    pending: {
      title: 'Pending Verification',
      message: 'Your application is under review. Our team is reviewing your professional information. You\'ll be notified once a decision has been made.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      action: null
    },
    approved: {
      title: 'Verified',
      message: 'Your profile has been verified. You are now visible to patients and can receive appointment requests.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      action: null
    },
    rejected: {
      title: 'Application Not Approved',
      message: rejectionReason || 'Your application was not approved. Please review the feedback and update your profile to resubmit.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      action: 'Update Profile'
    }
  };

  const content = statusContent[status] || statusContent.pending;

  return (
    <div className={`verification-status verification-status-${status}`}>
      <div className="verification-status-icon">
        {content.icon}
      </div>
      <div className="verification-status-content">
        <div className="verification-status-header">
          <h3>{content.title}</h3>
          <StatusBadge status={status} />
        </div>
        <p>{content.message}</p>
        {status === 'rejected' && rejectionReason && (
          <div className="rejection-reason-box">
            <strong>Reason:</strong> {rejectionReason}
          </div>
        )}
      </div>
    </div>
  );
}

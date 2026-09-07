import React from 'react';

export default function StatusBadge({ status, size = 'md', customLabel }) {
  const normalizedStatus = String(status || '').toLowerCase().trim();

  const statusConfig = {
    pending: {
      label: 'Pending Review',
      className: 'status-badge-pending',
    },
    approved: {
      label: 'Verified',
      className: 'status-badge-approved',
    },
    verified: {
      label: 'Verified',
      className: 'status-badge-approved',
    },
    confirmed: {
      label: 'Confirmed',
      className: 'status-badge-confirmed',
    },
    completed: {
      label: 'Completed',
      className: 'status-badge-completed',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'status-badge-cancelled',
    },
    declined: {
      label: 'Declined',
      className: 'status-badge-declined',
    },
    rejected: {
      label: 'Rejected',
      className: 'status-badge-rejected',
    },
    rescheduled: {
      label: 'Rescheduled',
      className: 'status-badge-rescheduled',
    },
    telehealth: {
      label: 'Telehealth',
      className: 'status-badge-telehealth',
    },
    'in-person': {
      label: 'In-Person',
      className: 'status-badge-in-person',
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: customLabel || normalizedStatus || 'Unknown',
    className: 'status-badge-default',
  };

  const label = customLabel || config.label;

  return (
    <span className={`status-pill ${config.className} status-pill-${size}`}>
      <span className="status-pill-dot" aria-hidden="true" />
      <span className="status-pill-text">{label}</span>
    </span>
  );
}


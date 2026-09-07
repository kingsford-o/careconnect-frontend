export default function AppointmentCard({ appointment, onAction, actionLabel }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      declined: 'badge-declined',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
      rescheduled: 'badge-rescheduled',
    };
    return statusMap[status] || 'badge-default';
  };

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div className="appointment-info">
          <h3>{appointment.doctor_name || appointment.patient_name}</h3>
          <p className="specialty">{appointment.specialty || ''}</p>
        </div>
        <span className={`badge ${getStatusClass(appointment.status)}`}>
          {appointment.status.toUpperCase()}
        </span>
      </div>

      <div className="appointment-details">
        <p>📅 {formatDate(appointment.appointment_date)}</p>
        <p>🕐 {formatTime(appointment.appointment_date)}</p>
        <p>
          {appointment.consultation_type === 'telehealth' ? '💻 Video Call' : '🏥 In-Person'}
        </p>
        {appointment.reason_for_visit && (
          <p className="reason">Reason: {appointment.reason_for_visit}</p>
        )}
      </div>

      {onAction && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onAction(appointment)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

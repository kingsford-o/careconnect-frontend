import { useState } from 'react';
import { useUIStore } from '../../store/uiStore';

export default function AppointmentResponseModal({ 
  appointment, 
  onAccept, 
  onReschedule, 
  onDecline,
  onClose 
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const hideModal = useUIStore(state => state.hideModal);

  const handleAccept = () => {
    onAccept(appointment.id);
    hideModal();
  };

  const handleDecline = () => {
    if (declineReason.trim()) {
      onDecline(appointment.id, declineReason.trim());
      hideModal();
    }
  };

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      onReschedule(appointment.id, selectedDate, selectedTime);
      hideModal();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appointment Response</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="appointment-summary">
            <h3>Patient: {appointment.patient_id?.users?.full_name || appointment.patient_name}</h3>
            <p>
              <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>
              <strong>Type:</strong> {appointment.consultation_type === 'telehealth' ? 'Telehealth' : 'In-Person'}
            </p>
            {appointment.reason_for_visit && (
              <p>
                <strong>Reason:</strong> {appointment.reason_for_visit}
              </p>
            )}
          </div>

          {!showRescheduleForm && !showDeclineForm ? (
            <div className="response-actions">
              <p className="response-prompt">How would you like to respond to this appointment request?</p>
              
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={handleAccept}
              >
                Accept
              </button>
              
              <button
                type="button"
                className="btn btn-outline btn-large"
                onClick={() => setShowRescheduleForm(true)}
              >
                Reschedule to...
              </button>
              
              <button
                type="button"
                className="btn btn-danger btn-large"
                onClick={() => setShowDeclineForm(true)}
              >
                Decline
              </button>
            </div>
          ) : showRescheduleForm ? (
            <div className="reschedule-form">
              <h3>Reschedule Appointment</h3>
              <div className="form-group">
                <label htmlFor="rescheduleDate">New Date</label>
                <input
                  id="rescheduleDate"
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rescheduleTime">New Time</label>
                <input
                  id="rescheduleTime"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRescheduleForm(false)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReschedule}
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          ) : (
            <div className="reschedule-form">
              <h3>Decline Appointment</h3>
              <div className="form-group">
                <label htmlFor="declineReason">Reason</label>
                <textarea
                  id="declineReason"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="form-input"
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeclineForm(false)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDecline}
                  disabled={!declineReason.trim()}
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

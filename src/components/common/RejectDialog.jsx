import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';

export default function RejectDialog({ 
  title = 'Reject Doctor Application', 
  message = 'This doctor will not be visible to patients.',
  onReject,
}) {
  const hideModal = useUIStore(state => state.hideModal);
  const [reason, setReason] = useState('');

  const handleReject = () => {
    onReject(reason);
    hideModal();
  };

  const handleCancel = () => {
    hideModal();
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
        </div>
        
        <div className="confirm-dialog-body">
          <p>{message}</p>
          <div className="form-group">
            <label htmlFor="rejection-reason">Reason for rejection</label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for this rejection..."
              rows={4}
              className="form-input"
            />
          </div>
        </div>
        
        <div className="confirm-dialog-footer">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="btn btn-danger"
            disabled={!reason.trim()}
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
}

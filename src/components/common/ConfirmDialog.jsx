import React, { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';

export default function ConfirmDialog({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm,
  variant = 'danger'
}) {
  const hideModal = useUIStore(state => state.hideModal);
  const confirmButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        hideModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [hideModal]);

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    hideModal();
  };

  const variantClasses = {
    danger: 'btn-danger',
    primary: 'btn-primary',
    warning: 'btn-outline'
  };

  return (
    <div 
      className="confirm-dialog-overlay" 
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className="confirm-dialog" onClick={e => e.stopPropagation()} ref={dialogRef}>
        <div className="confirm-dialog-header">
          <h3 id="confirm-dialog-title">{title}</h3>
        </div>
        
        <div className="confirm-dialog-body">
          <p id="confirm-dialog-message">{message}</p>
        </div>
        
        <div className="confirm-dialog-footer">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`btn ${variantClasses[variant]}`}
            ref={confirmButtonRef}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

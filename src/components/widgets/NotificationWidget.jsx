import React from 'react';

export default function NotificationWidget({ 
  title, 
  message, 
  type = 'info',
  onDismiss,
  action,
  onAction 
}) {
  const typeStyles = {
    info: { icon: 'ℹ', bgColor: 'var(--info-50)', textColor: 'var(--info-600)' },
    success: { icon: '✓', bgColor: 'var(--success-50)', textColor: 'var(--success-600)' },
    warning: { icon: '⚠', bgColor: 'var(--warning-50)', textColor: 'var(--warning-600)' },
    error: { icon: '✕', bgColor: 'var(--danger-50)', textColor: 'var(--danger-600)' }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className="notification-widget" style={{ background: style.bgColor }}>
      <div className="notification-icon" style={{ color: style.textColor }}>
        {style.icon}
      </div>
      <div className="notification-content">
        <div className="notification-title">{title}</div>
        <div className="notification-message">{message}</div>
      </div>
      <div className="notification-actions">
        {action && (
          <button
            type="button"
            className="notification-action-btn"
            onClick={onAction}
            style={{ color: style.textColor }}
          >
            {action}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="notification-dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

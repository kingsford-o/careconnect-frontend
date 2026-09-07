import React from 'react';

export default function QuickActionWidget({ 
  icon, 
  label, 
  description,
  onClick,
  variant = 'default',
  size = 'medium'
}) {
  return (
    <button
      type="button"
      className={`quick-action-widget quick-action-widget-${variant} quick-action-widget-${size}`}
      onClick={onClick}
    >
      <div className="quick-action-icon">
        {icon}
      </div>
      <div className="quick-action-content">
        <div className="quick-action-label">{label}</div>
        {description && (
          <div className="quick-action-description">{description}</div>
        )}
      </div>
      <svg className="quick-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

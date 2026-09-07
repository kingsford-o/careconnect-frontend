import React from 'react';

export default function ActivityWidget({ 
  icon, 
  title, 
  description, 
  time,
  type = 'default',
  onClick 
}) {
  return (
    <button type="button" className={`activity-widget activity-widget-${type}`} onClick={onClick}>
      <div className="activity-widget-icon">
        {icon}
      </div>
      <div className="activity-widget-content">
        <div className="activity-widget-title">{title}</div>
        <div className="activity-widget-description">{description}</div>
        <div className="activity-widget-time">{time}</div>
      </div>
    </button>
  );
}

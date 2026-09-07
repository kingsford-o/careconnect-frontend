import React from 'react';

export default function StatWidget({ 
  icon, 
  value, 
  label, 
  trend, 
  trendDirection = 'positive',
  onClick 
}) {
  return (
    <button type="button" className="stat-widget" onClick={onClick}>
      <div className="stat-widget-icon">
        {icon}
      </div>
      <div className="stat-widget-content">
        <div className="stat-widget-value">{value}</div>
        <div className="stat-widget-label">{label}</div>
      </div>
      {trend && (
        <div className={`stat-widget-trend ${trendDirection}`}>
          {trendDirection === 'positive' ? '↑' : '↓'} {trend}
        </div>
      )}
    </button>
  );
}

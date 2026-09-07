import React from 'react';

export default function Logo({ size = 32, className = '', variant = 'default' }) {
  const iconSize = size;
  const textSize = size * 0.5;

  const variants = {
    default: {
      icon: '#2563EB',
      text: '#0F172A'
    },
    light: {
      icon: '#3B82F6',
      text: '#FFFFFF'
    },
    dark: {
      icon: '#60A5FA',
      text: '#F8FAFC'
    }
  };

  const colors = variants[variant] || variants.default;

  return (
    <div className={`logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: size * 0.25 }}>
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Medical cross with heart */}
        <path 
          d="M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4Z" 
          fill={colors.icon}
          opacity="0.1"
        />
        <path 
          d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6Z" 
          fill={colors.icon}
          opacity="0.2"
        />
        <path 
          d="M16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8Z" 
          fill={colors.icon}
          opacity="0.3"
        />
        {/* Heart shape */}
        <path 
          d="M16 22C16 22 10 17 10 13C10 11.343 11.343 10 13 10C14.5 10 15.5 11 16 12C16.5 11 17.5 10 19 10C20.657 10 22 11.343 22 13C22 17 16 22 16 22Z" 
          fill={colors.icon}
        />
        {/* Medical cross */}
        <rect x="14" y="11" width="4" height="10" rx="1" fill="white" />
        <rect x="11" y="14" width="10" height="4" rx="1" fill="white" />
      </svg>
      <span 
        style={{ 
          fontSize: textSize, 
          fontWeight: 700, 
          color: colors.text,
          letterSpacing: '-0.02em'
        }}
      >
        CareConnect
      </span>
    </div>
  );
}

// Logo mark only (icon without text)
export function LogoMark({ size = 32, className = '', variant = 'default' }) {
  const variants = {
    default: { icon: '#2563EB' },
    light: { icon: '#3B82F6' },
    dark: { icon: '#60A5FA' }
  };
  const colors = variants[variant] || variants.default;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path 
        d="M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4Z" 
        fill={colors.icon}
        opacity="0.1"
      />
      <path 
        d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6Z" 
        fill={colors.icon}
        opacity="0.2"
      />
      <path 
        d="M16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8Z" 
        fill={colors.icon}
        opacity="0.3"
      />
      <path 
        d="M16 22C16 22 10 17 10 13C10 11.343 11.343 10 13 10C14.5 10 15.5 11 16 12C16.5 11 17.5 10 19 10C20.657 10 22 11.343 22 13C22 17 16 22 16 22Z" 
        fill={colors.icon}
      />
      <rect x="14" y="11" width="4" height="10" rx="1" fill="white" />
      <rect x="11" y="14" width="10" height="4" rx="1" fill="white" />
    </svg>
  );
}

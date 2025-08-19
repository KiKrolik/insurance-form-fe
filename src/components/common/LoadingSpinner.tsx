import React from 'react';

interface LoadingSpinnerProps {
  size?: number | string; 
  label?: string; 
  className?: string;
  textClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, label = 'Loading...', className = '', textClassName = '' }) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <div className={`flex items-center ${className}`} role="status" aria-live="polite" aria-label={label}>
      <svg
        className="animate-spin text-blue-500"
        style={{ width: dimension, height: dimension }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {label && <span className={`ml-2 ${textClassName}`}>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;

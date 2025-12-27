import React from 'react';
import './StatusIcon.css'; // See the CSS file below

const StatusIcon = ({ status = 'success', size = 100 }) => {
  if (status === 'success') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="icon-container">
        <circle className="circle-success" cx="50" cy="50" r="45" />
        <polyline className="check-mark" points="30,52 45,65 70,38" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="icon-container">
      <circle className="circle-error" cx="50" cy="50" r="45" />
      <line className="x-mark" x1="35" y1="35" x2="65" y2="65" />
      <line className="x-mark" x1="65" y1="35" x2="35" y2="65" />
    </svg>
  );
};

export default StatusIcon;
import React from 'react';

const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`}></div>
  );
};

export default SkeletonCard;

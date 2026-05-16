import React from 'react';

const StatusBadge = ({ status = '' }) => {
  const statusLower = status.toLowerCase();
  
  let bg = 'bg-gray-100';
  let text = 'text-gray-800';
  let dot = 'bg-gray-500';

  if (['confirmed', 'active', 'completed'].includes(statusLower)) {
    bg = 'bg-green-100/50';
    text = 'text-green-700';
    dot = 'bg-green-500';
  } else if (['pending'].includes(statusLower)) {
    bg = 'bg-amber-100/50';
    text = 'text-amber-700';
    dot = 'bg-amber-500';
  } else if (['cancelled', 'banned', 'expired'].includes(statusLower)) {
    bg = 'bg-red-100/50';
    text = 'text-red-700';
    dot = 'bg-red-500';
  } else if (['admin'].includes(statusLower)) {
    bg = 'bg-purple-100/50';
    text = 'text-purple-700';
    dot = 'bg-purple-500';
  } else if (['user'].includes(statusLower)) {
    bg = 'bg-blue-100/50';
    text = 'text-blue-700';
    dot = 'bg-blue-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border border-white/20 shadow-sm ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;

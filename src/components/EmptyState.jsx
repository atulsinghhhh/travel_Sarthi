import React from 'react';

const EmptyState = ({ icon: Icon, title, subtitle, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 w-full">
      {Icon && <div className="mb-4 text-blue-500 bg-blue-50 p-4 rounded-full"><Icon size={40} strokeWidth={1.5} /></div>}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 mb-6 max-w-md">{subtitle}</p>}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

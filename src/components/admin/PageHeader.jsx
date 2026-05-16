import React from 'react';

const PageHeader = ({ title, subtitle, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <button 
            onClick={onSecondaryAction}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 rounded-xl transition shadow-sm active:scale-95 bg-white"
          >
            {secondaryActionLabel}
          </button>
        )}
        {actionLabel && onAction && (
          <button 
            onClick={onAction}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

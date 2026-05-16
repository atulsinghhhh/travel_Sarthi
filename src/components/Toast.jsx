import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type }) => {
  const types = {
    success: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    error: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    info: { icon: Info, bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
  };
  
  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto ${config.bg} ${config.text} ${config.border} animate-[slide-in-right_0.3s_ease-out]`}>
      <Icon size={20} />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;

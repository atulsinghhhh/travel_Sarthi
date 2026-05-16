import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, change, changeType }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-normal text-gray-500">{title}</p>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
            {change}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-3xl font-semibold text-gray-900 leading-tight">{value}</h4>
      </div>
    </div>
  );
};

export default StatCard;

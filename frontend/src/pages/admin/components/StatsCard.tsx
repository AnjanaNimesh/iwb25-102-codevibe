import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color?: 'blue' | 'green' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  title, 
  value, 
  color = "blue" 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transition-transform hover:scale-105 duration-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg shadow-sm ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-3 sm:ml-4">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
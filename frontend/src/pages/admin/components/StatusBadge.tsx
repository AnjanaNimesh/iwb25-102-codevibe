import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)} shadow-sm`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
};

export default StatusBadge;
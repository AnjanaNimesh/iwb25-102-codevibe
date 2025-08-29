import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => (
  <div className="p-8 text-center bg-gray-50">
    <div className="mx-auto mb-4">
      {React.cloneElement(icon as React.ReactElement, { className: "w-12 h-12 text-gray-400 mx-auto" })}
    </div>
    <p className="text-gray-500 text-lg">{title}</p>
    {description && <p className="text-gray-400 text-sm mt-2">{description}</p>}
  </div>
);

export default EmptyState;
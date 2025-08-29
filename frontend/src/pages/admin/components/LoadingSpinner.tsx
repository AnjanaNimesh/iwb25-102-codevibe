import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-600"></div>
  </div>
);

export default LoadingSpinner;
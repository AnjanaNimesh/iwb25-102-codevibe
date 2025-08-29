import React from 'react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
    <div className="p-2 sm:p-3 bg-red-100 rounded-full w-fit shadow-md">
      {icon}
    </div>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
    </div>
  </div>
);

export default PageHeader;
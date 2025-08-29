import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {children}
    </div>
  </div>
);

export default FilterBar;
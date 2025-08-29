import React from 'react';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = ""
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400 bg-white ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default FilterSelect;
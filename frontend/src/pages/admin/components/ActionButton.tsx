import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  title?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  title
}) => {
  const baseClasses = "flex items-center rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base"
  };
  
  const variantClasses = {
    primary: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 mr-2" })}
      {label}
    </button>
  );
};

export default ActionButton;
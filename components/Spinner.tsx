import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-teal-500. Can also be text-[rgb(var(--text-accent))]
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  const spinnerColor = color || 'text-[rgb(var(--text-accent))]';

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${spinnerColor}`}
        style={{ borderTopColor: 'transparent' }} 
      ></div>
    </div>
  );
};

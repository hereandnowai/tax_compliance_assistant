import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[rgb(var(--bg-secondary))] hover:bg-[rgba(var(--bg-interactive-hover),0.7)] p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 ring-[rgb(var(--border-focus))] ring-opacity-50 text-left h-full flex flex-col"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-[rgb(var(--bg-tertiary))] mr-4">
          {/* Icon color is set in App.tsx to text-accent */}
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-[rgb(var(--text-accent))]">{title}</h3>
      </div>
      <p className="text-[rgb(var(--text-secondary))] text-sm flex-grow">{description}</p>
      <div className="mt-4 text-right">
        <span className="text-xs text-[rgb(var(--text-highlight))] hover:brightness-110 font-medium">Explore &rarr;</span>
      </div>
    </button>
  );
};

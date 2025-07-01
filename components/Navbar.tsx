import React from 'react';
import { LOGO_URL, COMPANY_NAME } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './icons';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-[rgba(var(--bg-secondary),0.8)] dark:bg-[rgba(var(--bg-secondary),0.8)] backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={LOGO_URL} alt="Company Logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-[rgb(var(--text-accent))]">{COMPANY_NAME}</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors duration-200"
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? (
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>
  );
};

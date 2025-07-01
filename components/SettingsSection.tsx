
import React from 'react';
import { COMPANY_NAME } from '../constants';
import { Feature } from '../types';
import { SettingsIcon, InformationCircleIcon, MailIcon, SunIcon, MoonIcon, ArrowRightIcon, WarningIcon } from './icons'; // Assuming you might link to AppExplanationAssistant
import { useTheme } from '../contexts/ThemeContext';


interface SettingsSectionProps {
  onNavigate: (feature: Feature) => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-[rgba(var(--bg-tertiary),0.3)] p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      {icon && <div className="mr-3 text-[rgb(var(--text-accent))]">{icon}</div>}
      <h3 className="text-xl font-semibold text-[rgb(var(--text-highlight))]">{title}</h3>
    </div>
    <div className="space-y-3 text-[rgb(var(--text-secondary))]">
      {children}
    </div>
  </div>
);

export const SettingsSection: React.FC<SettingsSectionProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const appVersion = "1.0.0"; // Example version

  const handleClearData = () => {
    // This is a mock function. In a real app, you'd implement data clearing logic.
    // For now, it just shows an alert or console log.
    alert("Mock Action: Application data would be cleared. This is not implemented yet.");
    console.log("Attempted to clear application data (mock).");
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <SettingsIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">
          Application Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Section */}
        <SettingsCard title="About This App" icon={<InformationCircleIcon className="w-6 h-6"/>}>
          <p><strong>Application Name:</strong> Tax Compliance Automation Assistant</p>
          <p><strong>Version:</strong> {appVersion}</p>
          <p><strong>Developer:</strong> {COMPANY_NAME}</p>
          <p className="mt-2">
            This application is designed to assist tax professionals in streamlining compliance workflows.
          </p>
          <div className="mt-4 space-y-2">
            <a href="#" target="_blank" rel="noopener noreferrer" className="block text-[rgb(var(--text-accent))] hover:text-[rgb(var(--text-accent-hover))] transition-colors">
              Privacy Policy <ArrowRightIcon className="inline w-4 h-4 ml-1" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="block text-[rgb(var(--text-accent))] hover:text-[rgb(var(--text-accent-hover))] transition-colors">
              Terms of Service <ArrowRightIcon className="inline w-4 h-4 ml-1" />
            </a>
          </div>
        </SettingsCard>

        {/* Appearance Section */}
        <SettingsCard title="Appearance" icon={theme === 'light' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}>
          <p>Current Theme: <span className="capitalize font-semibold">{theme}</span></p>
          <p>
            You can toggle between light and dark themes using the sun/moon icon in the navigation bar.
          </p>
          {/* Placeholder for more appearance settings if added later */}
          {/* <button className="mt-3 px-4 py-2 bg-[rgb(var(--bg-interactive-hover))] text-[rgb(var(--text-primary))] rounded-md hover:bg-[rgb(var(--bg-tertiary))] transition-colors">
            More Appearance Options (Coming Soon)
          </button> */}
        </SettingsCard>

        {/* Help & Support Section */}
        <SettingsCard title="Help & Support" icon={<MailIcon className="w-6 h-6" />}>
          <p>Need help with the app or have questions about its features?</p>
          <div className="mt-4 space-y-2">
             <button
              onClick={() => onNavigate(Feature.AppExplanationAssistant)}
              className="w-full text-left px-4 py-2 bg-[rgb(var(--bg-interactive))] hover:bg-[rgb(var(--bg-interactive-hover))] text-[rgb(var(--text-accent))] rounded-md transition-colors flex items-center justify-between"
            >
              <span>Ask the App Explanation Assistant</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <a href="mailto:support@example.com?subject=Tax%20Assistant%20Support" className="block w-full text-left px-4 py-2 bg-[rgb(var(--bg-interactive))] hover:bg-[rgb(var(--bg-interactive-hover))] text-[rgb(var(--text-accent))] rounded-md transition-colors flex items-center justify-between">
              <span>Contact Support (mock)</span>
               <ArrowRightIcon className="w-4 h-4" />
            </a>
            <button 
                onClick={() => alert("FAQs section coming soon!")}
                className="w-full text-left px-4 py-2 bg-[rgb(var(--bg-interactive))] hover:bg-[rgb(var(--bg-interactive-hover))] text-[rgb(var(--text-accent))] rounded-md transition-colors flex items-center justify-between"
            >
              <span>View FAQs (mock)</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </SettingsCard>

        {/* Data & Privacy Section */}
         <SettingsCard title="Data & Privacy" icon={<WarningIcon className="w-6 h-6"/>}>
          <p>
            This application uses your browser's local storage for theme preferences. 
            No sensitive data is stored or transmitted by default through this settings interface. 
            Specific features may handle data as described within those features.
          </p>
          <div className="mt-4">
            <button
              onClick={handleClearData}
              className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 dark:bg-red-800/30 dark:hover:bg-red-800/40 font-medium rounded-md transition-colors"
            >
              Clear Application Data (Mock)
            </button>
            <p className="text-xs mt-2 text-[rgb(var(--text-secondary))] opacity-80">
                This is a simulated action. No data will be cleared in this demo.
            </p>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

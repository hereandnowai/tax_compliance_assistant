import React from 'react';
import { ArrowRightIcon } from './icons'; 
import { HEADER_IMAGE_URL, COMPANY_NAME } from '../constants';

interface HomePageProps {
  onGetStarted: () => void;
}

const InfoCard: React.FC<{ icon: string; title: string; description: string; className?: string }> = ({ icon, title, description, className }) => (
  <div className={`bg-[rgba(var(--bg-secondary),0.7)] backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 ${className}`}>
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-xl font-semibold text-[rgb(var(--text-accent))] mb-2">{title}</h3>
    <p className="text-[rgb(var(--text-secondary))] text-sm">{description}</p>
  </div>
);

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="text-center py-8 sm:py-12 animate-fadeIn">
      <img src={HEADER_IMAGE_URL} alt={`${COMPANY_NAME} Header`} className="mx-auto mb-6 h-24 sm:h-32 object-contain" />
      
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] via-[rgb(var(--text-highlight))] to-orange-400 mb-6">
        Welcome to Your AI Tax Assistant!
      </h1>
      <p className="text-lg sm:text-xl text-[rgb(var(--text-primary))] max-w-3xl mx-auto mb-10">
        Streamline your tax compliance, identify risks, and ensure accurate reporting with the power of Artificial Intelligence. Let's simplify complexity together! 🚀
      </p>

      <div className="my-12">
        <h2 className="text-3xl font-semibold text-[rgb(var(--text-primary))] mb-8">How to Use This App 🤔</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <InfoCard 
            icon="🚀" 
            title="Step 1: Get Started!" 
            description="Click the 'Get Started' button below to navigate to our suite of powerful tax tools."
          />
          <InfoCard 
            icon="🗺️" 
            title="Step 2: Explore Features!" 
            description="You'll see a dashboard with various features like Document Analysis, Checklist Generation, and more."
          />
          <InfoCard 
            icon="🎯" 
            title="Step 3: Select Your Tool!" 
            description="Click on any feature card that matches your current need or task at hand."
          />
          <InfoCard 
            icon="💬" 
            title="Step 4: Interact & Analyze!" 
            description="Follow the on-screen instructions. This might involve pasting text, selecting options, or asking questions."
            className="md:col-span-1 lg:col-auto"
          />
          <InfoCard 
            icon="💡" 
            title="Step 5: Leverage AI Power!" 
            description="Receive AI-driven insights, generated checklists, risk assessments, or research assistance."
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </div>

      <button
        onClick={onGetStarted}
        className="px-10 py-4 bg-gradient-to-r from-[rgb(var(--text-highlight))] to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-[rgb(var(--bg-primary))] font-bold text-xl rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out group flex items-center justify-center mx-auto"
        aria-label="Get started with the Tax Compliance Automation Assistant"
      >
        Get Started ✨
        <ArrowRightIcon className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}
      </style>
    </div>
  );
};
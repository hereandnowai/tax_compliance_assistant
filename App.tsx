

import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FeatureCard } from './components/FeatureCard';
import { DocumentUploadSection } from './components/DocumentUploadSection';
import { ChecklistGeneratorSection } from './components/ChecklistGeneratorSection';
import { DeadlineTrackerSection } from './components/DeadlineTrackerSection';
import { TaxResearchSection } from './components/TaxResearchSection';
import { RegulatoryUpdateSummarizerSection } from './components/RegulatoryUpdateSummarizerSection';
import { ClientCommunicationAssistantSection } from './components/ClientCommunicationAssistantSection';
import { AppExplanationAssistantSection } from './components/AppExplanationAssistantSection';
import { SettingsSection } from './components/SettingsSection'; // Added
import { HomePage } from './components/HomePage';
import { ArrowLeftIcon, DocumentIcon, ChecklistIcon, CalendarIcon, ResearchIcon, AcademicCapIcon, MailIcon, InformationCircleIcon, SettingsIcon } from './components/icons'; // Added SettingsIcon
import { Feature } from './types';
import { HEADER_IMAGE_URL, COMPANY_NAME } from './constants';

interface FeatureInfo {
  type: Feature;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureGroup {
  groupTitle: string;
  features: FeatureInfo[];
}

const App: React.FC = () => {
  const [showHomePage, setShowHomePage] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleGetStarted = useCallback(() => {
    setShowHomePage(false);
  }, []);

  const handleFeatureSelect = useCallback((feature: Feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleBackToFeaturesDashboard = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const handleGoHome = useCallback(() => {
    setShowHomePage(true);
    setSelectedFeature(null); 
  }, []);

  const renderFeatureContent = () => {
    if (!selectedFeature) return null;

    switch (selectedFeature) {
      case Feature.DocumentAnalysis:
        return <DocumentUploadSection />;
      case Feature.ChecklistGeneration:
        return <ChecklistGeneratorSection />;
      case Feature.DeadlineTracking:
        return <DeadlineTrackerSection />;
      case Feature.TaxResearch:
        return <TaxResearchSection />;
      case Feature.RegulatoryUpdateSummarizer:
        return <RegulatoryUpdateSummarizerSection />;
      case Feature.ClientCommunicationAssistant:
        return <ClientCommunicationAssistantSection />;
      case Feature.AppExplanationAssistant:
        return <AppExplanationAssistantSection />;
      case Feature.Settings: // Added case
        return <SettingsSection onNavigate={handleFeatureSelect} />;
      default:
        return null;
    }
  };

  const featureGroups: FeatureGroup[] = [
    {
      groupTitle: "Analysis & Reporting",
      features: [
        { type: Feature.DocumentAnalysis, title: "Document Analysis", description: "Analyze tax documents for compliance issues.", icon: <DocumentIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
        { type: Feature.RegulatoryUpdateSummarizer, title: "Regulation Summarizer", description: "Summarize complex tax regulations into concise, actionable insights.", icon: <AcademicCapIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
      ]
    },
    {
      groupTitle: "Planning & Guidance",
      features: [
        { type: Feature.ChecklistGeneration, title: "Checklist Generation", description: "Generate compliance checklists by entity and jurisdiction.", icon: <ChecklistIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
        { type: Feature.DeadlineTracking, title: "Deadline Tracking", description: "Guidance on tax filing deadlines and requirements.", icon: <CalendarIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
      ]
    },
    {
      groupTitle: "Research & Communication",
      features: [
        { type: Feature.TaxResearch, title: "Tax Research", description: "AI-powered tax research and regulatory updates.", icon: <ResearchIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
        { type: Feature.ClientCommunicationAssistant, title: "Client Communication", description: "Draft client-friendly explanations of tax matters.", icon: <MailIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
      ]
    },
    { 
      groupTitle: "Help & Support",
      features: [
        { type: Feature.AppExplanationAssistant, title: "App Explanation Assistant", description: "Ask questions about this application and its features.", icon: <InformationCircleIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
      ]
    },
    { // Added new group for Settings
      groupTitle: "Application Settings & Info",
      features: [
        { type: Feature.Settings, title: "Settings", description: "Configure application settings and view app information.", icon: <SettingsIcon className="w-10 h-10 text-[rgb(var(--text-accent))]" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen text-[rgb(var(--text-primary))] bg-gradient-to-br from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {showHomePage ? (
          <HomePage onGetStarted={handleGetStarted} />
        ) : !selectedFeature ? (
          <>
            <button
              onClick={handleGoHome}
              className="mb-6 flex items-center text-[rgb(var(--text-accent))] hover:text-[rgb(var(--text-accent-hover))] transition-colors duration-150 group"
              aria-label="Back to Home page"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-150" />
              Back to Home
            </button>
            <header className="mb-12 text-center">
              <img src={HEADER_IMAGE_URL} alt={`${COMPANY_NAME} Header`} className="mx-auto mb-6 h-20 sm:h-24 object-contain" />
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))] mb-4">
                Tax Compliance Dashboard
              </h1>
              <p className="text-md sm:text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                Select a tool below to streamline your tax workflows, identify risks, and ensure accurate reporting.
              </p>
            </header>
            
            {featureGroups.map(group => (
              <section key={group.groupTitle} className="mb-12">
                <h2 className="text-2xl font-semibold text-[rgb(var(--text-highlight))] mb-2 border-b-2 border-[rgb(var(--border-primary))] pb-2">
                  {group.groupTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6">
                  {group.features.map(feature => (
                    <FeatureCard
                      key={feature.type}
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                      onClick={() => handleFeatureSelect(feature.type)}
                    />
                  ))}
                </div>
              </section>
            ))}
            
          </>
        ) : (
          <div className="bg-[rgb(var(--bg-secondary))] p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl shadow-[rgba(var(--shadow-color),var(--shadow-opacity-start))]">
            <button
              onClick={handleBackToFeaturesDashboard}
              className="mb-6 flex items-center text-[rgb(var(--text-accent))] hover:text-[rgb(var(--text-accent-hover))] transition-colors duration-150 group"
              aria-label="Back to features dashboard"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-150" />
              Back to Dashboard
            </button>
            {renderFeatureContent()}
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-[rgb(var(--text-secondary))] text-sm border-t border-[rgb(var(--border-primary))]">
        <p>&copy; {new Date().getFullYear()} {COMPANY_NAME} | RASHINI S [AI PRODUCT ENGINEERING TEAM ]. All rights reserved.</p>
        <p className="mt-1">
          Disclaimer: This tool provides general guidance and is not a substitute for professional tax advice. Always consult with a qualified tax professional for complex matters.
        </p>
      </footer>
    </div>
  );
};

export default App;
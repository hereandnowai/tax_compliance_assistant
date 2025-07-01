
import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';
import { askGemini } from '../services/geminiService';
import { MailIcon, SparklesIcon } from './icons';
import { SimpleMarkdown } from './SimpleMarkdown';

export const ClientCommunicationAssistantSection: React.FC = () => {
  const [technicalText, setTechnicalText] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('Small Business Owner');
  // Removed keyPoints state: const [keyPoints, setKeyPoints] = useState<string>('');
  const [draft, setDraft] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiKeyMissing = !process.env.API_KEY;

  const audienceOptions = [
    "Small Business Owner",
    "Individual Taxpayer",
    "Investor",
    "Client new to tax filings",
    "Corporate Executive"
  ];

  const handleDraftCommunication = useCallback(async () => {
    if (!technicalText.trim()) {
      setError("Please provide some technical information to draft the communication.");
      setDraft(null);
      return;
    }
    if (apiKeyMissing) {
      setError("Gemini API key is not configured. Please set the process.env.API_KEY environment variable.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDraft(null);

    const prompt = `
You are an AI assistant helping a tax professional draft client communications.
The user will provide technical tax information and the target audience.
Your task is to rephrase the technical information into a clear, concise, and client-friendly message suitable for the specified audience.
Identify the most important information from the technical text and present it in an understandable way.
Avoid jargon where possible, or explain it simply. Maintain a professional and helpful tone.
Structure the output as a friendly email or memo, if appropriate for the context.

Technical Information Provided:
---
${technicalText}
---

Target Audience: ${targetAudience}

Draft Client Communication:
`;

    try {
      // useDefaultSystemInstruction = true, useSearchGrounding = false, customSystemInstruction = undefined
      const result = await askGemini(prompt, true, false, undefined); 
      setDraft(result.text);
    } catch (e: any) {
      console.error("Error drafting communication:", e);
      setError(e.message || "Failed to get draft from AI.");
    } finally {
      setIsLoading(false);
    }
  }, [technicalText, targetAudience, apiKeyMissing]); // Removed keyPoints from dependencies

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <MailIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">Client Communication Assistant</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))]">
        Input technical tax information and specify the target audience. The AI will help you draft a client-friendly communication.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="technicalText" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Technical Information / AI Output</label>
          <textarea
            id="technicalText"
            value={technicalText}
            onChange={(e) => setTechnicalText(e.target.value)}
            placeholder={apiKeyMissing ? "API Key not configured. Feature disabled." : "Paste technical details or AI-generated summary here..."}
            rows={10} // Increased rows slightly as one field is removed
            className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-secondary))] transition-colors disabled:opacity-50"
            aria-label="Technical information input"
            disabled={apiKeyMissing || isLoading}
          />
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Target Audience</label>
          <select
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))] disabled:opacity-50"
            disabled={apiKeyMissing || isLoading}
          >
            {audienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Removed Key Points Textarea */}
      </div>
      
      <button
        onClick={handleDraftCommunication}
        disabled={isLoading || !technicalText.trim() || apiKeyMissing}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[rgb(var(--text-accent))] to-cyan-600 hover:from-[rgb(var(--text-accent-hover))] hover:to-cyan-700 text-white dark:text-[rgb(var(--text-on-accent))] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? <Spinner size="sm" color="text-white dark:text-[rgb(var(--text-on-accent))]" /> : <SparklesIcon className="w-5 h-5" />}
        <span>Draft Communication</span>
      </button>

      {apiKeyMissing && (
         <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg text-sm">
           <strong>API Key Error:</strong> The Gemini API key is not configured. This feature requires <code>process.env.API_KEY</code> to be set in your environment.
         </p>
      )}
      {error && !apiKeyMissing && <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg">{error}</p>}

      {draft && !isLoading && (
        <div className="mt-6 p-4 sm:p-6 bg-[rgba(var(--bg-tertiary),0.5)] rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">Drafted Communication:</h3>
          <div className="text-[rgb(var(--text-secondary))] leading-relaxed">
            <SimpleMarkdown text={draft} className="!text-[rgb(var(--text-primary))]"/>
          </div>
        </div>
      )}
    </div>
  );
};

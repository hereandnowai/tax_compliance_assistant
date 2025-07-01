
import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';
import { askGemini } from '../services/geminiService';
import { AcademicCapIcon, SparklesIcon } from './icons';
import { SimpleMarkdown } from './SimpleMarkdown';


export const RegulatoryUpdateSummarizerSection: React.FC = () => {
  const [regulationText, setRegulationText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiKeyMissing = !process.env.API_KEY;

  const handleSummarize = useCallback(async () => {
    if (!regulationText.trim()) {
      setError("Please paste some regulation text to summarize.");
      setSummary(null);
      return;
    }
    if (apiKeyMissing) {
      setError("Gemini API key is not configured. Please set the process.env.API_KEY environment variable.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    const prompt = `
Please summarize the following tax regulation text. Focus on:
- Key changes introduced by the regulation.
- Potential impacts on different taxpayer types (e.g., individuals, corporations, partnerships).
- Any critical compliance dates or new action items tax professionals should be aware of.
- The overall objective or purpose of the regulation.
Keep the summary concise, clear, and highlight the most important takeaways for a tax professional.

Regulation Text:
---
${regulationText}
---
Summary:
`;

    try {
      // useDefaultSystemInstruction = true, useSearchGrounding = false, customSystemInstruction = undefined
      const result = await askGemini(prompt, true, false, undefined); 
      setSummary(result.text);
    } catch (e: any) {
      console.error("Error summarizing regulation:", e);
      setError(e.message || "Failed to get summary from AI.");
    } finally {
      setIsLoading(false);
    }
  }, [regulationText, apiKeyMissing]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <AcademicCapIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">Regulatory Update Summarizer</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))]">
        Paste the full text of a new tax regulation or a detailed official announcement below. The AI will provide a summary highlighting key changes, impacts, and important considerations for tax professionals.
      </p>
      
      <textarea
        value={regulationText}
        onChange={(e) => setRegulationText(e.target.value)}
        placeholder={apiKeyMissing ? "API Key not configured. Feature disabled." : "Paste regulation text here..."}
        rows={12}
        className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-secondary))] transition-colors disabled:opacity-50"
        aria-label="Regulation text input"
        disabled={apiKeyMissing || isLoading}
      />
      
      <button
        onClick={handleSummarize}
        disabled={isLoading || !regulationText.trim() || apiKeyMissing}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[rgb(var(--text-accent))] to-cyan-600 hover:from-[rgb(var(--text-accent-hover))] hover:to-cyan-700 text-white dark:text-[rgb(var(--text-on-accent))] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? <Spinner size="sm" color="text-white dark:text-[rgb(var(--text-on-accent))]" /> : <SparklesIcon className="w-5 h-5" />}
        <span>Summarize Regulation</span>
      </button>

      {apiKeyMissing && (
         <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg text-sm">
           <strong>API Key Error:</strong> The Gemini API key is not configured. This feature requires <code>process.env.API_KEY</code> to be set in your environment.
         </p>
      )}
      {error && !apiKeyMissing && <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg">{error}</p>}

      {summary && !isLoading && (
        <div className="mt-6 p-4 sm:p-6 bg-[rgba(var(--bg-tertiary),0.5)] rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">Summary:</h3>
          <div className="text-[rgb(var(--text-secondary))] leading-relaxed">
            <SimpleMarkdown text={summary} className="!text-[rgb(var(--text-primary))]" />
          </div>
        </div>
      )}
    </div>
  );
};
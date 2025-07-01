import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';
import { ComplianceIssue, RiskLevel } from '../types';
import { DocumentIcon, WarningIcon } from './icons';

const mockIssues: ComplianceIssue[] = [
  { id: '1', description: "Unreported income from Form 1099-MISC.", riskLevel: RiskLevel.High, recommendation: "Amend return to include all income sources.", reference: "IRC §61" },
  { id: '2', description: "Potentially overstated business expense for 'Office Supplies'.", riskLevel: RiskLevel.Medium, recommendation: "Review receipts and ensure expenses are ordinary and necessary.", reference: "IRC §162" },
  { id: '3', description: "Missing Form 8879 (e-file signature authorization).", riskLevel: RiskLevel.Low, recommendation: "Ensure Form 8879 is completed and retained for all e-filed returns.", reference: "IRS Pub 1345" },
];

export const DocumentUploadSection: React.FC = () => {
  const [documentText, setDocumentText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ComplianceIssue[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!documentText.trim()) {
      setError("Please paste some document content to analyze.");
      setAnalysisResult(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (documentText.toLowerCase().includes("error_trigger")) {
        setError("Simulated analysis error: Could not parse document structure.");
        setAnalysisResult(null);
    } else if (documentText.toLowerCase().includes("no_issues_trigger")) {
        setAnalysisResult([]);
    }
    else {
        const keywords = ['income', 'expense', 'signature', '1099', 'business', 'form'];
        const foundIssues = mockIssues.filter(issue => 
            keywords.some(keyword => documentText.toLowerCase().includes(keyword) && (issue.description.toLowerCase().includes(keyword) || (issue.reference && issue.reference.toLowerCase().includes(keyword))))
        );
        setAnalysisResult(foundIssues.length > 0 ? foundIssues : mockIssues.slice(0,1));
    }

    setIsLoading(false);
  }, [documentText]);

  const getRiskStyles = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.High: return 'text-red-500 dark:text-red-400 border-red-500 dark:border-red-400 bg-red-100 dark:bg-red-900/30';
      case RiskLevel.Medium: return 'text-yellow-500 dark:text-yellow-400 border-yellow-500 dark:border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case RiskLevel.Low: return 'text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-[rgb(var(--text-secondary))] border-[rgb(var(--border-secondary))] bg-[rgb(var(--bg-tertiary))]';
    }
  };
  
  const getRiskBadgeStyles = (riskLevel: RiskLevel) => {
     switch (riskLevel) {
      case RiskLevel.High: return 'text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-700/50';
      case RiskLevel.Medium: return 'text-yellow-700 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-700/50';
      case RiskLevel.Low: return 'text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-700/50';
      default: return 'text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-tertiary))]';
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <DocumentIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">Document Analysis</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))]">
        Paste the content of a tax document (e.g., a notice, a section of a return) below. The AI will (simulate) an analysis to identify potential compliance issues.
        Try including keywords like "income", "expense", "signature", or "no_issues_trigger" / "error_trigger" for varied simulated results.
      </p>
      
      <textarea
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
        placeholder="Paste document text here..."
        rows={10}
        className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-secondary))] transition-colors"
      />
      
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[rgb(var(--text-accent))] to-cyan-600 hover:from-[rgb(var(--text-accent-hover))] hover:to-cyan-700 text-white dark:text-[rgb(var(--text-on-accent))] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? <Spinner size="sm" color="text-white dark:text-[rgb(var(--text-on-accent))]" /> : <WarningIcon className="w-5 h-5" />}
        <span>Analyze Document</span>
      </button>

      {error && <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg">{error}</p>}

      {analysisResult && !isLoading && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">Analysis Results:</h3>
          {analysisResult.length === 0 ? (
            <p className="text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-tertiary))] p-4 rounded-lg">No significant compliance issues identified in the provided text.</p>
          ) : (
            <ul className="space-y-4">
              {analysisResult.map((issue) => (
                <li key={issue.id} className={`p-4 rounded-lg shadow border-l-4 ${getRiskStyles(issue.riskLevel)}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-[rgb(var(--text-primary))]">{issue.description}</h4>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskBadgeStyles(issue.riskLevel)}`}>
                      {issue.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">{issue.recommendation}</p>
                  {issue.reference && <p className="text-xs text-[rgb(var(--text-secondary))] opacity-80 mt-2">Reference: {issue.reference}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
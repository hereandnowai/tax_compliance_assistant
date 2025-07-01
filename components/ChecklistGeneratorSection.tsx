import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';
import { ChecklistItem } from '../types';
import { ChecklistIcon } from './icons';

const mockChecklists: { [key: string]: ChecklistItem[] } = {
  "Corporate-Federal": [
    { id: 'cf1', text: "File Form 1120 by the deadline.", completed: false, details: "U.S. Corporate Income Tax Return." },
    { id: 'cf2', text: "Make estimated tax payments if required.", completed: false, details: "Based on expected tax liability." },
    { id: 'cf3', text: "Maintain records for income, deductions, and credits.", completed: true, details: "Keep for at least 3 years from filing date." },
    { id: 'cf4', text: "Reconcile book income to taxable income (Schedule M-1/M-3).", completed: false },
  ],
  "Partnership-Federal": [
    { id: 'pf1', text: "File Form 1065 by the deadline.", completed: false, details: "U.S. Return of Partnership Income." },
    { id: 'pf2', text: "Issue Schedule K-1s to partners.", completed: false, details: "Shows partner's share of income, deductions, credits, etc." },
    { id: 'pf3', text: "Comply with partnership audit rules (BBA).", completed: false },
  ],
  "SoleProprietorship-Federal": [
    { id: 'spf1', text: "Report profit or loss on Schedule C (Form 1040).", completed: false },
    { id: 'spf2', text: "Pay self-employment taxes (Schedule SE).", completed: false },
    { id: 'spf3', text: "Make estimated tax payments.", completed: false },
  ]
};

const entityTypes = ["Corporate", "Partnership", "Sole Proprietorship", "S-Corporation", "LLC"];
const jurisdictions = ["Federal", "California", "New York", "Texas", "Florida"];


export const ChecklistGeneratorSection: React.FC = () => {
  const [entityType, setEntityType] = useState<string>(entityTypes[0]);
  const [jurisdiction, setJurisdiction] = useState<string>(jurisdictions[0]);
  const [checklist, setChecklist] = useState<ChecklistItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChecklist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setChecklist(null);

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const key = `${entityType}-${jurisdiction}`;
    if (mockChecklists[key]) {
      setChecklist(mockChecklists[key].map(item => ({...item, completed: false}))); 
    } else {
      setChecklist([
        { id: 'gen1', text: `Review ${jurisdiction} filing requirements for ${entityType}.`, completed: false },
        { id: 'gen2', text: `Identify all applicable forms for ${entityType} in ${jurisdiction}.`, completed: false },
        { id: 'gen3', text: "Confirm registration and good standing.", completed: false },
      ]);
    }
    setIsLoading(false);
  }, [entityType, jurisdiction]);
  
  const toggleItemCompletion = (id: string) => {
    setChecklist(prev => 
      prev?.map(item => item.id === id ? {...item, completed: !item.completed} : item) || null
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <ChecklistIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">Compliance Checklist Generator</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))]">
        Select the entity type and jurisdiction to generate a (simulated) tax compliance checklist.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="entityType" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Entity Type</label>
          <select
            id="entityType"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))]"
          >
            {entityTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Jurisdiction</label>
          <select
            id="jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="w-full p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))]"
          >
             {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      </div>
      
      <button
        onClick={handleGenerateChecklist}
        disabled={isLoading}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[rgb(var(--text-accent))] to-cyan-600 hover:from-[rgb(var(--text-accent-hover))] hover:to-cyan-700 text-white dark:text-[rgb(var(--text-on-accent))] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? <Spinner size="sm" color="text-white dark:text-[rgb(var(--text-on-accent))]" /> : <ChecklistIcon className="w-5 h-5" />}
        <span>Generate Checklist</span>
      </button>

      {error && <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg">{error}</p>}

      {checklist && !isLoading && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">Generated Checklist:</h3>
          {checklist.length === 0 ? (
            <p className="text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-tertiary))] p-4 rounded-lg">No checklist items found for this selection (this is a mock response).</p>
          ) : (
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item.id} className="bg-[rgb(var(--bg-tertiary))] p-4 rounded-lg shadow flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => toggleItemCompletion(item.id)}
                    className="mt-1 h-5 w-5 rounded border-[rgb(var(--border-secondary))] text-[rgb(var(--text-accent))] focus:ring-[rgb(var(--text-accent))] cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={`text-[rgb(var(--text-primary))] ${item.completed ? 'line-through text-[rgb(var(--text-secondary))]' : ''}`}>{item.text}</span>
                    {item.details && <p className={`text-xs mt-1 ${item.completed ? 'text-[rgb(var(--text-secondary))] opacity-70' : 'text-[rgb(var(--text-secondary))]'}`}>{item.details}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
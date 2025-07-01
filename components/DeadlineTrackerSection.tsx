import React, { useState, useMemo } from 'react';
import { TaxDeadline } from '../types';
import { CalendarIcon } from './icons';

const currentYear = new Date().getFullYear();

const mockDeadlines: TaxDeadline[] = [
  { id: 'd1', name: "Individual Tax Return (Form 1040)", date: `${currentYear}-04-15`, jurisdiction: "Federal" },
  { id: 'd2', name: "Corporate Tax Return (Form 1120)", date: `${currentYear}-04-15`, jurisdiction: "Federal", entityType: "C-Corporation" },
  { id: 'd3', name: "Partnership Return (Form 1065)", date: `${currentYear}-03-15`, jurisdiction: "Federal", entityType: "Partnership" },
  { id: 'd4', name: "S-Corp Return (Form 1120-S)", date: `${currentYear}-03-15`, jurisdiction: "Federal", entityType: "S-Corporation" },
  { id: 'd5', name: "Quarterly Estimated Tax Payment (Q1)", date: `${currentYear}-04-15`, jurisdiction: "Federal" },
  { id: 'd6', name: "Quarterly Estimated Tax Payment (Q2)", date: `${currentYear}-06-15`, jurisdiction: "Federal" },
  { id: 'd7', name: "Quarterly Estimated Tax Payment (Q3)", date: `${currentYear}-09-15`, jurisdiction: "Federal" },
  { id: 'd8', name: "Quarterly Estimated Tax Payment (Q4)", date: `${currentYear + 1}-01-15`, jurisdiction: "Federal" },
  { id: 'd9', name: "California Corporate Tax Return", date: `${currentYear}-04-15`, jurisdiction: "California", entityType: "C-Corporation" },
  { id: 'd10', name: "New York State Personal Income Tax", date: `${currentYear}-04-15`, jurisdiction: "New York" },
];

export const DeadlineTrackerSection: React.FC = () => {
  const [filterJurisdiction, setFilterJurisdiction] = useState<string>('All');
  const [filterEntityType, setFilterEntityType] = useState<string>('All');

  const jurisdictions = useMemo(() => ['All', ...new Set(mockDeadlines.map(d => d.jurisdiction))], []);
  const entityTypes = useMemo(() => ['All', ...new Set(mockDeadlines.filter(d => d.entityType).map(d => d.entityType!))], []);

  const filteredDeadlines = useMemo(() => {
    return mockDeadlines
      .filter(d => filterJurisdiction === 'All' || d.jurisdiction === filterJurisdiction)
      .filter(d => filterEntityType === 'All' || !d.entityType || d.entityType === filterEntityType)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filterJurisdiction, filterEntityType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <CalendarIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">Tax Deadline Tracker</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))]">
        View (mock) upcoming tax filing deadlines. Use filters to narrow down the list. Dates are for the current/next tax year.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[rgba(var(--bg-tertiary),0.5)] rounded-lg">
        <div>
          <label htmlFor="filterJurisdiction" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Filter by Jurisdiction</label>
          <select
            id="filterJurisdiction"
            value={filterJurisdiction}
            onChange={(e) => setFilterJurisdiction(e.target.value)}
            className="w-full p-2.5 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))]"
          >
            {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterEntityType" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">Filter by Entity Type</label>
          <select
            id="filterEntityType"
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="w-full p-2.5 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))]"
          >
            {entityTypes.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {filteredDeadlines.length === 0 ? (
        <p className="text-[rgb(var(--text-secondary))] text-center py-8">No deadlines match your current filters.</p>
      ) : (
        <div className="overflow-x-auto bg-[rgb(var(--bg-secondary))] shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-[rgb(var(--border-primary))]">
            <thead className="bg-[rgba(var(--bg-tertiary),0.5)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-accent))] uppercase tracking-wider">Deadline Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-accent))] uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-accent))] uppercase tracking-wider">Jurisdiction</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-accent))] uppercase tracking-wider">Entity Type</th>
              </tr>
            </thead>
            <tbody className="bg-[rgb(var(--bg-secondary))] divide-y divide-[rgb(var(--border-primary))]">
              {filteredDeadlines.map((deadline) => (
                <tr key={deadline.id} className="hover:bg-[rgb(var(--bg-interactive-hover))] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[rgb(var(--text-primary))]">{deadline.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--text-secondary))]">{new Date(deadline.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--text-secondary))]">{deadline.jurisdiction}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--text-secondary))]">{deadline.entityType || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <p className="text-xs text-[rgb(var(--text-secondary))] opacity-70 text-center mt-4">
        Note: These deadlines are illustrative and for the current year ({currentYear}). Always verify with official sources.
      </p>
    </div>
  );
};
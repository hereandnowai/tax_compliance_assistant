
export enum Feature {
  DocumentAnalysis = 'DocumentAnalysis',
  ChecklistGeneration = 'ChecklistGeneration',
  DeadlineTracking = 'DeadlineTracking',
  TaxResearch = 'TaxResearch',
  RegulatoryUpdateSummarizer = 'RegulatoryUpdateSummarizer',
  ClientCommunicationAssistant = 'ClientCommunicationAssistant',
  AppExplanationAssistant = 'AppExplanationAssistant',
  Settings = 'Settings', // Added
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  details?: string;
}

export enum RiskLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface ComplianceIssue {
  id: string;
  description: string;
  riskLevel: RiskLevel;
  recommendation: string;
  reference?: string; 
}

export interface TaxDeadline {
  id: string;
  name: string;
  date: string;
  jurisdiction: string;
  entityType?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  references?: Array<{ title: string; uri: string }>;
}
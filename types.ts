
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  FOLLOW_UP_SENT = 'Follow-up Sent',
  CLOSED = 'Closed',
  LOST = 'Lost'
}

export enum Platform {
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  WEB_FORM = 'Web Form'
}

export interface Lead {
  id: string;
  name: string;
  username: string;
  profileLink: string;
  keyword: string;
  contact: string;
  phone?: string; // New: For WhatsApp integration
  platform: Platform;
  status: LeadStatus;
  createdAt: string;
  lastFollowUp: string | null;
  nextFollowUp: string | null;
  notes: string;
  score: number;
  conversionProbability: number; // New: Predictive Analytics
  aiSummary?: string;
}

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'delay' | 'condition' | 'ai';
  label: string;
  description: string;
  config?: any;
}

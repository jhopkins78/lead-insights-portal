
export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  score?: number;
  last_insight?: string;
  email?: string;
  intent?: string;
  confidence?: number;
  additional_data?: Record<string, any>;
  deal_amount?: number;
  engagement_score?: number;
  industry?: string;
  stage?: string;
}

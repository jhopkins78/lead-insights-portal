
export interface Prediction {
  lead_name: string;
  company: string;
  deal_amount?: number;
  lead_score: number;
  classification: string;
  predicted_at: string;
  gpt_summary: string;
  industry?: string;
  stage?: string;
  engagement_score?: number;
}

export interface DateRange {
  from?: string;
  to?: string;
}

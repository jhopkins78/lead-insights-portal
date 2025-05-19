
/**
 * API service for the Lead Insights Portal
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Type definitions for the API responses
export interface InsightResponse {
  insight: string;
  confidence: number;
  timestamp: string;
}

export interface LeadAnalysisResponse {
  score: number;
  enriched_data: {
    company_info?: {
      size?: string;
      industry?: string;
      founded?: string;
      location?: string;
    };
    contact_info?: {
      phone?: string;
      linkedin?: string;
      twitter?: string;
    };
    engagement_history?: {
      last_interaction?: string;
      interaction_count?: number;
      channels?: string[];
    };
  };
  recommendations: string[];
}

export interface LtvEstimateResponse {
  estimated_ltv: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  factors: {
    name: string;
    impact: number;
  }[];
}

export interface LeadAnalysisRequest {
  name: string;
  title: string;
  company: string;
  email: string;
  intent: string;
}

export interface LtvEstimateRequest {
  deal_amount: number;
  repeat_purchases: number;
}

// API Functions
export const generateInsight = async (input: string): Promise<InsightResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/insights/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to generate insight:", error);
    throw error;
  }
};

export const analyzeLead = async (leadData: LeadAnalysisRequest): Promise<LeadAnalysisResponse> => {
  try {
    // Map our internal LeadAnalysisRequest structure to what the API expects
    const apiRequestBody = {
      lead_name: leadData.name,
      job_title: leadData.title,
      email: leadData.email,
      company: leadData.company,
      intent: leadData.intent
    };

    const response = await fetch(`${API_BASE_URL}/leads/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to analyze lead:", error);
    throw error;
  }
};

export const estimateLtv = async (ltvData: LtvEstimateRequest): Promise<LtvEstimateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/ltv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ltvData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to estimate LTV:", error);
    throw error;
  }
};


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
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
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

    console.log("Sending lead data to API:", apiRequestBody);
    console.log("API URL:", `${API_BASE_URL}/leads/analyze`);

    // Add timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_BASE_URL}/leads/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Failed to analyze lead:", error);
    
    // Provide more specific error message based on the error type
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error: Unable to connect to the API server. Please check your internet connection.");
    } else if (error.name === "AbortError") {
      throw new Error("Request timeout: The server took too long to respond.");
    }
    
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
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to estimate LTV:", error);
    throw error;
  }
};

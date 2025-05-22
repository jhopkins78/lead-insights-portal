
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

// Mock data for fallback when API is unavailable
const MOCK_LEAD_ANALYSIS: LeadAnalysisResponse = {
  score: 75,
  enriched_data: {
    company_info: {
      size: "50-200 employees",
      industry: "Software & Technology",
      founded: "2015",
      location: "San Francisco, CA"
    },
    contact_info: {
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/company/demo",
      twitter: "https://twitter.com/demo"
    },
    engagement_history: {
      last_interaction: "2025-05-15",
      interaction_count: 3,
      channels: ["Email", "Website Visit"]
    }
  },
  recommendations: [
    "Schedule a follow-up call within 48 hours",
    "Share case study about similar customer in their industry",
    "Offer a personalized product demo"
  ]
};

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
    
    // Check if we should use mock data (for development/demo purposes)
    if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
      console.log("Using mock lead data due to API error");
      // Add some randomness to the mock data to make it look dynamic
      const mockData = { 
        ...MOCK_LEAD_ANALYSIS, 
        score: Math.floor(Math.random() * 30) + 65 // Random score between 65-95
      };
      
      // Customize mock data with the actual lead name and company
      if (mockData.recommendations && mockData.recommendations.length > 0) {
        mockData.recommendations[0] = `Contact ${leadData.name} from ${leadData.company}`;
      }
      
      return mockData;
    }
    
    // Provide more specific error message based on the error type
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error: Unable to connect to the API server. Please check your internet connection.");
    } else if (error instanceof TypeError && error.message === "Load failed") {
      throw new Error("Network error: API endpoint unreachable. The service may be down or experiencing issues.");
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


import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Prediction } from "@/components/prediction-history/types";

// Sample data to use when Supabase is not configured
const SAMPLE_PREDICTIONS: Prediction[] = [
  {
    id: 1,
    lead_name: "Sample Lead 1",
    company: "Sample Company",
    lead_score: 85,
    classification: "Hot Lead",
    predicted_at: new Date().toISOString(),
    industry: "Technology",
    stage: "Negotiation",
    engagement_score: 75,
    deal_amount: 15000
  },
  {
    id: 2,
    lead_name: "Sample Lead 2",
    company: "Demo Enterprise",
    lead_score: 62,
    classification: "Warm Lead",
    predicted_at: new Date(Date.now() - 86400000).toISOString(),
    industry: "Finance",
    stage: "Discovery",
    engagement_score: 45,
    deal_amount: 8500
  }
];

export const fetchPredictions = async () => {
  // Return sample data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.warn("Using sample prediction data because Supabase is not configured");
    return SAMPLE_PREDICTIONS;
  }
  
  const { data, error } = await supabase
    .from('lead_predictions')
    .select('*')
    .order('predicted_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return (data || []) as Prediction[];
};

export const rescorePrediction = async (prediction: Prediction) => {
  // If Supabase is not configured, simulate a successful API call
  if (!isSupabaseConfigured()) {
    console.warn("Using mock rescoring because Supabase is not configured");
    return {
      ...prediction,
      lead_score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      classification: "Hot Lead",
      predicted_at: new Date().toISOString()
    };
  }
  
  // Call to external API to rescore
  const response = await fetch("https://lead-commander-api.onrender.com/leads/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: prediction.lead_name,
      company: prediction.company,
      deal_amount: prediction.deal_amount,
      engagement_score: prediction.engagement_score,
      industry: prediction.industry,
      stage: prediction.stage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  const newPredictionData = await response.json();
  
  // Update in Supabase
  const { error } = await supabase
    .from('lead_predictions')
    .update({
      lead_score: newPredictionData.lead_score || prediction.lead_score,
      predicted_at: new Date().toISOString(),
      classification: newPredictionData.classification || prediction.classification
    })
    .eq('lead_name', prediction.lead_name);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return newPredictionData;
};

export const getPredictionByName = async (name: string) => {
  // Return a sample if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const sample = SAMPLE_PREDICTIONS.find(p => p.lead_name === name) || SAMPLE_PREDICTIONS[0];
    console.warn("Using sample prediction data because Supabase is not configured");
    return sample;
  }
  
  const { data, error } = await supabase
    .from('lead_predictions')
    .select('*')
    .eq('lead_name', name)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Prediction;
};

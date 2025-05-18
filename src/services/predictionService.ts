
import { supabase } from "@/lib/supabaseClient";
import { Prediction } from "@/components/prediction-history/types";

export const fetchPredictions = async () => {
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

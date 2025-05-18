
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Prediction } from "@/components/prediction-history/types";

export function usePredictionData() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch predictions from Supabase
  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('lead_predictions')
          .select('*')
          .order('predicted_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setPredictions(data as Prediction[]);
        } else {
          setPredictions([]);
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to fetch prediction history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [toast]);

  // Refetch predictions (useful after operations like re-scoring)
  const refetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('lead_predictions')
        .select('*')
        .order('predicted_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        setPredictions(data as Prediction[]);
      }
    } catch (err) {
      console.error("Error refetching predictions:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    allPredictions: predictions, 
    isLoading, 
    error, 
    refetchPredictions 
  };
}

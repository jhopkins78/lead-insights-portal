
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/components/prediction-history/types";
import { fetchPredictions } from "@/services/predictionService";

export function usePredictionData() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch predictions using our service
  useEffect(() => {
    const loadPredictions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchPredictions();
        setPredictions(data);
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

    loadPredictions();
  }, [toast]);

  // Refetch predictions (useful after operations like re-scoring)
  const refetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPredictions();
      setPredictions(data);
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

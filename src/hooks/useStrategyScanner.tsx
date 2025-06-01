
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StrategyResponse {
  recommendations: string[];
  dataset_summary: string;
}

export const useStrategyScanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<StrategyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const scanStrategy = async (datasetId: string, marketText?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/strategy/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset_id: datasetId,
          market_text: marketText || ""
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data: StrategyResponse = await response.json();
      setScanResults(data);

      toast({
        title: "Strategy scan complete",
        description: `Analysis completed for ${data.dataset_summary}`,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan strategy';
      setError(errorMessage);
      
      console.error('Strategy scan error:', err);
      
      toast({
        title: "Strategy scan failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setScanResults(null);
    setError(null);
  };

  return {
    isLoading,
    scanResults,
    error,
    scanStrategy,
    clearResults,
  };
};

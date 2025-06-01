
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ForecastValue {
  period: string;
  value: number;
}

interface ForecastResponse {
  forecast_target: string;
  forecast_values: ForecastValue[];
  method: string;
  summary: string;
}

interface ForecastRequest {
  dataset_id: string;
  forecast_target?: string;
}

export const useForecast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const generateForecast = async (data: ForecastRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/forecast/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const result: ForecastResponse = await response.json();
      setForecastData(result);

      toast({
        title: "Forecast generated successfully",
        description: `${result.forecast_target} forecast completed using ${result.method}`,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate forecast';
      setError(errorMessage);
      
      console.error('Forecast generation error:', err);
      
      toast({
        title: "Forecast generation failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearForecast = () => {
    setForecastData(null);
    setError(null);
  };

  return {
    isLoading,
    forecastData,
    error,
    generateForecast,
    clearForecast,
  };
};

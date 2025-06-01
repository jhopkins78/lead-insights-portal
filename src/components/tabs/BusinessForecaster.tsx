
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import { useForecast } from "@/hooks/useForecast";
import ForecastVisualizer from "./BusinessForecaster/ForecastVisualizer";

const BusinessForecaster: React.FC = () => {
  const { currentDataset } = useDataset();
  const { toast } = useToast();
  const {
    isLoading,
    forecastData,
    error,
    generateForecast,
    clearForecast,
  } = useForecast();

  const [forecastTarget, setForecastTarget] = useState<string>("revenue");

  const forecastTargets = [
    { value: "revenue", label: "Revenue" },
    { value: "leads", label: "Leads" },
    { value: "conversions", label: "Conversions" },
    { value: "sales", label: "Sales" },
  ];

  const handleGenerateForecast = async () => {
    if (!currentDataset) {
      toast({
        title: "Dataset required",
        description: "Please select a dataset to generate forecasts",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateForecast({
        dataset_id: currentDataset.id,
        forecast_target: forecastTarget,
      });
    } catch (error) {
      // Error handling is already done in the hook
      console.error("Forecast generation failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Business Forecaster</h2>
        <p className="text-muted-foreground mb-6">
          Generate predictive forecasts for key business metrics using advanced time series analysis
        </p>
      </div>

      {/* Dataset Status */}
      <DatasetStatus moduleName="Business Forecaster" />

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Forecast Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Forecast Target</label>
            <Select value={forecastTarget} onValueChange={setForecastTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select target metric" />
              </SelectTrigger>
              <SelectContent>
                {forecastTargets.map((target) => (
                  <SelectItem key={target.value} value={target.value}>
                    {target.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleGenerateForecast} 
              disabled={isLoading || !currentDataset}
              className="flex-1 md:flex-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Forecast...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Forecast
                </>
              )}
            </Button>
            
            {forecastData && (
              <Button 
                variant="outline" 
                onClick={clearForecast}
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Forecast Results */}
      {forecastData && (
        <ForecastVisualizer
          forecastTarget={forecastData.forecast_target}
          forecastValues={forecastData.forecast_values}
          method={forecastData.method}
          summary={forecastData.summary}
        />
      )}
    </div>
  );
};

export default BusinessForecaster;

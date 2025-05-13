import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChartBar, BarChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ModelMetric {
  r2_score: number;
  rmse: number;
  mae: number;
}

interface ModelComparison {
  model_name: string;
  metrics: ModelMetric;
}

const ModelMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetric | null>(null);
  const [comparisons, setComparisons] = useState<ModelComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestModel, setBestModel] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<{[key: string]: boolean}>({});
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would fetch from your API
      const response = await fetch("https://api.example.com/model-metrics");
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMetrics(data.best_metrics);
      setComparisons(data.model_comparisons);
      
      // Determine best model based on R² score
      const bestModelData = data.model_comparisons.reduce(
        (best: ModelComparison | null, current: ModelComparison) => {
          if (!best || current.metrics.r2_score > best.metrics.r2_score) {
            return current;
          }
          return best;
        },
        null
      );
      
      setBestModel(bestModelData?.model_name || null);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      setError("Failed to fetch model metrics. Please try again.");
      
      // For demonstration purposes, set mock data
      const mockComparisons = [
        {
          model_name: "Linear Regression",
          metrics: {
            r2_score: 0.87,
            rmse: 0.45,
            mae: 0.32
          }
        },
        {
          model_name: "Random Forest",
          metrics: {
            r2_score: 0.92,
            rmse: 0.32,
            mae: 0.28
          }
        },
        {
          model_name: "KNN Regressor",
          metrics: {
            r2_score: 0.83,
            rmse: 0.52,
            mae: 0.37
          }
        },
        {
          model_name: "XGBoost",
          metrics: {
            r2_score: 0.91,
            rmse: 0.34,
            mae: 0.29
          }
        }
      ];
      
      setComparisons(mockComparisons);
      setMetrics(mockComparisons[1].metrics); // Random Forest is best
      setBestModel("Random Forest");
      
      // Initialize selected models
      const initialSelectedModels: {[key: string]: boolean} = {};
      mockComparisons.forEach(model => {
        initialSelectedModels[model.model_name] = true;
      });
      setSelectedModels(initialSelectedModels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    // Prepare data for the chart
    if (comparisons.length > 0) {
      // Initialize selected models if not already set
      if (Object.keys(selectedModels).length === 0) {
        const initialSelectedModels: {[key: string]: boolean} = {};
        comparisons.forEach(model => {
          initialSelectedModels[model.model_name] = true;
        });
        setSelectedModels(initialSelectedModels);
      }

      // Generate chart data
      const chartMetrics = [
        { name: "R² Score", key: "r2_score", higherIsBetter: true },
        { name: "RMSE", key: "rmse", higherIsBetter: false },
        { name: "MAE", key: "mae", higherIsBetter: false }
      ];
      
      const data = chartMetrics.map(metric => {
        const entry: {[key: string]: any} = { name: metric.name };
        comparisons.forEach(model => {
          if (selectedModels[model.model_name]) {
            entry[model.model_name] = model.metrics[metric.key as keyof ModelMetric];
          }
        });
        return entry;
      });
      
      setChartData(data);
    }
  }, [comparisons, selectedModels]);

  const formatMetric = (value: number): string => {
    return value.toFixed(3);
  };

  const toggleModelSelection = (modelName: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }));
  };

  const getBestMetricForComparison = (metricKey: keyof ModelMetric, higherIsBetter: boolean = true) => {
    let bestValue: number | null = null;
    let bestModelName: string | null = null;
    
    comparisons.forEach(comp => {
      const value = comp.metrics[metricKey];
      if (bestValue === null || 
          (higherIsBetter && value > bestValue) || 
          (!higherIsBetter && value < bestValue)) {
        bestValue = value;
        bestModelName = comp.model_name;
      }
    });
    
    return { value: bestValue, modelName: bestModelName };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Model Evaluation Metrics</h2>
        <Button 
          onClick={fetchMetrics} 
          variant="outline" 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Metrics
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          // ... keep existing code (skeleton loaders)
          Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          // ... keep existing code (metric cards)
          <>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">R² Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.r2_score ? formatMetric(metrics.r2_score) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">Coefficient of determination</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">RMSE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.rmse ? formatMetric(metrics.rmse) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">Root Mean Squared Error</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">MAE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.mae ? formatMetric(metrics.mae) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">Mean Absolute Error</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Model Comparison</h3>
        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                {comparisons.map((comparison) => (
                  <TableHead key={comparison.model_name}>
                    {comparison.model_name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">R² Score</TableCell>
                {comparisons.map((comparison) => (
                  <TableCell 
                    key={`${comparison.model_name}-r2`}
                    className={bestModel === comparison.model_name ? 'font-bold bg-green-50' : ''}
                  >
                    {formatMetric(comparison.metrics.r2_score)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">RMSE</TableCell>
                {comparisons.map((comparison) => (
                  <TableCell key={`${comparison.model_name}-rmse`}>
                    {formatMetric(comparison.metrics.rmse)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MAE</TableCell>
                {comparisons.map((comparison) => (
                  <TableCell key={`${comparison.model_name}-mae`}>
                    {formatMetric(comparison.metrics.mae)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* New Model Comparison Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Compare Models</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {comparisons.map((model) => (
            <div key={`select-${model.model_name}`} className="flex items-center space-x-2">
              <Checkbox 
                id={`select-${model.model_name}`} 
                checked={selectedModels[model.model_name]} 
                onCheckedChange={() => toggleModelSelection(model.model_name)}
              />
              <label 
                htmlFor={`select-${model.model_name}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {model.model_name}
              </label>
            </div>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Model Performance Comparison
            </CardTitle>
            <CardDescription>
              Relative performance metrics across selected models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {comparisons.map((model, index) => (
                    selectedModels[model.model_name] && (
                      <Bar 
                        key={model.model_name}
                        dataKey={model.model_name} 
                        fill={`hsl(${index * 60}, 70%, 50%)`} 
                      />
                    )
                  ))}
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Side-by-Side Metric Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {comparisons.filter(model => selectedModels[model.model_name]).map((model) => (
                    <TableHead key={`header-${model.model_name}`}>
                      {model.model_name}
                      {model.model_name === bestModel && (
                        <Badge className="ml-2 bg-green-500">Best</Badge>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">R² Score</TableCell>
                  {comparisons.filter(model => selectedModels[model.model_name]).map((model) => {
                    const best = getBestMetricForComparison("r2_score", true);
                    const isBest = best.modelName === model.model_name;
                    return (
                      <TableCell 
                        key={`comp-${model.model_name}-r2`}
                        className={isBest ? 'font-bold text-green-600 bg-green-50' : ''}
                      >
                        {formatMetric(model.metrics.r2_score)}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">RMSE</TableCell>
                  {comparisons.filter(model => selectedModels[model.model_name]).map((model) => {
                    const best = getBestMetricForComparison("rmse", false);
                    const isBest = best.modelName === model.model_name;
                    return (
                      <TableCell 
                        key={`comp-${model.model_name}-rmse`}
                        className={isBest ? 'font-bold text-green-600 bg-green-50' : ''}
                      >
                        {formatMetric(model.metrics.rmse)}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MAE</TableCell>
                  {comparisons.filter(model => selectedModels[model.model_name]).map((model) => {
                    const best = getBestMetricForComparison("mae", false);
                    const isBest = best.modelName === model.model_name;
                    return (
                      <TableCell 
                        key={`comp-${model.model_name}-mae`}
                        className={isBest ? 'font-bold text-green-600 bg-green-50' : ''}
                      >
                        {formatMetric(model.metrics.mae)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {bestModel && (
        <Alert className="bg-green-50 border-green-200">
          <ChartBar className="h-5 w-5 text-green-600" />
          <AlertTitle>Best Performing Model: {bestModel}</AlertTitle>
          <AlertDescription>
            The {bestModel} model shows better overall performance with higher R² score 
            {comparisons.find(m => m.model_name === bestModel)?.metrics.r2_score 
              ? ` (${formatMetric(comparisons.find(m => m.model_name === bestModel)!.metrics.r2_score)})` 
              : ''} and lower error metrics.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ModelMetrics;

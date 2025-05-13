
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  estimateLtv, 
  LtvEstimateResponse, 
  LtvEstimateRequest 
} from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  Calculator,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LtvStatistics from "@/components/visualizations/LtvStatistics";

const LtvEstimator: React.FC = () => {
  const [formData, setFormData] = useState<LtvEstimateRequest>({
    deal_amount: 0,
    repeat_purchases: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LtvEstimateResponse | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.deal_amount <= 0) {
      toast({
        title: "Invalid deal amount",
        description: "Deal amount must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await estimateLtv(formData);
      setResult(data);
      toast({
        title: "LTV estimated",
        description: "Lifetime value has been estimated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to estimate LTV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data for visualization
  const getChartData = () => {
    if (!result) return [];
    
    // Create a simple projection over time periods
    const periods = 5;
    const baseValue = result.estimated_ltv / periods;
    
    return Array.from({ length: periods }, (_, i) => ({
      period: `Year ${i + 1}`,
      value: baseValue * (i + 1),
      lowerBound: (result.confidence_interval.lower / periods) * (i + 1),
      upperBound: (result.confidence_interval.upper / periods) * (i + 1),
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">LTV Estimator</h2>
        <p className="text-muted-foreground">
          Calculate the estimated lifetime value of your leads.
        </p>
      </div>

      {/* Insert statistical visualizations below the title */}
      <LtvStatistics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deal_amount">Initial Deal Amount ($)</Label>
                  <Input
                    id="deal_amount"
                    name="deal_amount"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.deal_amount || ""}
                    onChange={handleChange}
                    placeholder="5000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repeat_purchases">Expected Repeat Purchases</Label>
                  <Input
                    id="repeat_purchases"
                    name="repeat_purchases"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.repeat_purchases || ""}
                    onChange={handleChange}
                    placeholder="3"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-insight-500 hover:bg-insight-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" /> Estimate LTV
                </>
              )}
            </Button>
          </form>

          {result && (
            <Card className="mt-6 border-t-4 border-t-insight-500">
              <CardHeader>
                <CardTitle>Estimated Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-4xl font-bold text-insight-700">
                    {formatCurrency(result.estimated_ltv)}
                  </div>
                  <div className="text-sm text-center">
                    <div className="text-muted-foreground">
                      Confidence Range: {formatCurrency(result.confidence_interval.lower)} - {formatCurrency(result.confidence_interval.upper)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>LTV Projection</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData()}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#9b87f5"
                        fill="#E5DEFF"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {result.factors && result.factors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contributing Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.factors.map((factor, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="font-medium">{factor.name}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          factor.impact > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <ArrowRight className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>Enter deal information to see LTV projections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LtvEstimator;


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calculator, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BusinessForecaster: React.FC = () => {
  const [industry, setIndustry] = useState<string>("");
  const [customerCount, setCustomerCount] = useState<string>("1000");
  const [avgRevenue, setAvgRevenue] = useState<string>("100");
  const [cac, setCac] = useState<string>("50");
  const [churnRate, setChurnRate] = useState<number[]>([0.15]);
  const [growthRate, setGrowthRate] = useState<number[]>([0.05]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    if (!industry || !customerCount || !avgRevenue || !cac) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Simple mock calculation
      const numCustomers = parseInt(customerCount);
      const revenue = parseFloat(avgRevenue);
      const customerAcquisitionCost = parseFloat(cac);
      const churn = churnRate[0];
      const growth = growthRate[0];
      
      const avgLifespan = 1 / churn;
      const ltv = revenue * avgLifespan;
      const roi = (ltv - customerAcquisitionCost) / customerAcquisitionCost;
      const yearlyRevenue = numCustomers * revenue * 12;
      const yearlyProfit = yearlyRevenue - (numCustomers * growth * customerAcquisitionCost);
      
      setResults({
        ltv: ltv.toFixed(2),
        roi: (roi * 100).toFixed(1),
        breakEvenMonths: (customerAcquisitionCost / revenue).toFixed(1),
        yearlyRevenue: yearlyRevenue.toFixed(0),
        yearlyProfit: yearlyProfit.toFixed(0),
        customerLifespan: avgLifespan.toFixed(1)
      });
      
      setIsCalculating(false);
      
      toast({
        title: "Forecast complete",
        description: "Business metrics have been calculated",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Business Forecaster</h2>
        <p className="text-muted-foreground mb-6">
          Predict business metrics and financial outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>Business Inputs</span>
              </CardTitle>
              <CardDescription>
                Enter your business data to generate forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customers">Total Customers</Label>
                    <Input 
                      id="customers" 
                      type="number"
                      value={customerCount} 
                      onChange={(e) => setCustomerCount(e.target.value)} 
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Avg. Monthly Revenue per Customer ($)</Label>
                    <Input 
                      id="revenue" 
                      type="number"
                      value={avgRevenue} 
                      onChange={(e) => setAvgRevenue(e.target.value)} 
                      placeholder="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cac">Customer Acquisition Cost ($)</Label>
                    <Input 
                      id="cac" 
                      type="number"
                      value={cac} 
                      onChange={(e) => setCac(e.target.value)} 
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Monthly Churn Rate: {(churnRate[0] * 100).toFixed(1)}%</Label>
                    </div>
                    <Slider
                      defaultValue={[0.15]}
                      max={0.5}
                      step={0.01}
                      value={churnRate}
                      onValueChange={setChurnRate}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Monthly Growth Rate: {(growthRate[0] * 100).toFixed(1)}%</Label>
                    </div>
                    <Slider
                      defaultValue={[0.05]}
                      max={0.2}
                      step={0.01}
                      value={growthRate}
                      onValueChange={setGrowthRate}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  disabled={isCalculating}
                  className="w-full md:w-auto bg-insight-500 hover:bg-insight-600"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-5 w-5" />
                      <span>Calculate Forecast</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={`h-full ${results ? 'border-insight-500' : 'border-dashed'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Forecast Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Customer LTV</p>
                    <p className="text-2xl font-bold text-insight-800">${results.ltv}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">ROI</p>
                    <p className="text-2xl font-bold text-insight-800">{results.roi}%</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Break-even Time</p>
                    <p className="text-2xl font-bold text-insight-800">{results.breakEvenMonths} months</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Avg. Customer Lifespan</p>
                    <p className="text-2xl font-bold text-insight-800">{results.customerLifespan} months</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Projected Annual Revenue</p>
                    <p className="text-2xl font-bold text-insight-800">${new Intl.NumberFormat().format(parseInt(results.yearlyRevenue))}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Projected Annual Profit</p>
                    <p className="text-2xl font-bold text-insight-800">${new Intl.NumberFormat().format(parseInt(results.yearlyProfit))}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground">Enter your business data and calculate to see forecast results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessForecaster;

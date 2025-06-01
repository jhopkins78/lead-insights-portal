
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import { useStrategyScanner } from "@/hooks/useStrategyScanner";
import StrategyRecommendations from "@/components/tabs/strategy-scanner/StrategyRecommendations";

const StrategyScanner: React.FC = () => {
  const { currentDataset } = useDataset();
  const [marketText, setMarketText] = useState<string>("");
  const { toast } = useToast();
  
  const {
    isLoading,
    scanResults,
    error,
    scanStrategy,
    clearResults,
  } = useStrategyScanner();
  
  // Function to handle the scan request
  const handleScan = async () => {
    if (!currentDataset) {
      toast({
        title: "Dataset required",
        description: "Please select a dataset to perform strategy scanning",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await scanStrategy(currentDataset.id, marketText);
    } catch (error) {
      // Error handling is already done in the hook
      console.error("Strategy scan failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Strategy Scanner</h2>
        <p className="text-muted-foreground mb-6">
          Analyze market texts and documents to identify strategic signals, trends, and actionable insights.
        </p>
      </div>

      {/* Dataset Status */}
      <DatasetStatus moduleName="Strategy Scanner" />

      <div className="grid gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="marketText" className="block text-sm font-medium">
              Additional Market Context {currentDataset ? "(Optional)" : ""}
            </label>
            <Textarea
              id="marketText"
              value={marketText}
              onChange={(e) => setMarketText(e.target.value)}
              placeholder="Add any additional market research, news, or trend data here..."
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleScan} 
              disabled={isLoading || !currentDataset}
              className="flex-1 md:flex-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning Strategy...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Scan for Strategic Insights
                </>
              )}
            </Button>
            
            {scanResults && (
              <Button 
                variant="outline" 
                onClick={clearResults}
                disabled={isLoading}
              >
                Clear Results
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
        </div>
        
        {scanResults && (
          <StrategyRecommendations 
            recommendations={scanResults.recommendations}
            datasetSummary={scanResults.dataset_summary}
          />
        )}
      </div>
    </div>
  );
};

export default StrategyScanner;

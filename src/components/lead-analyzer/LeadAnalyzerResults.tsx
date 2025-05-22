
import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LeadScoreCard from "./LeadScoreCard";
import EnrichedDataCard from "./EnrichedDataCard";
import { LeadAnalysisResponse } from "@/services/api";
import { Button } from "@/components/ui/button";

interface LeadAnalyzerResultsProps {
  result: LeadAnalysisResponse | null;
  error?: string | null;
  onRetry?: () => void;
}

const LeadAnalyzerResults: React.FC<LeadAnalyzerResultsProps> = ({ result, error, onRetry }) => {
  if (error) {
    // Determine if this is a network/API error
    const isNetworkError = error.toLowerCase().includes("network") || 
                           error.toLowerCase().includes("unable to connect") ||
                           error.toLowerCase().includes("unreachable") ||
                           error.toLowerCase().includes("timeout") ||
                           error.toLowerCase().includes("load failed");
    
    return (
      <Alert variant="destructive" className="mt-8">
        {isNetworkError ? <AlertTriangle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        <AlertTitle>{isNetworkError ? "Connection Error" : "Analysis Error"}</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          {isNetworkError && (
            <div className="text-sm">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Check your internet connection</li>
                <li>The API server may be temporarily down</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>
          )}
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="self-start mt-2"
              size="sm"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!result) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <LeadScoreCard result={result} />
      <EnrichedDataCard result={result} />
    </div>
  );
};

export default LeadAnalyzerResults;

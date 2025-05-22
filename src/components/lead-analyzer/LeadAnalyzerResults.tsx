
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LeadScoreCard from "./LeadScoreCard";
import EnrichedDataCard from "./EnrichedDataCard";
import { LeadAnalysisResponse } from "@/services/api";

interface LeadAnalyzerResultsProps {
  result: LeadAnalysisResponse | null;
  error?: string | null;
}

const LeadAnalyzerResults: React.FC<LeadAnalyzerResultsProps> = ({ result, error }) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
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

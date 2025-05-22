
import React from "react";
import LeadScoreCard from "./LeadScoreCard";
import EnrichedDataCard from "./EnrichedDataCard";
import { LeadAnalysisResponse } from "@/services/api";

interface LeadAnalyzerResultsProps {
  result: LeadAnalysisResponse;
}

const LeadAnalyzerResults: React.FC<LeadAnalyzerResultsProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <LeadScoreCard result={result} />
      <EnrichedDataCard result={result} />
    </div>
  );
};

export default LeadAnalyzerResults;

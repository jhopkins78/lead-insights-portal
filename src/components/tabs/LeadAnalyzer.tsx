
import React, { useState } from "react";
import { LeadAnalysisResponse } from "@/services/api";
import LeadAnalyzerForm from "@/components/lead-analyzer/LeadAnalyzerForm";
import LeadAnalyzerResults from "@/components/lead-analyzer/LeadAnalyzerResults";

const LeadAnalyzer: React.FC = () => {
  const [result, setResult] = useState<LeadAnalysisResponse | null>(null);

  const handleAnalysisComplete = (analysisResult: LeadAnalysisResponse) => {
    setResult(analysisResult);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Lead Analyzer</h2>
        <p className="text-muted-foreground">
          Enter lead details below for comprehensive analysis.
        </p>
      </div>

      <LeadAnalyzerForm onAnalysisComplete={handleAnalysisComplete} />
      
      {result && <LeadAnalyzerResults result={result} />}
    </div>
  );
};

export default LeadAnalyzer;

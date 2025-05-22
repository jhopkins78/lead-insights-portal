
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LeadAnalysisResponse } from "@/services/api";
import LeadAnalyzerForm from "@/components/lead-analyzer/LeadAnalyzerForm";
import LeadAnalyzerResults from "@/components/lead-analyzer/LeadAnalyzerResults";

const LeadAnalyzer: React.FC = () => {
  const [result, setResult] = useState<LeadAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [lastFormData, setLastFormData] = useState<any>(null);

  const handleAnalysisComplete = (analysisResult: LeadAnalysisResponse) => {
    setResult(analysisResult);
    setError(null);
    setApiStatus('success');
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setApiStatus('error');
  };
  
  const handleRetry = () => {
    if (lastFormData) {
      // Reset the error state
      setError(null);
      setApiStatus('idle');
      
      // Re-submit the last form data
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  };

  const handleFormDataCapture = (formData: any) => {
    setLastFormData(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Lead Analyzer</h2>
        <p className="text-muted-foreground">
          Enter lead details below for comprehensive analysis.
        </p>
      </div>

      {apiStatus === 'error' && !error?.includes("Network error") && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription>
            There was a problem connecting to the analysis service. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <LeadAnalyzerForm 
        onAnalysisComplete={handleAnalysisComplete} 
        onAnalysisError={handleAnalysisError}
        onFormDataCapture={handleFormDataCapture}
      />
      
      <LeadAnalyzerResults 
        result={result} 
        error={error} 
        onRetry={handleRetry}
      />
    </div>
  );
};

export default LeadAnalyzer;

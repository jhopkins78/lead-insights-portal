
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ReportComposeRequest {
  dataset_id: string;
  analysis_summary?: string;
  metrics?: any;
  strategy_recommendations?: string[];
}

interface ReportResponse {
  markdown: string;
}

export const useReportComposer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const generateReport = async (data: ReportComposeRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/compose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const result: ReportResponse = await response.json();
      setReportMarkdown(result.markdown);

      toast({
        title: "Report generated successfully",
        description: "Your comprehensive report is ready for review and download",
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      
      console.error('Report generation error:', err);
      
      toast({
        title: "Report generation failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setReportMarkdown(null);
    setError(null);
  };

  const downloadMarkdown = () => {
    if (!reportMarkdown) return;
    
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lead_intelligence_report.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    isLoading,
    reportMarkdown,
    error,
    generateReport,
    clearReport,
    downloadMarkdown,
  };
};

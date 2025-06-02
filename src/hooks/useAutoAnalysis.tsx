import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

type AgentStatus = {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  message?: string;
};

type ProcessingStatusType = "idle" | "processing" | "completed" | "failed";

export const useAutoAnalysis = () => {
  const [status, setStatus] = useState<ProcessingStatusType>("idle");
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: "EDA Agent", status: "pending" },
    { name: "Modeling Agent", status: "pending" },
    { name: "Evaluation Agent", status: "pending" }
  ]);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const startAnalysis = useCallback(async (currentDataset: any) => {
    if (!currentDataset) {
      toast({
        title: "No dataset selected",
        description: "Please upload a dataset first using the Data Upload Hub",
        variant: "destructive"
      });
      return;
    }

    try {
      setStatus("processing");
      setProgress(10);
      setErrorDetails(null);
      
      console.log(`🔄 Starting analysis for dataset: ${currentDataset.name} (ID: ${currentDataset.id})`);
      
      toast({
        title: "Analysis started",
        description: `Processing ${currentDataset.name} with AI agents`,
      });

      const apiUrl = `${API_BASE_URL}/api/analysis/start`;
      const payload = {
        dataset_id: currentDataset.id
      };

      console.log(`🔄 API URL: ${apiUrl}`);
      console.log(`🔄 Request payload:`, payload);

      // Set up timeout handling
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Analysis timeout after 15 seconds`);
        toast({
          title: "Analysis taking longer than expected",
          description: "This may take longer than expected — you can check back later",
          variant: "default"
        });
      }, 15000);

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      clearTimeout(timeoutId);

      console.log(`🔄 Response status: ${response.status}`);
      console.log(`🔄 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔄 API Error Response: ${errorText}`);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log(`🔄 Full API Response:`, data);
      
      // Update progress based on API response
      if (data.agents) {
        console.log(`🔄 Updating agents:`, data.agents);
        setAgents(data.agents);
      }
      
      if (data.progress !== undefined) {
        console.log(`🔄 Updating progress to: ${data.progress}%`);
        setProgress(data.progress);
      }
      
      if (data.report) {
        console.log(`🔄 Setting report:`, data.report.substring(0, 100) + "...");
        setReport(data.report);
      }
      
      if (data.status === "completed") {
        console.log(`🔄 Analysis completed! Setting status to completed and progress to 100%`);
        setStatus("completed");
        setProgress(100);
        toast({
          title: "Analysis completed",
          description: "All AI agents have finished processing your dataset",
        });
      } else if (data.status === "processing") {
        console.log(`🔄 Analysis still processing, current status: ${data.status}`);
        // Keep the processing status but update progress
        setProgress(data.progress || 50);
      } else if (data.status === "failed") {
        console.log(`🔄 Analysis failed with status: ${data.status}`);
        setStatus("failed");
        setErrorDetails(data.error || "Analysis failed");
      } else {
        console.log(`🔄 Unknown status received: ${data.status}`);
        // Default behavior - assume success if we got a response
        setStatus("completed");
        setProgress(100);
        toast({
          title: "Analysis completed",
          description: "Analysis processing finished",
        });
      }
      
    } catch (error) {
      console.error("🔄 Error during analysis:", error);
      setStatus("failed");
      setErrorDetails(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Analysis failed",
        description: "Unable to process the dataset. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  }, [toast, API_BASE_URL]);

  return {
    status,
    progress,
    report,
    agents,
    errorDetails,
    startAnalysis
  };
};

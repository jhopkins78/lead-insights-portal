
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
      
      console.log(`Starting analysis for dataset: ${currentDataset.name} (ID: ${currentDataset.id})`);
      
      toast({
        title: "Analysis started",
        description: `Processing ${currentDataset.name} with AI agents`,
      });

      // Call the real API endpoint
      const response = await fetch(`${API_BASE_URL}/api/analysis/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: currentDataset.id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      // Update progress based on API response
      if (data.agents) {
        setAgents(data.agents);
      }
      
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
      
      if (data.report) {
        setReport(data.report);
      }
      
      if (data.status === "completed") {
        setStatus("completed");
        setProgress(100);
        toast({
          title: "Analysis completed",
          description: "All AI agents have finished processing your dataset",
        });
      }
      
    } catch (error) {
      console.error("Error during analysis:", error);
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

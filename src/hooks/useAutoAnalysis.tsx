
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

  // Helper function to simulate agent progress
  const simulateAgentProgress = async () => {
    // EDA Agent
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAgents(prev => prev.map(a => a.name === "EDA Agent" ? {...a, status: "completed"} : a));
    setAgents(prev => prev.map(a => a.name === "Modeling Agent" ? {...a, status: "running"} : a));
    setProgress(60);
    
    // Modeling Agent
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAgents(prev => prev.map(a => a.name === "Modeling Agent" ? {...a, status: "completed"} : a));
    setAgents(prev => prev.map(a => a.name === "Evaluation Agent" ? {...a, status: "running"} : a));
    setProgress(80);
    
    // Evaluation Agent
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAgents(prev => prev.map(a => a.name === "Evaluation Agent" ? {...a, status: "completed"} : a));
    setProgress(95);
  };

  // Simulate demo mode analysis when API is unavailable
  const simulateDemoAnalysis = async () => {
    setProgress(40);
    setStatus("processing");
    toast({
      title: "Demo Mode Active",
      description: "Using demo mode because the server is unavailable.",
      variant: "default"
    });
    
    // Simulate agent progress
    await simulateAgentProgress();
    
    // Set sample report
    setReport(`# Auto Analysis Report (Demo Mode)

## Data Overview
- Total Records: 1,250
- Features: 8
- Missing Values: 2.3%
- Target Variable: Lead Conversion Rate

## Key Findings
1. Income level is highly correlated with conversion rate (r=0.78)
2. Geographic clusters show significant patterns
3. Seasonal trends identified in Q2 and Q4

## Model Performance
- Random Forest: AUC 0.84
- Gradient Boosting: AUC 0.86
- Neural Network: AUC 0.79

## Recommendations
- Focus marketing on high-income segments
- Create specialized campaigns for Q2/Q4
- Implement lead scoring based on the Gradient Boosting model`);
    
    setProgress(100);
    setStatus("completed");
  };

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
      
      // Simulate API call with current dataset
      console.log(`Starting analysis for dataset: ${currentDataset.name} (ID: ${currentDataset.id})`);
      
      toast({
        title: "Analysis started",
        description: `Processing ${currentDataset.name} with AI agents`,
      });

      // Simulate the analysis process
      await simulateDemoAnalysis();
      
    } catch (error) {
      console.error("Error during analysis:", error);
      setStatus("failed");
      setErrorDetails(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis",
        variant: "destructive"
      });
    }
  }, [toast, simulateDemoAnalysis]);

  return {
    status,
    progress,
    report,
    agents,
    errorDetails,
    startAnalysis
  };
};

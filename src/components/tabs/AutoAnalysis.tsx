
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DataPreview from "@/components/data/DataPreview";
import VisualizationGrid from "@/components/visualizations/VisualizationGrid";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import AutoAnalysisHeader from "./auto-analysis/AutoAnalysisHeader";
import AnalysisControls from "./auto-analysis/AnalysisControls";
import ProcessingStatus from "./auto-analysis/ProcessingStatus";
import AnalysisReport from "./auto-analysis/AnalysisReport";
import FutureFeatures from "./auto-analysis/FutureFeatures";

type AgentStatus = {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  message?: string;
};

type ProcessingStatusType = "idle" | "processing" | "completed" | "failed";

const AutoAnalysis: React.FC = () => {
  const { currentDataset } = useDataset();
  const [status, setStatus] = useState<ProcessingStatusType>("idle");
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: "EDA Agent", status: "pending" },
    { name: "Modeling Agent", status: "pending" },
    { name: "Evaluation Agent", status: "pending" }
  ]);
  const [previewData, setPreviewData] = useState<Array<Record<string, any>> | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentDataset && currentDataset.name.endsWith('.csv')) {
      generateSamplePreviewData();
    } else {
      setPreviewData(null);
    }
  }, [currentDataset]);

  // Generate sample data for preview (in a real app, this would parse the actual file)
  const generateSamplePreviewData = () => {
    // Create mock data for demonstration
    const headers = ['id', 'name', 'age', 'income', 'category', 'score'];
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      age: Math.floor(Math.random() * 40) + 20,
      income: Math.floor(Math.random() * 50000) + 30000,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 100)
    }));
    
    setPreviewData(mockData);
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

  // Helper function to simulate agent progress (in a real app, this would be replaced with actual API calls)
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

  const startAnalysis = async () => {
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
      console.log(`Starting analysis for dataset: ${currentDataset.name}`);
      
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
  };

  return (
    <div className="space-y-6">
      <AutoAnalysisHeader />

      {/* Dataset Status */}
      <DatasetStatus moduleName="Auto Analysis" />

      {/* Analysis Controls - Only show if dataset is available */}
      {currentDataset && (
        <AnalysisControls 
          onStartAnalysis={startAnalysis}
          isProcessing={status === "processing"}
          datasetName={currentDataset.name}
        />
      )}

      <ProcessingStatus 
        status={status}
        progress={progress}
        agents={agents}
        errorDetails={errorDetails}
      />

      {/* Dataset Preview */}
      {previewData && (
        <div className="mt-6">
          <DataPreview data={previewData} maxRows={10} />
        </div>
      )}

      {/* Visualization Grid - Now shows when dataset is available */}
      {currentDataset && (
        <div className="mt-6">
          <VisualizationGrid dataLoaded={status === "completed"} />
        </div>
      )}

      {report && <AnalysisReport report={report} />}

      {status === "completed" && <FutureFeatures />}
    </div>
  );
};

export default AutoAnalysis;

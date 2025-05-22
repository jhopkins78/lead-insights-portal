
import React, { useState } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import DataPreview from "@/components/data/DataPreview";
import VisualizationGrid from "@/components/visualizations/VisualizationGrid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AgentStatus = {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  message?: string;
};

type ProcessingStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

const AutoAnalysis: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
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

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setErrorDetails(null); // Reset error on new file selection
    
    // If there's a CSV file, generate sample preview data
    const csvFile = selectedFiles.find(file => file.name.endsWith('.csv'));
    if (csvFile) {
      generateSamplePreviewData();
    } else {
      setPreviewData(null);
    }
  };

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

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload for analysis",
        variant: "destructive"
      });
      return;
    }

    try {
      // Reset states
      setStatus("uploading");
      setProgress(10);
      setErrorDetails(null);
      
      // Create formData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      // Get API URL from environment variable
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://retool-dashboard.onrender.com";
      const analyzeEndpoint = `${apiBaseUrl}/api/analyze-assignment`;
      
      console.log(`Uploading files to ${analyzeEndpoint}`);

      // Add timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await fetch(analyzeEndpoint, {
          method: "POST",
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Check if the response is ok
        if (!response.ok) {
          let errorMessage = `Server error: ${response.status}`;
          
          try {
            // Try to parse response body for detailed error
            const errorBody = await response.json();
            errorMessage = errorBody.detail || errorBody.message || errorMessage;
          } catch (parseError) {
            // If we can't parse JSON, try to get text
            try {
              const textError = await response.text();
              if (textError) errorMessage = `${errorMessage} - ${textError}`;
            } catch (e) {
              // Unable to get text either, use default message
            }
          }
          
          console.error(`API Error: ${errorMessage}`);
          setErrorDetails(errorMessage);
          
          // Check if we should fall back to demo mode
          if (response.status === 404 || response.status >= 500) {
            console.log("Server unreachable or endpoint not found. Falling back to demo mode.");
            return simulateDemoAnalysis();
          } else {
            // For other error types, we'll show the error
            throw new Error(errorMessage);
          }
        }
        
        // If response is ok, begin processing
        const responseData = await response.json();
        console.log("Analysis response:", responseData);
        setProgress(40);
        setStatus("processing");
        
        // Update agent statuses with real data if available
        if (responseData.agents) {
          setAgents(responseData.agents);
        } else {
          // Otherwise, start simulation of agent progress
          await simulateAgentProgress();
        }
        
        // Check if there's a report in the response
        if (responseData.report) {
          setReport(responseData.report);
        } else {
          // Try to fetch report from a separate endpoint
          try {
            const reportResponse = await fetch(`${apiBaseUrl}/api/reports/final_report.md`);
            if (reportResponse.ok) {
              const reportText = await reportResponse.text();
              setReport(reportText);
            }
          } catch (reportError) {
            console.error("Failed to fetch report:", reportError);
          }
        }
        
        setProgress(100);
        setStatus("completed");
        
        toast({
          title: "Analysis completed",
          description: "Your files have been analyzed successfully."
        });
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error("Fetch error:", fetchError);
        
        // Determine if this is a network error or timeout
        const isNetworkError = fetchError instanceof TypeError && 
                              (fetchError.message === "Failed to fetch" || 
                               fetchError.message === "Load failed");
        
        const isTimeout = fetchError.name === "AbortError";
        
        if (isNetworkError || isTimeout) {
          console.log("Network error or timeout. Falling back to demo mode.");
          setErrorDetails(isTimeout ? 
            "Request timeout: The server took too long to respond." : 
            "Network error: The server is unreachable. Falling back to demo mode.");
          return simulateDemoAnalysis();
        } else {
          // For other errors, propagate to the main error handler
          throw fetchError;
        }
      }
      
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

  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="animate-spin h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case "idle":
        return null;
      case "uploading":
        return (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Uploading files...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      case "processing":
      case "completed":
        return (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Agent Activity</h3>
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        {getAgentStatusIcon(agent.status)}
                        <span>{agent.name}</span>
                      </div>
                      <span className="text-sm capitalize text-muted-foreground">{agent.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "failed":
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Analysis failed</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Please check your files and try again.</p>
              {errorDetails && (
                <p className="text-sm font-mono bg-rose-50 p-2 rounded whitespace-pre-wrap">{errorDetails}</p>
              )}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Automatic Data Analysis</h2>
        <p className="text-muted-foreground mb-6">
          Upload your data files for automatic analysis. Our AI agents will process your data and generate comprehensive insights.
        </p>

        <Card>
          <CardContent className="pt-6">
            <FileUploader
              onFilesSelected={handleFilesSelected}
              acceptedTypes={['csv', 'xlsx', 'json', 'md', 'pdf', 'doc', 'docx']}
              maxFiles={10}
              maxSizeMB={20}
              className="mb-4"
            />
            
            <Button 
              onClick={uploadFiles} 
              disabled={status === "uploading" || status === "processing" || files.length === 0}
              className="w-full sm:w-auto mt-2"
            >
              {status === "uploading" || status === "processing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Start Analysis"
              )}
            </Button>
          </CardContent>
        </Card>

        {renderStatusIndicator()}

        {/* Dataset Preview */}
        {previewData && (
          <div className="mt-6">
            <DataPreview data={previewData} maxRows={10} />
          </div>
        )}

        {/* Visualization Grid - Now always shows placeholders when files are uploaded */}
        {files.length > 0 && (
          <div className="mt-6">
            <VisualizationGrid dataLoaded={status === "completed"} />
          </div>
        )}

        {report && (
          <Collapsible className="mt-6 border rounded-md overflow-hidden">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
              <h3 className="text-lg">Analysis Report</h3>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t prose max-w-none">
                <pre className="whitespace-pre-wrap overflow-auto max-h-[500px] p-4 bg-gray-50 rounded text-sm text-left">
                  {report}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {status === "completed" && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="future-features">
              <AccordionTrigger>Future Features</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Model Metrics Tab - Compare RMSE, MAE, R² across models</p>
                  <p>• Transformation Preview Tab - Before/after data state visualization</p>
                  <p>• Report Download Button - With versioning and timestamping</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default AutoAnalysis;

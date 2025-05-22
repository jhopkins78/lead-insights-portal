
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, BarChart2, FileText, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FileUploadDialog from "./eda/FileUploadDialog";
import VisualAnalysisPanel from "./eda/VisualAnalysisPanel";
import NarrativeAnalysisPanel from "./eda/NarrativeAnalysisPanel";

export type ProcessingStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

const EdaExplorer: React.FC = () => {
  const [selectedView, setSelectedView] = useState("visual");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [edaData, setEdaData] = useState<any>(null);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      toast({
        title: "Files selected",
        description: `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} ready for processing`,
      });
    }
  };

  const handleProcessFiles = async () => {
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
      setError(null);
      
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
          setError(errorMessage);
          
          // Fall back to demo mode
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
        console.log("EDA Analysis response:", responseData);
        setProgress(40);
        setStatus("processing");
        
        // Update with real data if available, otherwise simulate
        if (responseData.eda_results) {
          setEdaData(responseData.eda_results);
          setProgress(100);
          setStatus("completed");
        } else {
          await simulateDemoAnalysis();
        }
        
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
          setError(isTimeout ? 
            "Request timeout: The server took too long to respond." : 
            "Network error: The server is unreachable. Falling back to demo mode.");
          return simulateDemoAnalysis();
        } else {
          // For other errors, propagate to the main error handler
          throw fetchError;
        }
      }
      
    } catch (error) {
      console.error("Error during EDA analysis:", error);
      setStatus("failed");
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis",
        variant: "destructive"
      });
    }
  };

  const simulateDemoAnalysis = async () => {
    setProgress(40);
    setStatus("processing");
    
    toast({
      title: "Demo Mode Active",
      description: "Using example data since no file was uploaded or server is unavailable.",
      variant: "default"
    });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProgress(75);
    
    // Load example EDA data
    const exampleData = generateExampleEdaData();
    setEdaData(exampleData);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(100);
    setStatus("completed");
  };

  const generateExampleEdaData = () => {
    // Mock data for visualizations and narrative
    return {
      summary: {
        title: "Dataset Overview",
        records: 1250,
        columns: 8,
        missing_percentage: 2.3,
        data_types: {
          numeric: 5,
          categorical: 2,
          datetime: 1
        }
      },
      correlation_matrix: {
        variables: ["income", "age", "score", "purchase_amount", "engagement"],
        values: [
          [1.0, 0.65, 0.23, 0.78, 0.45],
          [0.65, 1.0, 0.18, 0.43, 0.22],
          [0.23, 0.18, 1.0, 0.31, 0.68],
          [0.78, 0.43, 0.31, 1.0, 0.51],
          [0.45, 0.22, 0.68, 0.51, 1.0]
        ]
      },
      categorical_counts: {
        category: {
          labels: ["A", "B", "C", "D", "E"],
          values: [320, 280, 410, 150, 90]
        },
        region: {
          labels: ["North", "South", "East", "West", "Central"],
          values: [280, 350, 210, 310, 100]
        },
        status: {
          labels: ["Active", "Pending", "Churned", "New"],
          values: [620, 240, 190, 200]
        }
      },
      time_series: {
        dates: ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1"],
        sales: [12500, 14800, 13200, 16500, 18200],
        growth: [-2.1, 18.4, -10.8, 25.0, 10.3]
      },
      narrative: {
        key_insights: [
          "Income level shows a strong positive correlation with purchase amount (r=0.78)",
          "Region 'South' has the highest customer concentration at 28%",
          "Category 'C' products are the most popular with 32.8% market share",
          "Q4 2024 showed the highest growth rate at 25.0%",
          "Customer engagement score is strongly correlated with the likelihood of repeat purchases"
        ],
        recommendations: [
          "Focus marketing campaigns on high-income segments for maximum ROI",
          "Consider expanding product offerings in Category C due to high demand",
          "Investigate reasons for negative growth in Q1 and Q3 2024",
          "The South region presents opportunities for targeted promotions",
          "Implement a customer engagement program to increase retention rates"
        ],
        anomalies: [
          "Unusual spike in Category A purchases during Q2 2024",
          "Higher than expected churn rate in the North region",
          "Several outliers in the purchase amount column warrant investigation"
        ]
      }
    };
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case "idle":
        return null;
      case "uploading":
      case "processing":
        return (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{status === "uploading" ? "Uploading files..." : "Processing data..."}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      case "failed":
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Analysis failed</AlertTitle>
            <AlertDescription>
              {error || "An error occurred during analysis. Please try again."}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">EDA Explorer</h2>
        <p className="text-muted-foreground mb-6">
          Explore your data through visual and narrative exploratory data analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Exploratory Data Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="visual" className="flex gap-2 items-center">
                <BarChart2 className="h-4 w-4" />
                <span>Visual Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="narrative" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                <span>Narrative Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual">
              {status === "completed" && edaData ? (
                <VisualAnalysisPanel data={edaData} />
              ) : (
                <div className="text-center p-12 border-2 border-dashed rounded-lg">
                  <BarChart2 className="h-16 w-16 mx-auto text-insight-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No data visualizations available</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and process data files to generate visualizations
                  </p>
                  <Button 
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    Upload Data
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="narrative">
              {status === "completed" && edaData ? (
                <NarrativeAnalysisPanel data={edaData} />
              ) : (
                <div className="prose max-w-none">
                  <h3>Data Overview</h3>
                  <p>No data has been processed yet. Upload and process data files to generate narrative EDA.</p>
                  <p className="text-muted-foreground">
                    The narrative EDA will include data summaries, key insights, and recommendations.
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setIsUploadDialogOpen(true)}>
                      Upload Data
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {renderStatusIndicator()}
        </CardContent>
      </Card>

      <FileUploadDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFilesSelected={handleFilesSelected}
        onProcessFiles={handleProcessFiles}
        files={files}
        processing={status !== "idle" && status !== "completed" && status !== "failed"}
      />
    </div>
  );
};

export default EdaExplorer;

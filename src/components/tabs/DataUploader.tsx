import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Play, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";

// Processing stages for the file routing pipeline
type ProcessingStage = "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";

const DataUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState(0);
  const [processingDetails, setProcessingDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordsProcessed, setRecordsProcessed] = useState<number>(0);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Reset states when new files are selected
    setFiles(selectedFiles);
    setProcessing("idle");
    setProgress(0);
    setProcessingDetails(null);
    setError(null);
    setRecordsProcessed(0);
    
    toast({
      title: "Files selected",
      description: `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} ready for processing`,
    });
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files before processing",
        variant: "destructive",
      });
      return;
    }

    try {
      // Start processing
      setProcessing("uploading");
      setProgress(10);
      setProcessingDetails("Uploading files to the processing server...");
      
      // Create formData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      
      // Upload to the API
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const uploadUrl = `${apiBaseUrl}/upload-files`;
      
      console.log(`Uploading files to ${uploadUrl}`);
      
      // Upload files to the backend
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
      const responseData = await uploadResponse.json();
      console.log("Upload response:", responseData);
      
      // Extraction stage
      setProcessing("extraction");
      setProgress(30);
      setProcessingDetails("Extracting data from uploaded files...");
      await simulateStage(1500);
      
      // Transformation stage
      setProcessing("transformation");
      setProgress(60);
      setProcessingDetails("Transforming and enriching data...");
      await simulateStage(2000);
      
      // Loading stage
      setProcessing("loading");
      setProgress(85);
      setProcessingDetails("Loading data into the lead_predictions database...");
      await simulateStage(1500);
      
      // Check Supabase for new records
      await checkForNewRecords();
      
      // Complete
      setProcessing("completed");
      setProgress(100);
      setProcessingDetails("Processing complete. Data is now available in Lead Explorer and Prediction History.");
      
      toast({
        title: "Processing complete",
        description: `${recordsProcessed} records have been processed and are now available in the dashboard.`,
      });
      
    } catch (error) {
      console.error("Error processing files:", error);
      setProcessing("failed");
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during processing",
        variant: "destructive",
      });
    }
  };

  // Helper function to check Supabase for new records
  const checkForNewRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_predictions')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error("Supabase query error:", error);
        return;
      }
      
      setRecordsProcessed(data?.length || 0);
    } catch (e) {
      console.error("Error checking for new records:", e);
    }
  };

  // Helper function to simulate processing stages
  const simulateStage = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Render status icon based on current processing stage
  const getStatusIcon = (stage: ProcessingStage) => {
    switch (stage) {
      case "uploading":
      case "extraction":
      case "transformation":
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-insight-500" />;
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Data Uploader</h2>
        <p className="text-muted-foreground mb-6">
          Upload and process data files with the File Router Agent
        </p>
      </div>

      <Card className="border-t-4 border-t-insight-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader
            onFilesSelected={handleFilesSelected}
            acceptedTypes={['csv', 'xls', 'xlsx', 'json', 'txt']}
            maxFiles={5}
            maxSizeMB={10}
          />
          
          {files.length > 0 && (
            <div className="mt-6">
              <Button 
                onClick={handleProcessFiles}
                disabled={processing !== "idle" && processing !== "completed" && processing !== "failed"}
                className="w-full md:w-auto bg-insight-500 hover:bg-insight-600 flex gap-2 items-center"
              >
                {processing === "idle" || processing === "completed" || processing === "failed" ? (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Process with File Router Agent</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 animate-pulse" />
                    <span>Processing Files...</span>
                  </>
                )}
              </Button>
            </div>
          )}
          
          {processing !== "idle" && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>{processingDetails}</span>
                <span>{progress}%</span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              {processing !== "idle" && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium">Pipeline Stages</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "uploading" ? "bg-insight-50" : ""}`}>
                      {getStatusIcon(processing === "uploading" ? processing : (processing === "completed" || processing === "extraction" || processing === "transformation" || processing === "loading") ? "completed" : "idle")}
                      <span>File Upload</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "extraction" ? "bg-insight-50" : ""}`}>
                      {getStatusIcon(processing === "extraction" ? processing : (processing === "completed" || processing === "transformation" || processing === "loading") ? "completed" : (processing === "uploading" ? "uploading" : "idle"))}
                      <span>Data Extraction</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "transformation" ? "bg-insight-50" : ""}`}>
                      {getStatusIcon(processing === "transformation" ? processing : (processing === "completed" || processing === "loading") ? "completed" : (processing === "extraction" || processing === "uploading" ? "uploading" : "idle"))}
                      <span>Data Transformation</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "loading" ? "bg-insight-50" : ""}`}>
                      {getStatusIcon(processing === "loading" ? processing : processing === "completed" ? "completed" : (processing === "transformation" || processing === "extraction" || processing === "uploading" ? "uploading" : "idle"))}
                      <span>Database Loading</span>
                    </div>
                  </div>
                </div>
              )}
              
              {processing === "completed" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <Check className="h-5 w-5" />
                    <span>Processing Complete</span>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    Successfully processed {recordsProcessed} records. The data is now available in Lead Explorer and Prediction History.
                  </p>
                </div>
              )}
              
              {processing === "failed" && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-md">
                  <div className="flex items-center gap-2 text-rose-700 font-medium">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Processing Failed</span>
                  </div>
                  <p className="mt-2 text-sm text-rose-700">
                    {error || "An unknown error occurred during processing."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUploader;

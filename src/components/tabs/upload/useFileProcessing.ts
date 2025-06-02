
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type ProcessingStage = "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";

export const useFileProcessing = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState(0);
  const [processingDetails, setProcessingDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordsProcessed, setRecordsProcessed] = useState<number>(0);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessing("idle");
    setProgress(0);
    setProcessingDetails(null);
    setError(null);
    setRecordsProcessed(0);
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
      
      // Get API URL from env
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const uploadUrl = `${apiBaseUrl}/api/upload-files`;
      
      console.log(`🔍 File Processing API Call:`);
      console.log(`🔍 URL: ${uploadUrl}`);
      console.log(`🔍 Files to upload:`, files.map(f => f.name));
      
      // Upload files to the backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`🔍 Upload response status: ${uploadResponse.status}`);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        const errorMessage = errorData.detail || errorData.message || `Upload failed with status: ${uploadResponse.status}`;
        throw new Error(errorMessage);
      }
      
      const responseData = await uploadResponse.json();
      console.log("🔍 Upload response data:", responseData);
      
      // Continue with processing stages based on API response
      await continueProcessing(responseData);
      
    } catch (error) {
      console.error("🔍 Error processing files:", error);
      setProcessing("failed");
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during processing",
        variant: "destructive",
      });
    }
  };

  const continueProcessing = async (responseData: any) => {
    // Extraction stage
    setProcessing("extraction");
    setProgress(30);
    setProcessingDetails("Extracting data from uploaded files...");
    
    // Transformation stage
    setProcessing("transformation");
    setProgress(60);
    setProcessingDetails("Transforming and enriching data...");
    
    // Loading stage
    setProcessing("loading");
    setProgress(85);
    setProcessingDetails("Loading data into the database...");
    
    // Set records processed from API response
    if (responseData.records_processed) {
      setRecordsProcessed(responseData.records_processed);
    }
    
    // Complete
    setProcessing("completed");
    setProgress(100);
    setProcessingDetails("Processing complete. Data is now available in the dashboard.");
    
    toast({
      title: "Processing complete",
      description: `${responseData.records_processed || 0} records have been processed and are now available in the dashboard.`,
    });
  };

  return {
    files,
    processing,
    progress,
    processingDetails,
    error,
    recordsProcessed,
    handleFilesSelected,
    handleProcessFiles
  };
};

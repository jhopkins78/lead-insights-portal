
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Processing stages for the file routing pipeline
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
    // Reset states when new files are selected
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

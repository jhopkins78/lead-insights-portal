
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDataset } from "@/contexts/DatasetContext";

export const useDataUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { addDataset, setSelectedDataset } = useDataset();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      console.log(`🔄 Upload Triggered: Starting file upload for ${files.length} files`);
      console.log(`🔄 API Base URL: ${API_BASE_URL}`);
      
      // Log each file being uploaded
      files.forEach((file, index) => {
        console.log(`🔄 File ${index + 1}: ${file.name} (${file.size} bytes, type: ${file.type})`);
      });

      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      // Updated upload URL to use the working endpoint
      const uploadUrl = `${API_BASE_URL}/api/datasets/upload_dataset`;
      console.log(`🔄 Upload Request: POST ${uploadUrl}`);
      
      // Log FormData contents for debugging
      const formDataEntries = Array.from(formData.entries());
      console.log(`🔄 FormData entries count: ${formDataEntries.length}`);
      formDataEntries.forEach(([key, value], index) => {
        if (value instanceof File) {
          console.log(`🔄 FormData[${index}]: ${key} = File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`🔄 FormData[${index}]: ${key} = ${value}`);
        }
      });

      // Add timeout and retry logic for service spin-up delay
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error("🔄 Upload Timeout: Request took longer than 45 seconds");
        controller.abort();
      }, 45000); // Increased timeout for service spin-up

      console.log(`🔄 Starting fetch request at: ${new Date().toISOString()}`);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log(`🔄 Upload Response received at: ${new Date().toISOString()}`);
      console.log(`🔄 Upload Response: Status ${uploadResponse.status} ${uploadResponse.statusText}`);
      console.log(`🔄 Response Headers:`, Object.fromEntries(uploadResponse.headers.entries()));

      if (!uploadResponse.ok) {
        let errorMessage;
        let responseBody;
        
        try {
          responseBody = await uploadResponse.text();
          console.error(`🔄 Upload Error Response Body:`, responseBody);
          
          try {
            const errorData = JSON.parse(responseBody);
            errorMessage = errorData.detail || errorData.message || errorData.error || responseBody;
          } catch {
            errorMessage = responseBody || `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
          }
        } catch {
          errorMessage = `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
        }
        
        console.error(`❌ Upload Failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const responseData = await uploadResponse.json();
      console.log(`🔄 Upload Success: Response data:`, responseData);

      // Validate response structure
      if (!responseData.dataset_id && !responseData.id) {
        console.warn(`⚠️ Warning: Response missing dataset_id field. Response:`, responseData);
      }

      // Process each file and create dataset records
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create dataset with API response data or fallback to file data
        const newDataset = {
          id: responseData.dataset_id || responseData.id || `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: responseData.name || file.name,
          uploadedAt: new Date(),
          fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: file.size,
          usedBy: [],
          status: responseData.status || 'ready' as const
        };

        console.log(`🔄 Creating Dataset Record:`, newDataset);

        // Add the dataset to context
        addDataset(newDataset);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) processed and ready for analysis`,
      });

      return true; // Success
    } catch (error) {
      console.error("❌ Upload Failed:", error);
      
      // Enhanced error logging and user feedback
      let userMessage = "There was an error processing your files";
      let debugInfo = "";
      
      if (error instanceof TypeError) {
        if (error.message.includes("Load failed") || error.message.includes("Failed to fetch")) {
          userMessage = "Cannot connect to the upload server. The backend service may be starting up (this can take 30-60 seconds on first request). Please try again in a moment.";
          debugInfo = `Network Error: ${error.message}. API URL: ${API_BASE_URL}/api/datasets/upload_dataset`;
        } else if (error.message.includes("abort")) {
          userMessage = "Upload timed out. The service may be spinning up. Please try again.";
          debugInfo = `Timeout Error: ${error.message}`;
        } else {
          userMessage = `Network error: ${error.message}`;
          debugInfo = `TypeError: ${error.message}`;
        }
      } else if (error instanceof Error) {
        userMessage = error.message;
        debugInfo = `Error: ${error.message}`;
      }
      
      console.error(`❌ Upload Error Details:`, {
        errorType: error.constructor.name,
        message: error.message,
        stack: error.stack,
        apiUrl: `${API_BASE_URL}/api/datasets/upload_dataset`,
        timestamp: new Date().toISOString(),
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

      toast({
        title: "Upload failed",
        description: userMessage,
        variant: "destructive",
      });

      return false; // Failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDataset = (id: string) => {
    console.log(`🔄 Health Check: Removing dataset: ${id}`);
    // This will be handled by the parent component
  };

  const handleSelectDataset = (dataset: any) => {
    console.log(`🔄 Health Check: Selecting dataset from hub: ${dataset.name}`);
    setSelectedDataset(dataset);
    toast({
      title: "Dataset selected",
      description: `Now using ${dataset.name} across all modules`,
    });
  };

  return {
    isUploading,
    handleFilesSelected,
    handleRemoveDataset,
    handleSelectDataset
  };
};

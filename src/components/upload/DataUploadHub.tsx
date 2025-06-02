import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Database } from "lucide-react";
import { useDataset } from "@/contexts/DatasetContext";
import UploadSection from "./UploadSection";
import DatasetList from "./DatasetList";
import UsageInstructions from "./UsageInstructions";

interface DataUploadHubProps {
  trigger?: React.ReactNode;
}

const DataUploadHub: React.FC<DataUploadHubProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { datasets, currentDataset, selectedDataset, addDataset, removeDataset, setSelectedDataset } = useDataset();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      console.log(`🔄 Upload Triggered: Starting file upload for ${files.length} files`);
      
      // Log each file being uploaded
      files.forEach((file, index) => {
        console.log(`🔄 File ${index + 1}: ${file.name} (${file.size} bytes, type: ${file.type})`);
      });

      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      // Upload to the backend API
      const uploadUrl = `${API_BASE_URL}/api/upload-files`;
      console.log(`🔄 Upload Request: POST ${uploadUrl}`);
      console.log(`🔄 API Base URL: ${API_BASE_URL}`);
      console.log(`🔄 FormData entries:`, Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name}` : value]));

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error("🔄 Upload Timeout: Request took longer than 30 seconds");
        controller.abort();
      }, 30000);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        // Add headers for debugging
        headers: {
          // Don't set Content-Type for FormData, let browser set it
        },
      });

      clearTimeout(timeoutId);
      console.log(`🔄 Upload Response: Status ${uploadResponse.status} ${uploadResponse.statusText}`);
      console.log(`🔄 Response Headers:`, Object.fromEntries(uploadResponse.headers.entries()));

      if (!uploadResponse.ok) {
        let errorData;
        let errorMessage;
        
        try {
          const responseText = await uploadResponse.text();
          console.error(`🔄 Upload Error Response Body:`, responseText);
          
          try {
            errorData = JSON.parse(responseText);
            errorMessage = errorData.detail || errorData.message || errorData.error || responseText;
          } catch {
            errorMessage = responseText || `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
          }
        } catch {
          errorMessage = `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
        }
        
        console.error(`❌ Upload Failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const responseData = await uploadResponse.json();
      console.log(`🔄 Upload Success: Response data:`, responseData);

      // Process each file and create dataset records
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create dataset with API response data or fallback to file data
        const newDataset = {
          id: responseData.dataset_id || `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
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

      setIsOpen(false);
    } catch (error) {
      console.error("❌ Upload Failed:", error);
      
      // Enhanced error logging and user feedback
      let userMessage = "There was an error processing your files";
      let debugInfo = "";
      
      if (error instanceof TypeError) {
        if (error.message.includes("Load failed") || error.message.includes("Failed to fetch")) {
          userMessage = "Cannot connect to the upload server. Please check if the backend is running.";
          debugInfo = `Network Error: ${error.message}. API URL: ${API_BASE_URL}/api/upload-files`;
        } else if (error.message.includes("abort")) {
          userMessage = "Upload timed out. The file may be too large or the server is slow.";
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
        apiUrl: `${API_BASE_URL}/api/upload-files`,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

      toast({
        title: "Upload failed",
        description: userMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDataset = (id: string) => {
    console.log(`🔄 Health Check: Removing dataset: ${id}`);
    removeDataset(id);
    toast({
      title: "Dataset removed",
      description: "Dataset has been removed from all modules",
    });
  };

  const handleSelectDataset = (dataset: any) => {
    console.log(`🔄 Health Check: Selecting dataset from hub: ${dataset.name}`);
    setSelectedDataset(dataset);
    toast({
      title: "Dataset selected",
      description: `Now using ${dataset.name} across all modules`,
    });
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Upload className="h-4 w-4" />
      Data Upload Hub
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Upload Hub
          </DialogTitle>
          <DialogDescription>
            Upload datasets once and use them across all analysis modules. Supports CSV, XLSX, and JSON files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <UploadSection 
            onFilesSelected={handleFilesSelected}
            isUploading={isUploading}
          />

          <DatasetList
            datasets={datasets}
            currentDataset={currentDataset}
            onSelectDataset={handleSelectDataset}
            onRemoveDataset={handleRemoveDataset}
          />

          <UsageInstructions />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploadHub;

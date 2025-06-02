
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
      console.log(`🔄 Health Check: Starting file upload for ${files.length} files`);
      
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
        console.log(`🔄 Health Check: Adding file to upload: ${file.name} (${file.size} bytes)`);
      });

      // Upload to the backend API
      const uploadUrl = `${API_BASE_URL}/api/upload-files`;
      console.log(`🔄 Health Check: Uploading to: ${uploadUrl}`);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      console.log(`🔄 Health Check: Upload response status: ${uploadResponse.status}`);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Upload failed with status: ${uploadResponse.status}`;
        console.error(`🔄 Health Check: Upload failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      const responseData = await uploadResponse.json();
      console.log(`🔄 Health Check: Upload response data:`, responseData);

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

        console.log(`🔄 Health Check: Creating dataset record:`, newDataset);

        // Add the dataset to context
        addDataset(newDataset);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) processed and ready for analysis`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("🔄 Health Check: Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error processing your files",
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

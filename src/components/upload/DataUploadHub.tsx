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
  const { datasets, currentDataset, addDataset, removeDataset, selectDataset } = useDataset();
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Process each file
      for (const file of files) {
        const newDataset = {
          id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          uploadedAt: new Date(),
          fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: file.size,
          usedBy: ['Auto Analysis', 'EDA Explorer', 'Strategy Scanner'],
          status: 'processing' as const
        };

        addDataset(newDataset);

        // Simulate processing
        setTimeout(() => {
          addDataset({ ...newDataset, status: 'ready' });
        }, 2000);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) processed and available across all modules`,
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDataset = (id: string) => {
    removeDataset(id);
    toast({
      title: "Dataset removed",
      description: "Dataset has been removed from all modules",
    });
  };

  const handleSelectDataset = (dataset: any) => {
    selectDataset(dataset.id);
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

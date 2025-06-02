
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Database } from "lucide-react";
import { useDataset } from "@/contexts/DatasetContext";
import { useToast } from "@/hooks/use-toast";
import UploadSection from "./UploadSection";
import DatasetList from "./DatasetList";
import UsageInstructions from "./UsageInstructions";
import { useDataUpload } from "./hooks/useDataUpload";

interface DataUploadDialogContentProps {
  onClose: () => void;
}

const DataUploadDialogContent: React.FC<DataUploadDialogContentProps> = ({ onClose }) => {
  const { datasets, currentDataset, removeDataset } = useDataset();
  const { toast } = useToast();
  const { isUploading, handleFilesSelected, handleSelectDataset } = useDataUpload();

  const handleUploadSuccess = async (files: File[]) => {
    const success = await handleFilesSelected(files);
    if (success) {
      onClose();
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

  const handleDatasetSelect = (dataset: any) => {
    handleSelectDataset(dataset);
    onClose();
  };

  return (
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
          onFilesSelected={handleUploadSuccess}
          isUploading={isUploading}
        />

        <DatasetList
          datasets={datasets}
          currentDataset={currentDataset}
          onSelectDataset={handleDatasetSelect}
          onRemoveDataset={handleRemoveDataset}
        />

        <UsageInstructions />
      </div>
    </DialogContent>
  );
};

export default DataUploadDialogContent;

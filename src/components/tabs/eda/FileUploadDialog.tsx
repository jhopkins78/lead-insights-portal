
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Loader2 } from "lucide-react";
import { ProcessingStatus } from "../EdaExplorer";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: File[]) => void;
  onProcessFiles: () => void;
  files: File[];
  processing: boolean;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
  onFilesSelected,
  onProcessFiles,
  files,
  processing
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Data for Analysis</DialogTitle>
          <DialogDescription>
            Upload CSV, Excel, JSON or text files to perform exploratory data analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <FileUploader
            onFilesSelected={onFilesSelected}
            acceptedTypes={['csv', 'xls', 'xlsx', 'json', 'txt']}
            maxFiles={5}
            maxSizeMB={10}
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onProcessFiles();
              if (files.length > 0) {
                onOpenChange(false);
              }
            }}
            disabled={files.length === 0 || processing}
            className="bg-insight-500 hover:bg-insight-600"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Files"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;

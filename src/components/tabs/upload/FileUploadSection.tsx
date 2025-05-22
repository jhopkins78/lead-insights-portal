
import React from "react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Play, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  files: File[];
  processing: "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";
  onFilesSelected: (files: File[]) => void;
  onProcessFiles: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  processing,
  onFilesSelected,
  onProcessFiles,
}) => {
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    onFilesSelected(selectedFiles);
    
    toast({
      title: "Files selected",
      description: `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} ready for processing`,
    });
  };

  return (
    <>
      <FileUploader
        onFilesSelected={handleFilesSelected}
        acceptedTypes={['csv', 'xls', 'xlsx', 'json', 'txt']}
        maxFiles={5}
        maxSizeMB={10}
      />
      
      {files.length > 0 && (
        <div className="mt-6">
          <Button 
            onClick={onProcessFiles}
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
    </>
  );
};

export default FileUploadSection;

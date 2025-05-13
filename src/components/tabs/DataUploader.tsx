
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Play } from "lucide-react";

const DataUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    toast({
      title: "Files selected",
      description: `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} ready for processing`,
    });
  };

  const handleProcessFiles = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files before processing",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing complete",
        description: "Your files have been processed by the File Router Agent",
      });
    }, 2000);
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
                disabled={isProcessing}
                className="w-full md:w-auto bg-insight-500 hover:bg-insight-600 flex gap-2 items-center"
              >
                {isProcessing ? (
                  <>
                    <FileText className="h-5 w-5 animate-pulse" />
                    <span>Processing Files...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Process with File Router Agent</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUploader;

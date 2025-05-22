
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import FileUploadSection from "./upload/FileUploadSection";
import ProcessingProgress from "./upload/ProcessingProgress";
import PipelineStages from "./upload/PipelineStages";
import StatusDisplay from "./upload/StatusDisplay";
import { useFileProcessing } from "./upload/useFileProcessing";

const DataUploader: React.FC = () => {
  const {
    files,
    processing,
    progress,
    processingDetails,
    error,
    recordsProcessed,
    handleFilesSelected,
    handleProcessFiles
  } = useFileProcessing();

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
          <FileUploadSection
            files={files}
            processing={processing}
            onFilesSelected={handleFilesSelected}
            onProcessFiles={handleProcessFiles}
          />
          
          <ProcessingProgress
            processing={processing}
            progress={progress}
            processingDetails={processingDetails}
          />
          
          {processing !== "idle" && (
            <PipelineStages processing={processing} />
          )}
          
          <StatusDisplay
            processing={processing}
            error={error}
            recordsProcessed={recordsProcessed}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUploader;

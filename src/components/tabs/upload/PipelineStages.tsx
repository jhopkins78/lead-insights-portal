import React from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";

type ProcessingStage = "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";

interface PipelineStagesProps {
  processing: ProcessingStage;
}

const PipelineStages: React.FC<PipelineStagesProps> = ({ processing }) => {
  if (processing === "idle") return null;

  // Render status icon based on current processing stage
  const getStatusIcon = (stage: ProcessingStage) => {
    switch (stage) {
      case "uploading":
      case "extraction":
      case "transformation":
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-insight-500" />;
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      default:
        return null;
    }
  };

  // Helper function to determine the status for a pipeline stage
  const getStageStatus = (currentStage: ProcessingStage, checkStage: ProcessingStage): ProcessingStage => {
    // If we're at this stage or failed, show the current status
    if (currentStage === checkStage || currentStage === "failed") {
      return currentStage;
    }
    
    // If we're past this stage (completed or at a later stage), mark as completed
    if (currentStage === "completed") {
      return "completed";
    }
    
    // Define stage sequence for determining progress
    const stageSequence: ProcessingStage[] = ["uploading", "extraction", "transformation", "loading", "completed"];
    const currentIndex = stageSequence.indexOf(currentStage);
    const checkIndex = stageSequence.indexOf(checkStage);
    
    // If current stage is further in the sequence than the check stage, it's completed
    if (currentIndex > checkIndex && currentIndex !== -1 && checkIndex !== -1) {
      return "completed";
    }
    
    // Otherwise return the uploading status for active pipeline or idle for other cases
    return currentStage !== "idle" ? "uploading" : "idle";
  };

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-medium">Pipeline Stages</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "uploading" ? "bg-insight-50" : ""}`}>
          {getStatusIcon(getStageStatus(processing, "uploading"))}
          <span>File Upload</span>
        </div>
        
        <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "extraction" ? "bg-insight-50" : ""}`}>
          {getStatusIcon(getStageStatus(processing, "extraction"))}
          <span>Data Extraction</span>
        </div>
        
        <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "transformation" ? "bg-insight-50" : ""}`}>
          {getStatusIcon(getStageStatus(processing, "transformation"))}
          <span>Data Transformation</span>
        </div>
        
        <div className={`flex items-center gap-2 p-2 rounded-md ${processing === "loading" ? "bg-insight-50" : ""}`}>
          {getStatusIcon(getStageStatus(processing, "loading"))}
          <span>Database Loading</span>
        </div>
      </div>
    </div>
  );
};

export default PipelineStages;

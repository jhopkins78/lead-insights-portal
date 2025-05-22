
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  processing: "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";
  progress: number;
  processingDetails: string | null;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  processing,
  progress,
  processingDetails
}) => {
  if (processing === "idle") return null;
  
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between text-sm">
        <span>{processingDetails}</span>
        <span>{progress}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProcessingProgress;

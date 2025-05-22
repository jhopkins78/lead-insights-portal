
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { StatusIndicatorProps } from "./types";

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, progress, error }) => {
  if (status === "idle") return null;
  
  if (status === "uploading" || status === "processing") {
    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{status === "uploading" ? "Uploading files..." : "Processing data..."}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    );
  }
  
  if (status === "failed") {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Analysis failed</AlertTitle>
        <AlertDescription>
          {error || "An error occurred during analysis. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default StatusIndicator;

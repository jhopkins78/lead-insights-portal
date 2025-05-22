
import React from "react";
import { Check, AlertTriangle } from "lucide-react";

interface StatusDisplayProps {
  processing: "idle" | "uploading" | "extraction" | "transformation" | "loading" | "completed" | "failed";
  error: string | null;
  recordsProcessed: number;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ 
  processing, 
  error,
  recordsProcessed 
}) => {
  if (processing !== "completed" && processing !== "failed") return null;
  
  if (processing === "completed") {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <Check className="h-5 w-5" />
          <span>Processing Complete</span>
        </div>
        <p className="mt-2 text-sm text-green-700">
          Successfully processed {recordsProcessed} records. The data is now available in Lead Explorer and Prediction History.
        </p>
      </div>
    );
  }
  
  if (processing === "failed") {
    return (
      <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-md">
        <div className="flex items-center gap-2 text-rose-700 font-medium">
          <AlertTriangle className="h-5 w-5" />
          <span>Processing Failed</span>
        </div>
        <p className="mt-2 text-sm text-rose-700">
          {error || "An unknown error occurred during processing."}
        </p>
      </div>
    );
  }
  
  return null;
};

export default StatusDisplay;

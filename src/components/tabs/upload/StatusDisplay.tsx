
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
    // Format error message to be more user-friendly
    let errorMessage = error || "An unknown error occurred during processing.";
    
    // Handle specific error types
    if (errorMessage.includes("404")) {
      errorMessage = "The file processing server endpoint was not found (404). This could be due to server maintenance or a configuration issue.";
    } else if (errorMessage.includes("Failed to fetch")) {
      errorMessage = "Unable to connect to the processing server. Please check your internet connection and try again.";
    }
    
    return (
      <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-md">
        <div className="flex items-center gap-2 text-rose-700 font-medium">
          <AlertTriangle className="h-5 w-5" />
          <span>Processing Failed</span>
        </div>
        <p className="mt-2 text-sm text-rose-700">
          {errorMessage}
        </p>
        <p className="mt-2 text-sm text-rose-700">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }
  
  return null;
};

export default StatusDisplay;

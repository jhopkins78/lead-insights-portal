
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  acceptedTypes: string[];
  maxFiles: number;
  maxSizeMB: number;
}

const DropZone: React.FC<DropZoneProps> = ({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  acceptedTypes,
  maxFiles,
  maxSizeMB
}) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragging ? "border-insight-500 bg-insight-50" : "border-gray-300 hover:border-insight-400",
        "focus:outline-none focus:ring-2 focus:ring-insight-500 focus:border-transparent"
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="File upload area"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="h-12 w-12 text-insight-500 mb-2" />
        <p className="text-lg font-medium">
          Drag & drop files here, or click to select
        </p>
        <p className="text-sm text-muted-foreground">
          Supported formats: {acceptedTypes.join(', ')}
        </p>
        <p className="text-sm text-muted-foreground">
          Max {maxFiles} file{maxFiles !== 1 ? 's' : ''}, up to {maxSizeMB}MB each
        </p>
        <Button 
          type="button"
          variant="outline" 
          className="mt-2 bg-insight-50 border-insight-200 text-insight-700 hover:bg-insight-100"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};

export default DropZone;

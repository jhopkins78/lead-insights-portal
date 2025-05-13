import React, { useState, useRef } from "react";
import { Upload, FileText, FileImage, FileJson, FileArchive, FileAudio } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type AcceptedFileType = 'csv' | 'xls' | 'xlsx' | 'json' | 'md' | 'html' | 'pdf' | 'doc' | 'docx' | 'txt';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: AcceptedFileType[];
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedTypes = ['csv', 'xls', 'xlsx', 'json', 'md', 'html', 'pdf', 'doc', 'docx', 'txt'],
  maxFiles = 5,
  maxSizeMB = 10,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create accepted file types string for the file input
  const acceptString = acceptedTypes.map(type => `.${type}`).join(',');
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const validateFiles = (fileList: File[]) => {
    // Check max files
    if (fileList.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once`);
      return false;
    }

    // Check file types and sizes
    for (const file of fileList) {
      // Check size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`);
        return false;
      }

      // Check file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !acceptedTypes.includes(extension as AcceptedFileType)) {
        setError(`File ${file.name} has an unsupported format. Allowed formats: ${acceptedTypes.join(', ')}`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    if (!validateFiles(filesArray)) return;
    
    setFiles(filesArray);
    onFilesSelected(filesArray);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'json':
        return <FileJson className="h-5 w-5" />;
      case 'csv':
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5" />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5" />;
      case 'md':
      case 'html':
        return <FileText className="h-5 w-5" />;
      case 'txt':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileArchive className="h-5 w-5" />;
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-insight-500 bg-insight-50" : "border-gray-300 hover:border-insight-400",
          "focus:outline-none focus:ring-2 focus:ring-insight-500 focus:border-transparent"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        tabIndex={0}
        role="button"
        aria-label="File upload area"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept={acceptString}
          multiple={maxFiles > 1}
        />
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
              handleButtonClick();
            }}
          >
            Browse Files
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-rose-600">{error}</p>
      )}
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-medium text-sm">Selected Files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.name)}
                  <span className="text-sm truncate max-w-[250px]" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

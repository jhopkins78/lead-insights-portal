
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { FileUploaderProps } from "./types";
import FileItem from "./FileItem";
import DropZone from "./DropZone";
import { createAcceptString, validateFiles } from "./utils";

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
  const acceptString = createAcceptString(acceptedTypes);
  
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

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    if (!validateFiles(filesArray, maxFiles, maxSizeMB, acceptedTypes, setError)) return;
    
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

  // Remove a file from the list
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <DropZone
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        acceptedTypes={acceptedTypes}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        accept={acceptString}
        multiple={maxFiles > 1}
      />
      
      {error && (
        <p className="mt-2 text-sm text-rose-600">{error}</p>
      )}
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-medium text-sm">Selected Files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <FileItem 
                key={index} 
                file={file} 
                onRemove={() => removeFile(index)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

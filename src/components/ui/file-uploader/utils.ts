
import React from "react";
import { FileJson, FileText, FileArchive } from "lucide-react";
import { AcceptedFileType } from "./types";

/**
 * Creates a string of accepted file extensions for file input
 */
export const createAcceptString = (acceptedTypes: AcceptedFileType[]): string => {
  return acceptedTypes.map(type => `.${type}`).join(',');
};

/**
 * Returns an appropriate icon based on file extension
 */
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'json': {
      return <FileJson className="h-5 w-5" />;
    }
    case 'csv':
    case 'xls':
    case 'xlsx':
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'md':
    case 'html':
    case 'txt': {
      return <FileText className="h-5 w-5" />;
    }
    default: {
      return <FileArchive className="h-5 w-5" />;
    }
  }
};

/**
 * Validates files based on type and size constraints
 * Returns true if valid, false otherwise
 */
export const validateFiles = (
  fileList: File[], 
  maxFiles: number,
  maxSizeMB: number,
  acceptedTypes: AcceptedFileType[],
  setError: (error: string | null) => void
): boolean => {
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

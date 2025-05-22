
export type AcceptedFileType = 'csv' | 'xls' | 'xlsx' | 'json' | 'md' | 'html' | 'pdf' | 'doc' | 'docx' | 'txt';

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: AcceptedFileType[];
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export interface FileItemProps {
  file: File;
  onRemove: () => void;
}

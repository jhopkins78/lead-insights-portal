
export type ProcessingStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

export interface EdaData {
  summary?: {
    title?: string;
    records?: number;
    columns?: number;
    missing_percentage?: number;
    data_types?: {
      numeric?: number;
      categorical?: number;
      datetime?: number;
    }
  };
  correlation_matrix?: {
    variables: string[];
    values: number[][];
  };
  categorical_counts?: Record<string, {
    labels: string[];
    values: number[];
  }>;
  time_series?: {
    dates: string[];
    sales: number[];
    growth: number[];
  };
  narrative?: {
    key_insights: string[];
    recommendations: string[];
    anomalies: string[];
  };
}

export interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: File[]) => void;
  onProcessFiles: () => void;
  files: File[];
  processing: boolean;
}

export interface StatusIndicatorProps {
  status: ProcessingStatus;
  progress: number;
  error: string | null;
}

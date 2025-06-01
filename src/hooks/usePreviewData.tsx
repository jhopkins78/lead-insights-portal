
import { useState, useEffect } from 'react';

interface PreviewData {
  columns: string[];
  rows: any[][];
  summary: {
    totalRows: number;
    totalColumns: number;
  };
}

export const usePreviewData = () => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSamplePreviewData = () => {
    // Only generate if we don't already have data
    if (previewData) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const sampleData: PreviewData = {
        columns: ['ID', 'Name', 'Email', 'Company', 'Lead Score', 'Status'],
        rows: [
          [1, 'John Doe', 'john@example.com', 'Acme Corp', 85, 'Hot'],
          [2, 'Jane Smith', 'jane@techco.com', 'TechCo', 72, 'Warm'],
          [3, 'Bob Johnson', 'bob@startup.io', 'StartupIO', 91, 'Hot'],
          [4, 'Alice Brown', 'alice@bigcorp.com', 'BigCorp', 64, 'Cold'],
          [5, 'Charlie Wilson', 'charlie@innovate.com', 'InnovateCo', 78, 'Warm'],
        ],
        summary: {
          totalRows: 1247,
          totalColumns: 6
        }
      };
      
      setPreviewData(sampleData);
      setIsLoading(false);
    }, 1000);
  };

  // Only run once on mount
  useEffect(() => {
    generateSamplePreviewData();
  }, []); // Empty dependency array to run only once

  const refreshPreviewData = () => {
    setPreviewData(null);
    generateSamplePreviewData();
  };

  return {
    previewData,
    isLoading,
    generateSamplePreviewData,
    refreshPreviewData
  };
};

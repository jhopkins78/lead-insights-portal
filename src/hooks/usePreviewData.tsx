
import { useState, useCallback } from 'react';
import { useDataset } from '@/contexts/DatasetContext';

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
  const { currentDataset } = useDataset();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const generateSamplePreviewData = useCallback(async () => {
    if (!currentDataset) {
      setPreviewData(null);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`🔍 Fetching preview data for dataset: ${currentDataset.id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/datasets/${currentDataset.id}/preview`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("🔍 Preview data response:", data);
      
      // Format the API response to match our interface
      const formattedData: PreviewData = {
        columns: data.columns || [],
        rows: data.rows || [],
        summary: {
          totalRows: data.total_rows || data.summary?.totalRows || 0,
          totalColumns: data.total_columns || data.summary?.totalColumns || 0
        }
      };
      
      setPreviewData(formattedData);
    } catch (error) {
      console.error("Failed to fetch preview data:", error);
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentDataset, API_BASE_URL]);

  const refreshPreviewData = useCallback(() => {
    setPreviewData(null);
    generateSamplePreviewData();
  }, [generateSamplePreviewData]);

  return {
    previewData,
    isLoading,
    generateSamplePreviewData,
    refreshPreviewData
  };
};

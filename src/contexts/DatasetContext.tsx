
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Dataset {
  id: string;
  name: string;
  uploadedAt: Date;
  fileType: string;
  size: number;
  usedBy: string[];
  status: "processing" | "ready" | "error";
}

interface DatasetContextType {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  isLoading: boolean;
  error: string | null;
  fetchAvailableDatasets: () => Promise<void>;
  selectDataset: (datasetId: string) => void;
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  updateDatasetUsage: (id: string, modules: string[]) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};

interface DatasetProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const DatasetProvider: React.FC<DatasetProviderProps> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load selected dataset ID from localStorage on initialization
  useEffect(() => {
    const savedDatasetId = localStorage.getItem('selectedDatasetId');
    if (savedDatasetId && datasets.length > 0) {
      const savedDataset = datasets.find(d => d.id === savedDatasetId);
      if (savedDataset) {
        setCurrentDataset(savedDataset);
      }
    }
  }, [datasets]);

  // Fetch available datasets from backend
  const fetchAvailableDatasets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch datasets: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to match our Dataset interface
      const formattedDatasets: Dataset[] = data.datasets?.map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        uploadedAt: new Date(dataset.uploaded_at || dataset.uploadedAt),
        fileType: dataset.file_type || dataset.fileType,
        size: dataset.size || 0,
        usedBy: dataset.used_by || dataset.usedBy || [],
        status: dataset.status || "ready"
      })) || [];
      
      setDatasets(formattedDatasets);
      
      // If no current dataset is selected, select the most recent one
      if (!currentDataset && formattedDatasets.length > 0) {
        const mostRecent = formattedDatasets.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )[0];
        selectDataset(mostRecent.id);
      }
      
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
      
      // Fallback to mock data for development
      if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
        const mockDatasets: Dataset[] = [
          {
            id: 'mock-1',
            name: 'sales_leads.csv',
            uploadedAt: new Date(),
            fileType: 'csv',
            size: 1024000,
            usedBy: ['EDA Explorer', 'Auto Analysis'],
            status: 'ready'
          }
        ];
        setDatasets(mockDatasets);
        if (!currentDataset) {
          setCurrentDataset(mockDatasets[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Select a dataset and persist to localStorage
  const selectDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setCurrentDataset(dataset);
      localStorage.setItem('selectedDatasetId', datasetId);
    }
  };

  // Add a new dataset (called after successful upload)
  const addDataset = (dataset: Dataset) => {
    setDatasets(prev => {
      const updated = [...prev, dataset];
      return updated.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    });
    
    // Automatically select the newly added dataset
    selectDataset(dataset.id);
  };

  // Remove a dataset
  const removeDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    if (currentDataset?.id === id) {
      const remaining = datasets.filter(d => d.id !== id);
      setCurrentDataset(remaining.length > 0 ? remaining[0] : null);
      localStorage.removeItem('selectedDatasetId');
    }
  };

  // Update dataset usage tracking
  const updateDatasetUsage = (id: string, modules: string[]) => {
    setDatasets(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, usedBy: Array.from(new Set([...d.usedBy, ...modules])) }
          : d
      )
    );
  };

  // Fetch datasets on component mount
  useEffect(() => {
    fetchAvailableDatasets();
  }, []);

  const value = {
    datasets,
    currentDataset,
    isLoading,
    error,
    fetchAvailableDatasets,
    selectDataset,
    addDataset,
    removeDataset,
    updateDatasetUsage,
  };

  return (
    <DatasetContext.Provider value={value}>
      {children}
    </DatasetContext.Provider>
  );
};

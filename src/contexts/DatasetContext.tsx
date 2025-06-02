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
  selectedDataset: Dataset | null;
  isLoading: boolean;
  error: string | null;
  fetchAvailableDatasets: () => Promise<void>;
  selectDataset: (datasetId: string) => void;
  setSelectedDataset: (dataset: Dataset) => void;
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
  const [selectedDataset, setSelectedDatasetState] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load selected dataset ID from localStorage on initialization
  useEffect(() => {
    const savedDatasetId = localStorage.getItem('selectedDatasetId');
    if (savedDatasetId && datasets.length > 0) {
      const savedDataset = datasets.find(d => d.id === savedDatasetId);
      if (savedDataset) {
        console.log(`🔄 Restored dataset from localStorage: ${savedDataset.name}`);
        setCurrentDataset(savedDataset);
        setSelectedDatasetState(savedDataset);
      } else {
        console.warn(`🔄 Saved dataset ID ${savedDatasetId} not found in available datasets`);
        localStorage.removeItem('selectedDatasetId');
      }
    }
  }, [datasets]);

  // Fetch available datasets from backend
  const fetchAvailableDatasets = async () => {
    setIsLoading(true);
    setError(null);
    
    const apiUrl = `${API_BASE_URL}/api/datasets`;
    console.log(`🔍 Health Check: Fetching datasets from: ${apiUrl}`);
    
    try {
      const response = await fetch(apiUrl);
      
      console.log(`🔍 Health Check: Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔍 Health Check: API Error Response: ${errorText}`);
        throw new Error(`Failed to fetch datasets: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`🔍 Health Check: API Response data:`, data);
      
      // Handle the API response format
      let formattedDatasets: Dataset[] = [];
      
      if (data && Array.isArray(data.datasets)) {
        formattedDatasets = data.datasets.map((dataset: any) => ({
          id: dataset.id,
          name: dataset.name,
          uploadedAt: new Date(dataset.uploaded_at || dataset.uploadedAt),
          fileType: dataset.file_type || dataset.fileType,
          size: dataset.size || 0,
          usedBy: dataset.used_by || dataset.usedBy || [],
          status: dataset.status || "ready"
        }));
      } else if (data && Array.isArray(data)) {
        formattedDatasets = data.map((dataset: any) => ({
          id: dataset.id,
          name: dataset.name,
          uploadedAt: new Date(dataset.uploaded_at || dataset.uploadedAt),
          fileType: dataset.file_type || dataset.fileType,
          size: dataset.size || 0,
          usedBy: dataset.used_by || dataset.usedBy || [],
          status: dataset.status || "ready"
        }));
      }
      
      console.log(`🔍 Health Check: Formatted ${formattedDatasets.length} datasets:`, formattedDatasets);
      setDatasets(formattedDatasets);
      
      // If we have a saved dataset ID but no current dataset, try to restore it
      const savedDatasetId = localStorage.getItem('selectedDatasetId');
      if (savedDatasetId && !currentDataset && formattedDatasets.length > 0) {
        const savedDataset = formattedDatasets.find(d => d.id === savedDatasetId);
        if (savedDataset) {
          console.log(`🔄 Health Check: Restoring saved dataset: ${savedDataset.name}`);
          selectDataset(savedDataset.id);
        } else {
          console.warn(`🔄 Health Check: Saved dataset ${savedDatasetId} no longer exists`);
          localStorage.removeItem('selectedDatasetId');
        }
      }
      
      // If no current dataset is selected and we have datasets, select the most recent one
      if (!currentDataset && formattedDatasets.length > 0 && !savedDatasetId) {
        const mostRecent = formattedDatasets.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )[0];
        console.log(`🔄 Health Check: Auto-selecting most recent dataset: ${mostRecent.name}`);
        selectDataset(mostRecent.id);
      }
      
    } catch (err) {
      console.error('🔍 Health Check: Error fetching datasets:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(errorMessage);
      
      // Clear datasets when API fails
      setDatasets([]);
      setCurrentDataset(null);
      setSelectedDatasetState(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a dataset and persist to localStorage
  const selectDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      console.log(`🔄 Health Check: Selecting dataset: ${dataset.name} (ID: ${dataset.id})`);
      setCurrentDataset(dataset);
      setSelectedDatasetState(dataset);
      localStorage.setItem('selectedDatasetId', datasetId);
      setError(null);
    } else {
      console.error(`🔄 Health Check: Dataset ${datasetId} not found in available datasets`);
    }
  };

  // Direct setter for selectedDataset
  const setSelectedDataset = (dataset: Dataset) => {
    console.log(`🔄 Health Check: Setting selected dataset: ${dataset.name} (ID: ${dataset.id})`);
    setSelectedDatasetState(dataset);
    setCurrentDataset(dataset);
    localStorage.setItem('selectedDatasetId', dataset.id);
    setError(null);
    
    // Add to datasets if not already there
    setDatasets(prev => {
      const exists = prev.find(d => d.id === dataset.id);
      if (!exists) {
        console.log(`🔄 Health Check: Adding new dataset to context: ${dataset.name}`);
        return [...prev, dataset];
      }
      return prev;
    });
  };

  // Add a new dataset (called after successful upload)
  const addDataset = (dataset: Dataset) => {
    console.log(`🔄 Health Check: Adding dataset: ${dataset.name} with status: ${dataset.status}`);
    setDatasets(prev => {
      // Remove any existing dataset with the same name to avoid duplicates
      const filtered = prev.filter(d => d.name !== dataset.name);
      const updated = [...filtered, dataset];
      return updated.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    });
    
    // Automatically select the newly added dataset
    console.log(`🔄 Health Check: Auto-selecting newly added dataset: ${dataset.name}`);
    setSelectedDataset(dataset);
  };

  // Remove a dataset
  const removeDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    if (currentDataset?.id === id || selectedDataset?.id === id) {
      const remaining = datasets.filter(d => d.id !== id);
      const newSelected = remaining.length > 0 ? remaining[0] : null;
      setCurrentDataset(newSelected);
      setSelectedDatasetState(newSelected);
      if (newSelected) {
        localStorage.setItem('selectedDatasetId', newSelected.id);
      } else {
        localStorage.removeItem('selectedDatasetId');
      }
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
    console.log(`🔄 Health Check: DatasetProvider mounted, fetching datasets...`);
    fetchAvailableDatasets();
  }, []);

  const value = {
    datasets,
    currentDataset,
    selectedDataset,
    isLoading,
    error,
    fetchAvailableDatasets,
    selectDataset,
    setSelectedDataset,
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

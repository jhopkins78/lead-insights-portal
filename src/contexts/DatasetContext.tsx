
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  setCurrentDataset: (dataset: Dataset | null) => void;
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

export const DatasetProvider: React.FC<DatasetProviderProps> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);

  const addDataset = (dataset: Dataset) => {
    setDatasets(prev => [...prev, dataset]);
    if (!currentDataset) {
      setCurrentDataset(dataset);
    }
  };

  const removeDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    if (currentDataset?.id === id) {
      setCurrentDataset(datasets.find(d => d.id !== id) || null);
    }
  };

  const updateDatasetUsage = (id: string, modules: string[]) => {
    setDatasets(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, usedBy: Array.from(new Set([...d.usedBy, ...modules])) }
          : d
      )
    );
  };

  const value = {
    datasets,
    currentDataset,
    addDataset,
    removeDataset,
    setCurrentDataset,
    updateDatasetUsage,
  };

  return (
    <DatasetContext.Provider value={value}>
      {children}
    </DatasetContext.Provider>
  );
};

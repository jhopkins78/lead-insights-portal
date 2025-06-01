
import { useState, useEffect } from 'react';

export const usePreviewData = (currentDataset: any) => {
  const [previewData, setPreviewData] = useState<Array<Record<string, any>> | null>(null);

  // Generate sample data for preview (in a real app, this would parse the actual file)
  const generateSamplePreviewData = () => {
    // Create mock data for demonstration
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      age: Math.floor(Math.random() * 40) + 20,
      income: Math.floor(Math.random() * 50000) + 30000,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 100)
    }));
    
    setPreviewData(mockData);
  };

  useEffect(() => {
    if (currentDataset && currentDataset.name.endsWith('.csv')) {
      generateSamplePreviewData();
    } else {
      setPreviewData(null);
    }
  }, [currentDataset]);

  return previewData;
};

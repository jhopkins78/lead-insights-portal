
import React from 'react';
import VisualizationGrid from "@/components/visualizations/VisualizationGrid";

interface VisualizationSectionProps {
  currentDataset: any;
  status: "idle" | "processing" | "completed" | "failed";
}

const VisualizationSection: React.FC<VisualizationSectionProps> = ({ 
  currentDataset, 
  status 
}) => {
  if (!currentDataset) return null;

  return (
    <div className="mt-6">
      <VisualizationGrid dataLoaded={status === "completed"} />
    </div>
  );
};

export default VisualizationSection;

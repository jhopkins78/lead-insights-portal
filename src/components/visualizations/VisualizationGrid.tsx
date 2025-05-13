
import React from "react";
import VisualizationPlaceholder from "./VisualizationPlaceholder";

interface VisualizationGridProps {
  dataLoaded: boolean;
}

const VisualizationGrid: React.FC<VisualizationGridProps> = ({ dataLoaded }) => {
  if (!dataLoaded) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Data Visualizations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VisualizationPlaceholder 
          type="histogram" 
          title="Distribution Histogram" 
        />
        <VisualizationPlaceholder 
          type="boxplot" 
          title="Box Plot Analysis" 
        />
        <VisualizationPlaceholder 
          type="scatter" 
          title="Feature Correlation" 
        />
        <VisualizationPlaceholder 
          type="bar" 
          title="Category Comparison" 
        />
        <VisualizationPlaceholder 
          type="line" 
          title="Trend Analysis" 
        />
        <VisualizationPlaceholder 
          type="heatmap" 
          title="Correlation Heatmap" 
        />
      </div>
    </div>
  );
};

export default VisualizationGrid;

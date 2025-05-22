
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart2, FileText } from "lucide-react";

interface EmptyStateContentProps {
  isNarrativeView: boolean;
  onUploadClick: () => void;
}

const EmptyStateContent: React.FC<EmptyStateContentProps> = ({ isNarrativeView, onUploadClick }) => {
  if (isNarrativeView) {
    return (
      <div className="prose max-w-none">
        <h3>Data Overview</h3>
        <p>No data has been processed yet. Upload and process data files to generate narrative EDA.</p>
        <p className="text-muted-foreground">
          The narrative EDA will include data summaries, key insights, and recommendations.
        </p>
        <div className="mt-4">
          <Button onClick={onUploadClick}>
            Upload Data
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg">
      <BarChart2 className="h-16 w-16 mx-auto text-insight-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">No data visualizations available</h3>
      <p className="text-muted-foreground mb-4">
        Upload and process data files to generate visualizations
      </p>
      <Button onClick={onUploadClick}>
        Upload Data
      </Button>
    </div>
  );
};

export default EmptyStateContent;

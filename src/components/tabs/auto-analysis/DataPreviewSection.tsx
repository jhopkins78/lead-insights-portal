
import React from 'react';
import DataPreview from "@/components/data/DataPreview";

interface DataPreviewSectionProps {
  previewData: Array<Record<string, any>> | null;
}

const DataPreviewSection: React.FC<DataPreviewSectionProps> = ({ previewData }) => {
  if (!previewData) return null;

  return (
    <div className="mt-6">
      <DataPreview data={previewData} maxRows={10} />
    </div>
  );
};

export default DataPreviewSection;

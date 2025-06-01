
import React, { useEffect } from "react";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import AutoAnalysisHeader from "./auto-analysis/AutoAnalysisHeader";
import AnalysisControls from "./auto-analysis/AnalysisControls";
import ProcessingStatus from "./auto-analysis/ProcessingStatus";
import AnalysisReport from "./auto-analysis/AnalysisReport";
import FutureFeatures from "./auto-analysis/FutureFeatures";
import DataPreviewSection from "./auto-analysis/DataPreviewSection";
import VisualizationSection from "./auto-analysis/VisualizationSection";
import { useAutoAnalysis } from "@/hooks/useAutoAnalysis";
import { usePreviewData } from "@/hooks/usePreviewData";

const AutoAnalysis: React.FC = () => {
  const { currentDataset, updateDatasetUsage } = useDataset();
  const { status, progress, report, agents, errorDetails, startAnalysis } = useAutoAnalysis();
  const { previewData } = usePreviewData();

  useEffect(() => {
    if (currentDataset) {
      // Update dataset usage tracking
      updateDatasetUsage(currentDataset.id, ['Auto Analysis']);
    }
  }, [currentDataset, updateDatasetUsage]);

  const handleStartAnalysis = () => {
    startAnalysis(currentDataset);
  };

  // Convert the preview data structure to the format expected by DataPreviewSection
  const convertedPreviewData = previewData ? previewData.rows.map(row => {
    const obj: Record<string, any> = {};
    previewData.columns.forEach((column, index) => {
      obj[column] = row[index];
    });
    return obj;
  }) : null;

  return (
    <div className="space-y-6">
      <AutoAnalysisHeader />

      {/* Dataset Status */}
      <DatasetStatus moduleName="Auto Analysis" />

      {/* Analysis Controls - Only show if dataset is available */}
      {currentDataset && (
        <AnalysisControls 
          onStartAnalysis={handleStartAnalysis}
          isProcessing={status === "processing"}
          datasetName={currentDataset.name}
        />
      )}

      <ProcessingStatus 
        status={status}
        progress={progress}
        agents={agents}
        errorDetails={errorDetails}
      />

      {/* Dataset Preview */}
      <DataPreviewSection previewData={convertedPreviewData} />

      {/* Visualization Grid */}
      <VisualizationSection currentDataset={currentDataset} status={status} />

      {report && <AnalysisReport report={report} />}

      {status === "completed" && <FutureFeatures />}
    </div>
  );
};

export default AutoAnalysis;

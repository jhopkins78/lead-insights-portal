
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
  const previewData = usePreviewData(currentDataset);

  useEffect(() => {
    if (currentDataset) {
      // Update dataset usage tracking
      updateDatasetUsage(currentDataset.id, ['Auto Analysis']);
    }
  }, [currentDataset, updateDatasetUsage]);

  const handleStartAnalysis = () => {
    startAnalysis(currentDataset);
  };

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
      <DataPreviewSection previewData={previewData} />

      {/* Visualization Grid */}
      <VisualizationSection currentDataset={currentDataset} status={status} />

      {report && <AnalysisReport report={report} />}

      {status === "completed" && <FutureFeatures />}
    </div>
  );
};

export default AutoAnalysis;

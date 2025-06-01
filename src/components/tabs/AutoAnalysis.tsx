
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database } from "lucide-react";

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

      {/* Current Dataset Display - Show when analysis is completed */}
      {currentDataset && status === "completed" && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    Analysis Complete: {currentDataset.name}
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All analysis agents have successfully processed your dataset
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analysis Complete
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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

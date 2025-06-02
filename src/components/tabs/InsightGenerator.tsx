
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useInsightGenerator } from "@/components/chat/hooks/useInsightGenerator";
import { Badge } from "@/components/ui/badge";
import DataUploadHub from "@/components/upload/DataUploadHub";
import { useDataset } from "@/contexts/DatasetContext";

const InsightGenerator: React.FC = () => {
  const { selectedDataset, currentDataset, isLoading } = useDataset();
  
  // Use selectedDataset primarily, fallback to currentDataset for backward compatibility
  const activeDataset = selectedDataset || currentDataset;
  
  // Debug logging
  useEffect(() => {
    console.log("🔍 InsightGenerator - Dataset state:", {
      selectedDataset: selectedDataset?.name,
      currentDataset: currentDataset?.name,
      activeDataset: activeDataset?.name,
      isLoading,
      savedDatasetId: localStorage.getItem('selectedDatasetId')
    });
  }, [selectedDataset, currentDataset, activeDataset, isLoading]);

  const {
    messages,
    isLoading: isGeneratingInsight,
    handleSendMessage,
    addToReport,
    currentDataset: hookDataset
  } = useInsightGenerator();

  // Show loading state while context is being restored
  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh]">
        <Card className="flex flex-col h-full">
          <CardHeader className="border-b bg-muted/30 px-4 py-3">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Insight Generator
              </div>
              <Badge variant="outline" className="bg-insight-50 text-insight-700 border-insight-200">
                Business Data Analyst
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-3 rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto">
                <BarChart2 className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold">Loading Datasets...</h3>
              <p className="text-muted-foreground">
                Checking for available datasets and restoring your selection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No dataset selected - show upload prompt
  if (!activeDataset) {
    const savedDatasetId = localStorage.getItem('selectedDatasetId');
    
    return (
      <div className="flex flex-col h-[70vh]">
        <Card className="flex flex-col h-full">
          <CardHeader className="border-b bg-muted/30 px-4 py-3">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Insight Generator
              </div>
              <Badge variant="outline" className="bg-insight-50 text-insight-700 border-insight-200">
                Business Data Analyst
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-3 rounded-full bg-orange-100 w-16 h-16 flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">No Dataset Selected</h3>
              <p className="text-muted-foreground">
                Please upload and select a dataset to start generating business insights with your AI analyst.
              </p>
              {savedDatasetId && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Found saved dataset ID: {savedDatasetId}. It may no longer be available on the server.
                  </AlertDescription>
                </Alert>
              )}
              <DataUploadHub 
                trigger={
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Dataset
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh]">
      <Card className="flex flex-col h-full">
        <CardHeader className="border-b bg-muted/30 px-4 py-3">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Insight Generator
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileText className="h-3 w-3 mr-1" />
                {activeDataset.name}
              </Badge>
              <Badge variant="outline" className="bg-insight-50 text-insight-700 border-insight-200">
                Business Data Analyst
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <ChatMessageList 
              messages={messages}
              isLoading={isGeneratingInsight}
              assistantMode="analyst"
            />
            
            <ChatInput 
              assistantMode="analyst"
              isLoading={isGeneratingInsight}
              onSendMessage={handleSendMessage}
              disabled={false}
              placeholder="Ask about your data..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightGenerator;

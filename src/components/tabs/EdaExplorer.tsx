
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart2, FileText } from "lucide-react";
import FileUploadDialog from "./eda/FileUploadDialog";
import VisualAnalysisPanel from "./eda/VisualAnalysisPanel";
import NarrativeAnalysisPanel from "./eda/NarrativeAnalysisPanel";
import StatusIndicator from "./eda/StatusIndicator";
import EmptyStateContent from "./eda/EmptyStateContent";
import { useEdaAnalysis } from "./eda/useEdaAnalysis";

const EdaExplorer: React.FC = () => {
  const [selectedView, setSelectedView] = useState("visual");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const {
    files,
    status,
    progress,
    error,
    edaData,
    handleFilesSelected,
    handleProcessFiles
  } = useEdaAnalysis();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">EDA Explorer</h2>
        <p className="text-muted-foreground mb-6">
          Explore your data through visual and narrative exploratory data analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Exploratory Data Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="visual" className="flex gap-2 items-center">
                <BarChart2 className="h-4 w-4" />
                <span>Visual Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="narrative" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                <span>Narrative Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual">
              {status === "completed" && edaData ? (
                <VisualAnalysisPanel data={edaData} />
              ) : (
                <EmptyStateContent 
                  isNarrativeView={false} 
                  onUploadClick={() => setIsUploadDialogOpen(true)} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="narrative">
              {status === "completed" && edaData ? (
                <NarrativeAnalysisPanel data={edaData} />
              ) : (
                <EmptyStateContent 
                  isNarrativeView={true} 
                  onUploadClick={() => setIsUploadDialogOpen(true)} 
                />
              )}
            </TabsContent>
          </Tabs>
          
          <StatusIndicator status={status} progress={progress} error={error} />
        </CardContent>
      </Card>

      <FileUploadDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFilesSelected={handleFilesSelected}
        onProcessFiles={handleProcessFiles}
        files={files}
        processing={status !== "idle" && status !== "completed" && status !== "failed"}
      />
    </div>
  );
};

export default EdaExplorer;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import { useReportComposer } from "@/hooks/useReportComposer";

const ReportComposer: React.FC = () => {
  const { currentDataset } = useDataset();
  const { toast } = useToast();
  const {
    isLoading,
    reportMarkdown,
    error,
    generateReport,
    clearReport,
    downloadMarkdown,
  } = useReportComposer();

  const handleGenerateReport = async () => {
    if (!currentDataset) {
      toast({
        title: "Dataset required",
        description: "Please select a dataset to generate a report",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateReport({
        dataset_id: currentDataset.id,
        analysis_summary: "Auto analysis completed with high accuracy",
        metrics: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.78
        },
        strategy_recommendations: [
          "Focus on high-intent leads",
          "Implement follow-up automation",
          "Optimize conversion timing"
        ]
      });
    } catch (error) {
      // Error handling is already done in the hook
      console.error("Report generation failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Report Composer</h2>
        <p className="text-muted-foreground mb-6">
          Generate comprehensive analysis reports combining insights from Auto Analysis and Strategy Scanner
        </p>
      </div>

      {/* Dataset Status */}
      <DatasetStatus moduleName="Report Composer" />

      <div className="space-y-4">
        <div className="flex space-x-3">
          <Button 
            onClick={handleGenerateReport} 
            disabled={isLoading || !currentDataset}
            className="flex-1 md:flex-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
          
          {reportMarkdown && (
            <>
              <Button 
                variant="outline" 
                onClick={downloadMarkdown}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={clearReport}
                disabled={isLoading}
              >
                Clear
              </Button>
            </>
          )}
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {reportMarkdown && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Generated Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="preview" className="flex gap-2 items-center">
                  <FileText className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="source" className="flex gap-2 items-center">
                  <Edit className="h-4 w-4" />
                  <span>Source</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview">
                <div className="prose prose-slate max-w-none text-left">
                  <ReactMarkdown>{reportMarkdown}</ReactMarkdown>
                </div>
              </TabsContent>
              
              <TabsContent value="source">
                <div className="rounded-md bg-muted p-4 text-left">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {reportMarkdown}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportComposer;

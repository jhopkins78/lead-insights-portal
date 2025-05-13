
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";

const sampleMarkdown = `# Data Intelligence Report

## Executive Summary

This report provides a comprehensive analysis of the customer data provided. The analysis reveals several key insights that can drive business decisions.

## Key Findings

1. **Customer Segmentation**: We identified 3 primary customer segments:
   - High-value, long-term customers (18%)
   - Mid-value, growth potential customers (42%)
   - Low-value, high churn risk customers (40%)

2. **Churn Prediction**: Our model achieved 78% accuracy in predicting customer churn.

3. **Lifetime Value**: Average projected customer LTV is $1,280, with significant variance between segments.

## Recommendations

- Implement targeted retention campaigns for the high churn risk segment
- Develop upsell strategies for the growth potential segment
- Create loyalty programs for the high-value segment

## Methodology

Data was analyzed using a combination of clustering algorithms and regression models. The final model selected was a Linear Regression model with feature selection.

## Model Performance

| Metric | Value |
| ------ | ----- |
| R² Score | 0.78 |
| RMSE | 12.3 |
| MAE | 8.7 |

`;

const ReportComposer: React.FC = () => {
  const [view, setView] = useState<string>("preview");
  const [report, setReport] = useState<string>(sampleMarkdown);

  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data_intelligence_report.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Report Composer</h2>
        <p className="text-muted-foreground mb-6">
          View and download comprehensive analysis reports
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Data Intelligence Report</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={view} onValueChange={setView}>
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
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            </TabsContent>
            
            <TabsContent value="source">
              <div className="rounded-md bg-muted p-4 text-left">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {report}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportComposer;

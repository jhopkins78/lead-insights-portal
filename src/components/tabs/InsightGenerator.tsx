
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useInsightGenerator } from "@/components/chat/hooks/useInsightGenerator";
import { Badge } from "@/components/ui/badge";

const InsightGenerator: React.FC = () => {
  const {
    messages,
    isLoading,
    handleSendMessage,
    addToReport,
    currentDataset
  } = useInsightGenerator();

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
              {currentDataset && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <FileText className="h-3 w-3 mr-1" />
                  {currentDataset.name}
                </Badge>
              )}
              <Badge variant="outline" className="bg-insight-50 text-insight-700 border-insight-200">
                Business Data Analyst
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="flex flex-col h-full">
            {!currentDataset && (
              <Alert className="m-4 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No dataset selected. Please upload and select a dataset from the Data Upload Hub to generate insights.
                </AlertDescription>
              </Alert>
            )}
            
            <ChatMessageList 
              messages={messages}
              isLoading={isLoading}
              assistantMode="analyst"
            />
            
            <ChatInput 
              assistantMode="analyst"
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              disabled={!currentDataset}
              placeholder={currentDataset ? "Ask about your data..." : "Please select a dataset first"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightGenerator;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2 } from "lucide-react";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useInsightGenerator } from "@/components/chat/hooks/useInsightGenerator";
import { Badge } from "@/components/ui/badge";

const InsightGenerator: React.FC = () => {
  const {
    messages,
    isLoading,
    handleSendMessage,
    addToReport
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
            <Badge variant="outline" className="bg-insight-50 text-insight-700 border-insight-200">
              Business Data Analyst
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <ChatMessageList 
              messages={messages}
              isLoading={isLoading}
              assistantMode="analyst"
            />
            
            <ChatInput 
              assistantMode="analyst"
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightGenerator;

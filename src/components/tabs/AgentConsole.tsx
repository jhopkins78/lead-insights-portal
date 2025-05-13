
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import AssistantModeSelector from "@/components/chat/AssistantModeSelector";
import { useAgentConsole } from "@/components/chat/hooks/useAgentConsole";

const AgentConsole: React.FC = () => {
  const {
    messages,
    isLoading,
    assistantMode,
    handleSendMessage,
    toggleAssistantMode
  } = useAgentConsole();

  return (
    <div className="flex flex-col h-[70vh]">
      <Card className="flex flex-col h-full border-0 shadow-none">
        <CardHeader className="border-b bg-muted/30 px-4 py-3">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Agent Console
            </div>
            
            <AssistantModeSelector 
              assistantMode={assistantMode} 
              onModeChange={toggleAssistantMode}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <ChatMessageList 
              messages={messages}
              isLoading={isLoading}
              assistantMode={assistantMode}
            />
            
            <ChatInput 
              assistantMode={assistantMode}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConsole;

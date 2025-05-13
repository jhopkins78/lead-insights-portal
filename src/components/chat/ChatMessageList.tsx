
import React, { useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  assistantMode: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading, assistantMode }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <p>Ask the {assistantMode === "sales" ? "Sales Coach" : "Data Analyst"} about your {assistantMode === "sales" ? "leads and sales strategies" : "data and insights"}.</p>
            <p className="text-sm mt-2">
              {assistantMode === "sales" 
                ? "Try questions like \"What are my best performing leads?\" or \"Analyze my recent conversion rates\""
                : "Try questions like \"Analyze these data trends\" or \"What insights can I draw from my customer data?\""}
            </p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
      {isLoading && (
        <div className="flex items-center space-x-2 self-start bg-muted p-3 rounded-lg max-w-[80%]">
          <div className="animate-pulse flex space-x-1">
            <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animation-delay-200"></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animation-delay-500"></div>
          </div>
          <span className="text-sm text-muted-foreground">
            {assistantMode === "sales" ? "Sales Coach" : "Data Analyst"} is thinking...
          </span>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatMessageList;

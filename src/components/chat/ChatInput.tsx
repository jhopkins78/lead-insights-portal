
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  assistantMode: string;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  assistantMode, 
  isLoading, 
  onSendMessage, 
  disabled = false,
  placeholder 
}) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const defaultPlaceholder = `Ask a question about your ${assistantMode === "sales" ? "leads or sales strategy" : "data or insights"}...`;

  return (
    <div className="border-t p-3 bg-background">
      <div className="flex gap-2">
        <Textarea
          placeholder={placeholder || defaultPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[60px] flex-1 resize-none"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !disabled) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!input.trim() || isLoading || disabled}
          className="self-end"
        >
          <SendHorizonal className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;

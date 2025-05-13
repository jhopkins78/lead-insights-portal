
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  assistantMode: string;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ assistantMode, isLoading, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="border-t p-3 bg-background">
      <div className="flex gap-2">
        <Textarea
          placeholder={`Ask a question about your ${assistantMode === "sales" ? "leads or sales strategy" : "data or insights"}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[60px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!input.trim() || isLoading}
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

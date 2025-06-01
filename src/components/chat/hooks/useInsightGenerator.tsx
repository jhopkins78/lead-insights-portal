
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDataset } from "@/contexts/DatasetContext";
import { Message } from "@/components/chat/ChatMessage";

export const useInsightGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentDataset } = useDataset();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  
  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        role: "agent",
        content: "## Welcome to the Insight Generator\n\nI'm your Business Data Analyst assistant. How can I help you analyze your data today? You can ask about:\n\n* Customer behavior patterns\n* Sales and revenue trends\n* Market segments\n* Performance metrics\n* Predictive insights\n\n*Please ensure you have a dataset selected to get started.*",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async (inputMessage: string) => {
    // Check if dataset is selected
    if (!currentDataset) {
      toast({
        title: "No Dataset Selected",
        description: "Please select a dataset from the Data Upload Hub before generating insights.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const apiUrl = `${API_BASE_URL}/api/insights/generate`;
    const payload = {
      dataset_id: currentDataset.id,
      input: inputMessage, // Fixed: changed from "query" to "input"
    };

    console.log("🔍 Insight Generator API Call:");
    console.log(`🔍 URL: ${apiUrl}`);
    console.log(`🔍 API_BASE_URL from env: ${import.meta.env.VITE_API_BASE_URL}`);
    console.log(`🔍 Payload:`, payload);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(`🔍 Response status: ${response.status}`);
      console.log(`🔍 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔍 API Error Response: ${errorText}`);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log("🔍 API Response data:", data);
      
      // Create agent response from API
      const agentResponse: Message = {
        role: "agent",
        content: data.insight || data.response || "I apologize, but I couldn't generate an insight for your query. Please try rephrasing your question.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, agentResponse]);

      toast({
        title: "Insight Generated",
        description: "Your business insight has been generated successfully.",
      });

    } catch (error) {
      console.error("🔍 Failed to generate insight:", error);
      console.error('🔍 Full error details:', {
        name: error?.constructor?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Insight Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate insight. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "I apologize, but I'm currently unable to analyze your data due to a connection issue. Please ensure:\n\n* Your dataset is properly uploaded\n* The backend service is running\n* Your network connection is stable\n\nThen try your query again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToReport = (content: string) => {
    toast({
      title: "Added to report",
      description: "This insight has been added to your report.",
    });
    // In a real app, this would call an API to add the insight to a report
  };

  return {
    messages,
    isLoading,
    handleSendMessage,
    addToReport,
    currentDataset
  };
};

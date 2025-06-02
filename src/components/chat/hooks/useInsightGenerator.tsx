
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDataset } from "@/contexts/DatasetContext";
import { Message } from "@/components/chat/ChatMessage";

export const useInsightGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { selectedDataset, currentDataset } = useDataset();
  
  // Use selectedDataset primarily, fallback to currentDataset
  const activeDataset = selectedDataset || currentDataset;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  
  // Debug logging for dataset changes
  useEffect(() => {
    console.log("🔄 Health Check: useInsightGenerator dataset updated:", {
      selectedDataset: selectedDataset?.name,
      currentDataset: currentDataset?.name,
      activeDataset: activeDataset?.name
    });
  }, [selectedDataset, currentDataset, activeDataset]);
  
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
    if (!activeDataset) {
      toast({
        title: "No Dataset Selected",
        description: "Please select a dataset from the Data Upload Hub before generating insights.",
        variant: "destructive",
      });
      return;
    }

    console.log(`🔄 Health Check: Generating insight for dataset: ${activeDataset.name} (ID: ${activeDataset.id})`);
    console.log(`🔄 Health Check: User query: ${inputMessage}`);

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const apiUrl = `${API_BASE_URL}/api/insights/generate`;
    const payload = {
      dataset_id: activeDataset.id,
      input: inputMessage,
    };

    console.log("🔄 Health Check: Insight Generator API Call:");
    console.log(`🔄 Health Check: URL: ${apiUrl}`);
    console.log(`🔄 Health Check: Payload:`, payload);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(`🔄 Health Check: Insight API Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔄 Health Check: Insight API Error Response: ${errorText}`);
        
        // Handle specific error cases
        if (response.status === 404 || errorText.includes("Dataset not found")) {
          throw new Error(`Dataset "${activeDataset.name}" was not found on the server. Please try uploading the dataset again.`);
        } else {
          throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("🔄 Health Check: Insight API Response data:", data);
      
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
      console.error("🔄 Health Check: Failed to generate insight:", error);
      
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
          content: `I apologize, but I'm currently unable to analyze your data. ${error instanceof Error ? error.message : 'Please check your network connection and try again.'}`,
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
  };

  return {
    messages,
    isLoading,
    handleSendMessage,
    addToReport,
    currentDataset: activeDataset // Return the active dataset for backward compatibility
  };
};


import { useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductContext } from "@/contexts/ProductContext";
import { AssistantMode } from "@/components/chat/AssistantModeSelector";
import { Message } from "@/components/chat/ChatMessage";

export const useAgentConsole = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>("sales");
  const { toast } = useToast();
  const { selectedProduct } = useContext(ProductContext);
  
  // Update assistant mode when product changes
  useEffect(() => {
    if (selectedProduct === "samaritan-ai") {
      setAssistantMode("analyst");
    } else {
      setAssistantMode("sales");
    }
  }, [selectedProduct]);

  const handleSendMessage = async (inputMessage: string) => {
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const agentResponse: Message = {
        role: "agent",
        content: generateMockResponse(inputMessage, assistantMode),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Failed to get agent response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the agent. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query: string, mode: AssistantMode): string => {
    // Different responses based on assistant mode
    if (mode === "sales") {
      if (query.toLowerCase().includes("lead")) {
        return "## Lead Analysis (Sales Coach Mode)\n\nBased on the latest sales data, your highest-value leads are coming from:\n\n1. **Technology sector** (32% conversion rate)\n2. **Healthcare providers** (28% conversion rate)\n3. **Financial services** (24% conversion rate)\n\nI recommend focusing your SDR team's efforts on technology leads first, as they show the fastest sales cycle and highest average deal size.";
      } else if (query.toLowerCase().includes("model") || query.toLowerCase().includes("metrics")) {
        return "## Sales Model Performance\n\nYour current lead scoring model is prioritizing the right opportunities:\n\n- **Win rate**: 27% (up 5% from last quarter)\n- **Average deal size**: $42,500\n- **Sales cycle**: 68 days (down 12 days)\n\nThe most effective outreach methods are:\n1. Personalized video messages (+32% response rate)\n2. Industry-specific case studies (+28% engagement)";
      } else {
        return "I'm your Sales Coach assistant. I can help with lead qualification, sales strategies, or pipeline optimization. What specific sales challenge are you facing today?";
      }
    } else { // analyst mode
      if (query.toLowerCase().includes("data")) {
        return "## Data Analysis (BI Analyst Mode)\n\nLooking at your dataset's statistical properties:\n\n- **Sample size**: 4,823 observations\n- **Missing values**: 2.3% (concentrated in the customer_lifetime column)\n- **Outliers**: 37 detected (recommend Winsorization at 95%)\n\nThe data shows strong correlations between customer engagement metrics and conversion rates (r=0.78), suggesting that focusing on engagement could yield significant improvements.";
      } else if (query.toLowerCase().includes("model") || query.toLowerCase().includes("metrics")) {
        return "## Model Evaluation\n\nThe current predictive model shows promising performance metrics:\n\n- **R² Score**: 0.87 (strong explanatory power)\n- **RMSE**: 0.14 (low prediction error)\n- **MAE**: 0.11 (good accuracy)\n\nFeature importance analysis reveals:\n1. Customer interaction frequency (37% importance)\n2. Time since last purchase (24% importance)\n3. Total spend over last 90 days (18% importance)";
      } else {
        return "I'm your Data Science Analyst assistant. I can help interpret data patterns, evaluate model performance, or recommend analytical approaches. What data challenge would you like me to address?";
      }
    }
  };

  const toggleAssistantMode = (mode: AssistantMode) => {
    setAssistantMode(mode);
    toast({
      title: `Assistant Mode: ${mode === "sales" ? "Sales Coach" : "Data Analyst"}`,
      description: `The assistant will now behave as a ${mode === "sales" ? "Sales Coach" : "Data Analyst"}`,
    });
  };

  return {
    messages,
    isLoading,
    assistantMode,
    handleSendMessage,
    toggleAssistantMode
  };
};

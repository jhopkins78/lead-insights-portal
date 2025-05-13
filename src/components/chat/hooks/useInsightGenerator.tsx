
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/ChatMessage";

export const useInsightGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        role: "agent",
        content: "## Welcome to the Insight Generator\n\nI'm your Business Data Analyst assistant. How can I help you analyze your data today? You can ask about:\n\n* Customer behavior patterns\n* Sales and revenue trends\n* Market segments\n* Performance metrics\n* Predictive insights",
        timestamp: new Date()
      }
    ]);
  }, []);

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock insight generation response
      const agentResponse: Message = {
        role: "agent",
        content: generateMockInsight(inputMessage),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Failed to generate insight:", error);
      toast({
        title: "Error",
        description: "Failed to generate insight. Please try again.",
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

  const generateMockInsight = (query: string): string => {
    // Generate different insights based on user query
    if (query.toLowerCase().includes("sales") || query.toLowerCase().includes("revenue")) {
      return "## Sales Performance Analysis\n\n**Key Findings:**\n\n* Q2 sales increased 23% YoY, outperforming market average by 7%\n* Top performing product category: Enterprise Solutions ($2.3M)\n* Sales cycle reduced from 62 to 48 days on average\n\n### Revenue Distribution by Channel\n| Channel | Revenue | YoY Change |\n|---------|---------|------------|\n| Direct | $3.2M | +18% |\n| Partners | $1.8M | +31% |\n| Online | $0.9M | +42% |\n\n**Recommendation:** Focus growth initiatives on the Partner channel, which shows strongest momentum while maintaining higher margins than online sales.\n\n[View in EDA Explorer](#) | [Run Forecasting Model](#)";
    } else if (query.toLowerCase().includes("customer") || query.toLowerCase().includes("client")) {
      return "## Customer Segment Analysis\n\n**Identified Segments:**\n\n1. **Power Users (14% of base)**\n   * Avg. spend: $12,400/year\n   * Most valued feature: Advanced Analytics\n   * Churn risk: Low (3%)\n\n2. **Growth Accounts (22% of base)**\n   * Avg. spend: $6,800/year\n   * Most valued feature: Automation Tools\n   * Churn risk: Medium (8%)\n   * Expansion opportunity: High\n\n3. **Early Adopters (31% of base)**\n   * Avg. spend: $4,200/year\n   * Most valued feature: Integration APIs\n   * Churn risk: Medium-High (12%)\n\n**Key Insight:** Growth Accounts represent your highest ROI opportunity for focused retention and expansion efforts, with potential to increase segment revenue by 35% over next 12 months.\n\n[View Customer Journey Map](#) | [Run Segment Prediction](#)";
    } else if (query.toLowerCase().includes("market") || query.toLowerCase().includes("competitor")) {
      return "## Market Positioning Analysis\n\n**Market Share:**\n* Your company: 14% (+2.3% YoY)\n* Competitor A: 18% (-0.8% YoY)\n* Competitor B: 11% (+1.2% YoY)\n\n**Competitive Advantage Assessment:**\n\n* **Strong areas:** Product flexibility (86% customer satisfaction), Support quality (92% satisfaction)\n* **Improvement areas:** Implementation time (64% satisfaction), Advanced features (71% satisfaction)\n\n**Market Trend Alert:** The market is shifting toward integrated solutions with embedded analytics capabilities. 72% of new RFPs now include this requirement (up from 45% last year).\n\n[View Full Market Analysis](#) | [Run Threat Assessment](#)";
    } else {
      return "## Data Insight Summary\n\nBased on your query, I've analyzed the available data and found these insights:\n\n1. **Pattern Detection:**\n   * Seasonal variation shows 28% higher engagement in Q4\n   * Day-of-week pattern indicates Tuesday and Wednesday optimal for engagement\n\n2. **Anomaly Detection:**\n   * Unusual activity spike on March 15-17 correlates with marketing campaign\n   * Performance drop on weekends requires optimization\n\n3. **Correlation Analysis:**\n   * Strong relationship between feature usage and retention (r=0.72)\n   * Weak correlation between price tier and support tickets (r=0.31)\n\nWould you like me to explore any of these areas in greater depth?\n\n[View in Data Explorer](#) | [Create Automated Report](#)";
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
    addToReport
  };
};

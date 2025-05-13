
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  score?: number;
  last_insight?: string;
}

export const useLeadCoaching = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [coaching, setCoaching] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  // Progress bar simulation for loading state
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isGenerating) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          // Gradually increase progress up to 90% during API call
          const nextProgress = prevProgress + (90 - prevProgress) * 0.1;
          return Math.min(nextProgress, 90);
        });
      }, 300);
    } else if (progress > 0) {
      // Complete the progress bar when done generating
      setProgress(100);
      progressInterval = setTimeout(() => {
        setProgress(0);
      }, 500);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isGenerating]);

  const generateCoaching = async () => {
    if (!selectedLeadId) {
      toast({
        title: "No lead selected",
        description: "Please select a lead before generating coaching advice.",
        variant: "destructive",
      });
      return;
    }

    if (!context.trim()) {
      toast({
        title: "Context required",
        description: "Please provide context for the coaching advice.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://api.example.com/generate_coaching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_id: selectedLeadId,
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate coaching advice");
      }

      const data = await response.json();
      setCoaching(data.coaching_advice || "");
      toast({
        title: "Coaching advice generated",
        description: "Your coaching advice has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating coaching:", error);
      toast({
        title: "Error",
        description: "Failed to generate coaching advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coaching);
    toast({
      title: "Copied to clipboard",
      description: "Coaching advice copied to clipboard",
    });
  };

  const sendToReport = async () => {
    try {
      // Implementation would depend on how reports are handled
      const response = await fetch("https://api.example.com/report/add_section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_id: selectedLeadId,
          content_type: "coaching",
          content: coaching,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to report");
      }

      toast({
        title: "Added to report",
        description: "Coaching advice has been added to your report",
      });
    } catch (error) {
      console.error("Error adding to report:", error);
      toast({
        title: "Error",
        description: "Failed to add coaching advice to your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedLeadId,
    setSelectedLeadId,
    context,
    setContext,
    coaching,
    isGenerating,
    selectedLead,
    setSelectedLead,
    progress,
    generateCoaching,
    copyToClipboard,
    sendToReport
  };
};

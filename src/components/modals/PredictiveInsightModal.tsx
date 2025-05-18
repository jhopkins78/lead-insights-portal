
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface ProgressCircleProps {
  value: number;
  max: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ value, max }) => {
  // Calculate the percentage and determine the color
  const percentage = (value / max) * 100;
  let circleColor = "text-rose-600";
  
  if (percentage > 85) {
    circleColor = "text-green-600";
  } else if (percentage >= 60) {
    circleColor = "text-amber-600";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-muted">
        <span className={`text-3xl font-bold ${circleColor}`}>{value}</span>
      </div>
      <span className="mt-2 text-sm font-medium">Lead Score</span>
    </div>
  );
};

interface PredictionResponse {
  lead_score: number;
  classification: string;
  gpt_summary: string;
}

interface PredictiveInsightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadData: {
    name: string;
    company: string;
    title?: string;
    email?: string;
    intent?: string;
    score?: number;
  } | null;
}

const PredictiveInsightModal: React.FC<PredictiveInsightModalProps> = ({
  open,
  onOpenChange,
  leadData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const { toast } = useToast();

  const fetchPrediction = async () => {
    if (!leadData) return;
    
    setIsLoading(true);
    try {
      // For demo purposes, generate mock prediction data
      // In a real implementation, this would call your API
      setTimeout(() => {
        const mockPrediction: PredictionResponse = {
          lead_score: leadData.score || Math.floor(Math.random() * 100),
          classification: leadData.intent || ["High Value", "Medium Value", "Low Value"][Math.floor(Math.random() * 3)],
          gpt_summary: `${leadData.name} from ${leadData.company} shows ${Math.random() > 0.5 ? 'strong' : 'moderate'} engagement with our product. Based on their interaction patterns, they appear to be interested in solutions that can help with their ${leadData.intent?.toLowerCase() || 'business needs'}.`
        };
        
        setPrediction(mockPrediction);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error fetching prediction:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve prediction for this lead. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Call the API when the modal is opened
  React.useEffect(() => {
    if (open && leadData && !prediction) {
      fetchPrediction();
    }
    
    // Reset prediction when modal is closed
    if (!open) {
      setPrediction(null);
    }
  }, [open, leadData]);

  const handleRescore = () => {
    setPrediction(null);
    fetchPrediction();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Predictive Score: {leadData?.name || ""}
          </DialogTitle>
          <DialogDescription>
            AI-generated insights for this lead
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">Analyzing lead data...</span>
          </div>
        ) : prediction ? (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <ProgressCircle 
                value={prediction.lead_score} 
                max={100} 
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Classification</p>
              <Badge variant="outline" className="text-sm py-1">
                {prediction.classification}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">AI Summary</p>
              <Textarea 
                value={prediction.gpt_summary}
                readOnly
                className="resize-none min-h-[120px]"
              />
            </div>

            <Button 
              onClick={handleRescore} 
              className="w-full flex items-center justify-center"
              disabled={isLoading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Re-score
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center p-8">
            <p>No prediction data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PredictiveInsightModal;

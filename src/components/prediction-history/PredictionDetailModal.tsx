
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { Prediction } from "@/components/prediction-history/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PredictionDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  prediction: Prediction | null;
  handleRescorePrediction: (prediction: Prediction) => void;
  navigateToLeadExplorer: (leadName: string) => void;
}

const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({
  isOpen,
  setIsOpen,
  prediction,
  handleRescorePrediction,
  navigateToLeadExplorer,
}) => {
  // Function to determine badge color based on score
  const getBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-amber-500 hover:bg-amber-600";
    return "bg-rose-500 hover:bg-rose-600";
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (!prediction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Prediction Details for {prediction.lead_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Lead Score</p>
            <Badge className={`text-lg px-3 py-1 ${getBadgeColor(prediction.lead_score)}`}>
              {prediction.lead_score}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Classification</p>
            <Badge variant="outline" className="text-sm">
              {prediction.classification}
            </Badge>
          </div>
          
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium">GPT Summary</p>
            <Textarea
              value={prediction.gpt_summary || "No summary available"}
              readOnly
              className="min-h-[120px] resize-none"
            />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Industry</p>
            <p className="text-sm">{prediction.industry || "Not specified"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Stage</p>
            <p className="text-sm">{prediction.stage || "Not specified"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Engagement Score</p>
            <p className="text-sm">{prediction.engagement_score || "Not available"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Predicted At</p>
            <p className="text-sm">{formatDate(prediction.predicted_at)}</p>
          </div>
          
          <div className="col-span-2 flex space-x-3 pt-4">
            <Button
              onClick={() => handleRescorePrediction(prediction)}
              className="w-1/2"
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Re-score
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigateToLeadExplorer(prediction.lead_name)}
              className="w-1/2"
            >
              Open in Lead Explorer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailModal;

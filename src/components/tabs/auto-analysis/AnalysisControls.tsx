
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";

interface AnalysisControlsProps {
  onStartAnalysis: () => void;
  isProcessing: boolean;
  datasetName: string;
}

const AnalysisControls: React.FC<AnalysisControlsProps> = ({
  onStartAnalysis,
  isProcessing,
  datasetName
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <Button 
            onClick={onStartAnalysis} 
            disabled={isProcessing}
            className="gap-2"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Analysis...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start AI Analysis
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Analyze {datasetName} with EDA, Modeling, and Evaluation agents
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisControls;

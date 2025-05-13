
import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Copy, FileText, Loader2 } from "lucide-react";

interface CoachingDisplayProps {
  coaching: string;
  isGenerating: boolean;
  progress: number;
  onCopyToClipboard: () => void;
  onSendToReport: () => void;
}

const CoachingDisplay: React.FC<CoachingDisplayProps> = ({
  coaching,
  isGenerating,
  progress,
  onCopyToClipboard,
  onSendToReport,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">Coaching Advice</h3>
          {coaching && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onCopyToClipboard}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onSendToReport}
                title="Send to report"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Loading indicator - Progress bar */}
        {progress > 0 && (
          <Progress value={progress} className="mb-4 h-2" />
        )}
        
        <div className="bg-muted/30 p-4 rounded-md prose prose-sm max-w-none flex-grow overflow-y-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">Generating coaching advice...</p>
              </div>
            </div>
          ) : coaching ? (
            <ReactMarkdown>{coaching}</ReactMarkdown>
          ) : (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
              <p>
                Select a lead and provide context to generate coaching advice
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {coaching && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onCopyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={onSendToReport}
            >
              <FileText className="mr-2 h-4 w-4" /> Add to Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachingDisplay;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

type AgentStatus = {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  message?: string;
};

type ProcessingStatusType = "idle" | "processing" | "completed" | "failed";

interface ProcessingStatusProps {
  status: ProcessingStatusType;
  progress: number;
  agents: AgentStatus[];
  errorDetails: string | null;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  progress,
  agents,
  errorDetails
}) => {
  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="animate-spin h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  switch (status) {
    case "idle":
      return null;
    case "processing":
    case "completed":
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <Card className="mt-4">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Agent Activity</h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      {getAgentStatusIcon(agent.status)}
                      <span>{agent.name}</span>
                    </div>
                    <span className="text-sm capitalize text-muted-foreground">{agent.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    case "failed":
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Analysis failed</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Please check your files and try again.</p>
            {errorDetails && (
              <p className="text-sm font-mono bg-rose-50 p-2 rounded whitespace-pre-wrap">{errorDetails}</p>
            )}
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};

export default ProcessingStatus;

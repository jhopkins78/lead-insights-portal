
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AgentOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface OptimizationResponse {
  pipeline: {
    steps: Array<{
      agent: string;
      order: number;
      config?: Record<string, any>;
    }>;
    optimizationNotes: string[];
  };
  changes: {
    reordered: string[];
    excluded: string[];
    optimized: boolean;
  };
}

const PipelineOptimizer: React.FC = () => {
  const [agents, setAgents] = useState<AgentOption[]>([
    { id: "insight", name: "Insight Agent", description: "Extracts insights from text content", enabled: true },
    { id: "lead", name: "Lead Scoring Agent", description: "Evaluates and scores potential leads", enabled: true },
    { id: "ltv", name: "LTV Agent", description: "Estimates customer lifetime value", enabled: true },
    { id: "eda", name: "EDA Agent", description: "Performs exploratory data analysis", enabled: false },
    { id: "modeling", name: "Modeling Agent", description: "Creates predictive models", enabled: false },
    { id: "evaluation", name: "Evaluation Agent", description: "Evaluates model performance", enabled: false },
    { id: "report", name: "Report Agent", description: "Generates comprehensive reports", enabled: true }
  ]);
  
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResponse | null>(null);
  const [isJsonExpanded, setIsJsonExpanded] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleAgentToggle = (id: string) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };
  
  const handleOptimize = async () => {
    const enabledAgents = agents.filter(agent => agent.enabled).map(agent => agent.id);
    
    if (enabledAgents.length === 0) {
      toast({
        title: "No agents selected",
        description: "Please enable at least one agent to optimize the pipeline",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      // For the demo, we'll simulate a response since we don't have a real backend
      // In a real app, you would send the data to the endpoint
      // const response = await fetch("/pipeline-optimize", ...);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response data
      const mockResponse: OptimizationResponse = {
        pipeline: {
          steps: [
            { agent: "insight", order: 1 },
            { agent: "lead", order: 2 },
            { agent: "eda", order: 3, config: { sample_size: 0.8, feature_importance: true } },
            { agent: "ltv", order: 4, config: { prediction_horizon: "24months" } },
            { agent: "report", order: 5 }
          ],
          optimizationNotes: [
            "Moved EDA agent before LTV for better feature selection",
            "Excluded Modeling and Evaluation agents as they require specific datasets",
            "Optimized LTV agent configuration for B2B sales patterns"
          ]
        },
        changes: {
          reordered: ["eda", "ltv"],
          excluded: ["modeling", "evaluation"],
          optimized: true
        }
      };
      
      setOptimizationResult(mockResponse);
      toast({
        title: "Pipeline optimized",
        description: "Agent pipeline has been successfully reconfigured",
      });
    } catch (error) {
      console.error("Error optimizing pipeline:", error);
      toast({
        title: "Optimization failed",
        description: "Failed to optimize the agent pipeline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Pipeline Optimizer</h2>
        <p className="text-muted-foreground mb-6">
          Configure and optimize your AI agent pipeline for maximum effectiveness and efficiency.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enable/Disable Agents</CardTitle>
          <CardDescription>
            Select which agents to include in your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between space-x-2 border-b pb-3 last:border-0">
                <div>
                  <Label htmlFor={`agent-${agent.id}`} className="font-medium">
                    {agent.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
                <Switch
                  id={`agent-${agent.id}`}
                  checked={agent.enabled}
                  onCheckedChange={() => handleAgentToggle(agent.id)}
                />
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleOptimize}
            className="mt-6 w-full md:w-auto"
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Optimize Pipeline
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {optimizationResult && (
        <div className="space-y-6">
          <Alert className="border-green-500 bg-green-50">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle>Pipeline Optimized Successfully</AlertTitle>
            <AlertDescription>
              Your agent pipeline has been reconfigured for better performance and efficiency.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Optimization Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Optimization Notes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {optimizationResult.pipeline.optimizationNotes.map((note, index) => (
                      <li key={index} className="text-muted-foreground">{note}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Changes Made:</h4>
                  <div className="space-y-2">
                    {optimizationResult.changes.reordered.length > 0 && (
                      <p>
                        <span className="font-medium">Reordered:</span>{" "}
                        {optimizationResult.changes.reordered.join(", ")}
                      </p>
                    )}
                    {optimizationResult.changes.excluded.length > 0 && (
                      <p>
                        <span className="font-medium">Excluded:</span>{" "}
                        {optimizationResult.changes.excluded.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Collapsible open={isJsonExpanded} onOpenChange={setIsJsonExpanded}>
                    <CollapsibleTrigger className="flex items-center font-medium text-sm hover:underline">
                      {isJsonExpanded ? "Hide" : "Show"} Pipeline Configuration
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                        {JSON.stringify(optimizationResult.pipeline, null, 2)}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PipelineOptimizer;

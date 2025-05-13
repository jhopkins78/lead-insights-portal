
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { PlayCircle, ChevronDown, Settings, Loader2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  agents: string[];
  outcomes: Record<string, number>;
}

const ScenarioPlanner: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "insight", name: "Insight Agent", description: "Extracts insights from text content", enabled: true },
    { id: "lead", name: "Lead Scoring Agent", description: "Evaluates and scores potential leads", enabled: true },
    { id: "ltv", name: "LTV Agent", description: "Estimates customer lifetime value", enabled: true },
    { id: "eda", name: "EDA Agent", description: "Performs exploratory data analysis", enabled: true },
    { id: "modeling", name: "Modeling Agent", description: "Creates predictive models", enabled: false },
    { id: "evaluation", name: "Evaluation Agent", description: "Evaluates model performance", enabled: false },
    { id: "report", name: "Report Agent", description: "Generates comprehensive reports", enabled: true }
  ]);
  
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const scenarios: Scenario[] = [
    {
      id: "high_growth",
      name: "High Growth Scenario",
      description: "Assumes aggressive customer acquisition and low churn",
      agents: ["insight", "lead", "ltv", "eda", "modeling"],
      outcomes: {
        conversion_rate: 0.15,
        customer_growth: 0.25,
        churn_rate: 0.05,
        cac: 120,
        ltv: 1500,
        roi: 1150
      }
    },
    {
      id: "conservative",
      name: "Conservative Scenario",
      description: "Assumes moderate growth with focus on retention",
      agents: ["insight", "lead", "ltv", "eda"],
      outcomes: {
        conversion_rate: 0.08,
        customer_growth: 0.12,
        churn_rate: 0.07,
        cac: 90,
        ltv: 1200,
        roi: 1233
      }
    },
    {
      id: "cost_efficient",
      name: "Cost Efficiency Scenario",
      description: "Focuses on reducing CAC and improving LTV",
      agents: ["lead", "ltv", "eda", "evaluation"],
      outcomes: {
        conversion_rate: 0.10,
        customer_growth: 0.08,
        churn_rate: 0.10,
        cac: 65,
        ltv: 950,
        roi: 1362
      }
    }
  ];

  const handleAgentToggle = (id: string) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const handleRunScenario = () => {
    if (!selectedScenario) {
      toast({
        title: "No scenario selected",
        description: "Please select a scenario to run the simulation",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      if (scenario) {
        // Adjust outcomes based on enabled agents
        const enabledAgentIds = agents.filter(a => a.enabled).map(a => a.id);
        const matchingAgents = scenario.agents.filter(a => enabledAgentIds.includes(a));
        const agentEfficiencyFactor = matchingAgents.length / scenario.agents.length;
        
        setResults({
          ...scenario.outcomes,
          conversion_rate: scenario.outcomes.conversion_rate * agentEfficiencyFactor,
          customer_growth: scenario.outcomes.customer_growth * agentEfficiencyFactor,
          churn_rate: scenario.outcomes.churn_rate * (2 - agentEfficiencyFactor), // Higher is worse for churn
          roi: scenario.outcomes.roi * agentEfficiencyFactor
        });
      }
      
      setIsRunning(false);
      
      toast({
        title: "Scenario simulation complete",
        description: "View the results to see projected outcomes",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Scenario Planner</h2>
        <p className="text-muted-foreground mb-6">
          Plan and simulate different business scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Scenario</CardTitle>
              <CardDescription>
                Choose a business scenario to simulate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedScenario && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-sm">
                    {scenarios.find(s => s.id === selectedScenario)?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Agent Configuration</span>
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="flex items-center text-sm font-normal text-muted-foreground hover:text-foreground transition-colors">
                    {isOpen ? "Hide Agents" : "Show Agents"}
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                </Collapsible>
              </CardTitle>
              <CardDescription>
                Enable or disable agents to see how they affect the scenario
              </CardDescription>
            </CardHeader>
            <Collapsible open={isOpen}>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between space-x-2">
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
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
            <CardContent className={!isOpen ? "pt-0" : ""}>
              <Button 
                onClick={handleRunScenario} 
                disabled={isRunning || !selectedScenario}
                className="w-full md:w-auto bg-insight-500 hover:bg-insight-600 mt-4"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Running Scenario...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    <span>Run Scenario</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Scenario Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Conversion Rate</p>
                    <p className="text-2xl font-bold text-insight-800">
                      {(results.conversion_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Monthly Customer Growth</p>
                    <p className="text-2xl font-bold text-insight-800">
                      {(results.customer_growth * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Monthly Churn Rate</p>
                    <p className="text-2xl font-bold text-insight-800">
                      {(results.churn_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Customer Acquisition Cost</p>
                    <p className="text-2xl font-bold text-insight-800">
                      ${results.cac.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Customer Lifetime Value</p>
                    <p className="text-2xl font-bold text-insight-800">
                      ${results.ltv.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">ROI</p>
                    <p className="text-2xl font-bold text-insight-800">
                      {(results.roi).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <PlayCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground">Run a scenario to see the projected outcomes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;

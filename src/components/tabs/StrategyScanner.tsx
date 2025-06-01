
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Tag, FileText, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";

// Types for the market signal response
interface MarketSignalResponse {
  themes: {
    name: string;
    weight: number;
    color?: string;
  }[];
  insights: {
    title: string;
    description: string;
  }[];
  actions: {
    suggestion: string;
    priority: "high" | "medium" | "low";
    category: string;
  }[];
}

const StrategyScanner: React.FC = () => {
  const { currentDataset } = useDataset();
  const [marketText, setMarketText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<MarketSignalResponse | null>(null);
  const { toast } = useToast();
  
  // Function to handle the scan request
  const handleScan = async () => {
    if (!marketText && !currentDataset) {
      toast({
        title: "Input needed",
        description: "Please paste market text or upload a dataset to scan",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For the demo, we'll simulate a response since we don't have a real backend
      // In a real app, you would send the data to the endpoint
      // const response = await fetch("/market-signal", ...);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const mockResponse: MarketSignalResponse = {
        themes: [
          { name: "Digital Transformation", weight: 10, color: "#8B5CF6" },
          { name: "Remote Work", weight: 8, color: "#D946EF" },
          { name: "AI Integration", weight: 12, color: "#0EA5E9" },
          { name: "Cybersecurity", weight: 9, color: "#F97316" },
          { name: "Supply Chain", weight: 7, color: "#0EA5E9" },
          { name: "Sustainability", weight: 6, color: "#10B981" },
          { name: "Customer Experience", weight: 8, color: "#8B5CF6" },
          { name: "Data Privacy", weight: 9, color: "#F97316" }
        ],
        insights: [
          { 
            title: "AI Adoption Accelerating", 
            description: "Companies implementing AI solutions are seeing 23% higher operational efficiency across departments."
          },
          { 
            title: "Hybrid Work Model Dominates", 
            description: "78% of enterprises are maintaining hybrid work policies, requiring new collaborative tools and security measures."
          },
          { 
            title: "Supply Chain Vulnerabilities", 
            description: "Ongoing disruptions necessitate more resilient and diversified supply networks with 40% of companies planning major redesigns."
          }
        ],
        actions: [
          { 
            suggestion: "Develop an AI implementation roadmap focusing on operational workflows", 
            priority: "high",
            category: "Technology"
          },
          { 
            suggestion: "Enhance collaboration platform security for distributed workforce", 
            priority: "medium",
            category: "Security"
          },
          { 
            suggestion: "Audit current supply chain for single points of failure", 
            priority: "high",
            category: "Operations"
          },
          { 
            suggestion: "Create customer journey maps for digital-first engagement", 
            priority: "medium",
            category: "Customer"
          },
          { 
            suggestion: "Evaluate sustainability initiatives against competitor benchmarks", 
            priority: "low",
            category: "ESG"
          }
        ]
      };
      
      setScanResults(mockResponse);
      toast({
        title: "Scan complete",
        description: "Market signals have been analyzed successfully",
      });
    } catch (error) {
      console.error("Error scanning market signals:", error);
      toast({
        title: "Scan failed",
        description: "Failed to analyze market signals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-500 hover:bg-rose-600";
      case "medium":
        return "bg-amber-500 hover:bg-amber-600";
      case "low":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Strategy Scanner</h2>
        <p className="text-muted-foreground mb-6">
          Analyze market texts and documents to identify strategic signals, trends, and actionable insights.
        </p>
      </div>

      {/* Dataset Status */}
      <DatasetStatus moduleName="Strategy Scanner" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="marketText" className="block text-sm font-medium">
              Paste Market Text {currentDataset ? "or Use Uploaded Dataset" : ""}
            </label>
            <Textarea
              id="marketText"
              value={marketText}
              onChange={(e) => setMarketText(e.target.value)}
              placeholder="Paste your market research, news, or trend data here..."
              className="min-h-[200px]"
            />
          </div>
          
          <Button 
            onClick={handleScan} 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Scan for Market Signals
              </>
            )}
          </Button>
        </div>
        
        {scanResults && (
          <div className="space-y-6 md:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">Identified Themes & Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {scanResults.themes.map((theme, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="text-sm py-1 px-3"
                      style={{ 
                        backgroundColor: `${theme.color}20`, 
                        color: theme.color,
                        borderColor: `${theme.color}40`,
                        fontSize: `${Math.min(1 + theme.weight / 10, 1.5)}rem`
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {theme.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">Strategic Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {scanResults.insights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-insight-500 pl-4 py-1">
                      <h4 className="font-semibold text-lg">{insight.title}</h4>
                      <p className="text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action Suggestion</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scanResults.actions.map((action, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{action.suggestion}</TableCell>
                        <TableCell>{action.category}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyScanner;

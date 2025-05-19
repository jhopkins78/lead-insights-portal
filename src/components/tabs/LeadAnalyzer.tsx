
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeLead, LeadAnalysisResponse, LeadAnalysisRequest } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChartBar, Loader2 } from "lucide-react";

const LeadAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState<LeadAnalysisRequest>({
    name: "",
    title: "",
    company: "",
    email: "",
    intent: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LeadAnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const requiredFields = ["name", "company", "email"] as const;
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Set the API base URL to the render.com URL for testing
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "https://retool-dashboard.onrender.com";
      
      // Map our internal structure to what the API expects
      const apiRequestBody = {
        lead_name: formData.name,
        job_title: formData.title,
        email: formData.email,
        company: formData.company,
        intent: formData.intent
      };
      
      // Use fetch directly for testing
      const response = await fetch(`${apiUrl}/leads/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      toast({
        title: "Lead analyzed",
        description: "Lead analysis has been completed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing lead:", error);
      toast({
        title: "Error",
        description: `Failed to analyze lead: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-rose-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Lead Analyzer</h2>
        <p className="text-muted-foreground">
          Enter lead details below for comprehensive analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Marketing Director"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Corp"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="intent">Intent/Interest</Label>
            <Input
              id="intent"
              name="intent"
              value={formData.intent}
              onChange={handleChange}
              placeholder="Interested in enterprise solution"
            />
          </div>
          
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-insight-500 hover:bg-insight-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Lead"
              )}
            </Button>
          </div>
        </div>
      </form>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="border-t-4 border-t-insight-500 shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                Lead Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-muted">
                  <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Score</span>
                  <span>{result.score}/100</span>
                </div>
                <Progress value={result.score} className={getProgressColor(result.score)} />
              </div>
              {result.recommendations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Enriched Lead Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.enriched_data.company_info && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">COMPANY INFO</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(result.enriched_data.company_info).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                        <dd className="text-sm">{value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>
              )}

              {result.enriched_data.contact_info && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">CONTACT INFO</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(result.enriched_data.contact_info).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                        <dd className="text-sm">
                          {key === 'linkedin' || key === 'twitter' ? (
                            <a href={value} className="text-insight-500 hover:underline" target="_blank" rel="noreferrer">{value}</a>
                          ) : (
                            value
                          )}
                        </dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>
              )}

              {result.enriched_data.engagement_history && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">ENGAGEMENT HISTORY</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(result.enriched_data.engagement_history).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                        <dd className="text-sm">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadAnalyzer;

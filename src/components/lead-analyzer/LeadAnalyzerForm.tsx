
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { LeadAnalysisRequest, analyzeLead, LeadAnalysisResponse } from "@/services/api";

interface LeadAnalyzerFormProps {
  onAnalysisComplete: (result: LeadAnalysisResponse) => void;
  onAnalysisError: (error: string) => void;
}

const LeadAnalyzerForm: React.FC<LeadAnalyzerFormProps> = ({ 
  onAnalysisComplete,
  onAnalysisError
}) => {
  const [formData, setFormData] = useState<LeadAnalysisRequest>({
    name: "",
    title: "",
    company: "",
    email: "",
    intent: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
      // Use the analyzeLead function from our API service
      const result = await analyzeLead(formData);
      onAnalysisComplete(result);
      toast({
        title: "Lead analyzed",
        description: "Lead analysis has been completed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing lead:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Error",
        description: `Failed to analyze lead: ${errorMessage}`,
        variant: "destructive",
      });
      
      onAnalysisError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default LeadAnalyzerForm;

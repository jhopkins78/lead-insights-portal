
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LeadSelector from "@/components/coaching/LeadSelector";
import LeadSummaryCard from "@/components/coaching/LeadSummaryCard";
import ContextInput from "@/components/coaching/ContextInput";
import CoachingDisplay from "@/components/coaching/CoachingDisplay";
import { useLeadCoaching } from "@/components/coaching/hooks/useLeadCoaching";
import { Lead } from "@/components/coaching/types";

const CoachingGenerator: React.FC = () => {
  const {
    selectedLeadId,
    setSelectedLeadId,
    context,
    setContext,
    coaching,
    isGenerating,
    selectedLead,
    setSelectedLead,
    progress,
    generateCoaching,
    copyToClipboard,
    sendToReport
  } = useLeadCoaching();

  // Fetch leads
  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await fetch("https://api.example.com/get_leads");
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      return response.json() as Promise<Lead[]>;
    },
  });

  // Update selected lead when the ID changes
  useEffect(() => {
    if (selectedLeadId && leads) {
      const lead = leads.find(lead => lead.id === selectedLeadId);
      setSelectedLead(lead || null);
    } else {
      setSelectedLead(null);
    }
  }, [selectedLeadId, leads, setSelectedLead]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Coaching Generator</h2>
        <p className="text-muted-foreground mb-6">
          Select a lead and provide context to generate personalized coaching advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <LeadSelector 
            selectedLeadId={selectedLeadId}
            onLeadSelect={setSelectedLeadId}
          />

          {selectedLead && <LeadSummaryCard lead={selectedLead} />}

          <ContextInput value={context} onChange={setContext} />

          <Button
            onClick={generateCoaching}
            disabled={isGenerating || !selectedLeadId || !context.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Coaching"
            )}
          </Button>
        </div>

        <CoachingDisplay
          coaching={coaching}
          isGenerating={isGenerating}
          progress={progress}
          onCopyToClipboard={copyToClipboard}
          onSendToReport={sendToReport}
        />
      </div>
    </div>
  );
};

export default CoachingGenerator;


import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  score?: number;
  last_insight?: string;
}

interface LeadSummaryCardProps {
  lead: Lead | null;
}

const LeadSummaryCard: React.FC<LeadSummaryCardProps> = ({ lead }) => {
  if (!lead) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Lead Summary</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title:</span>
            <span className="font-medium">{lead.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company:</span>
            <span className="font-medium">{lead.company}</span>
          </div>
          {lead.score !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lead Score:</span>
              <span className="font-medium">{lead.score}</span>
            </div>
          )}
        </div>
      </CardContent>
      {lead.last_insight && (
        <CardFooter className="border-t pt-2 pb-1">
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-1">Last AI Insight:</p>
            <p className="text-xs italic">{lead.last_insight}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default LeadSummaryCard;

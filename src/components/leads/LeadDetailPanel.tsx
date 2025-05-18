
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ChevronDown, Info } from "lucide-react";
import { Lead } from "@/components/coaching/types";

interface LeadDetailPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedLead: Lead | null;
  onReanalyze: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  isOpen,
  setIsOpen,
  selectedLead,
  onReanalyze,
}) => {
  if (!selectedLead) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
          <SheetDescription>View and analyze lead information</SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
            <p className="text-muted-foreground">{selectedLead.title} at {selectedLead.company}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{selectedLead.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Intent</p>
              <Badge variant="outline">{selectedLead.intent}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lead Score</p>
              <span 
                className={`font-medium ${
                  selectedLead.score >= 80 ? 'text-green-600' : 
                  selectedLead.score >= 60 ? 'text-amber-600' : 
                  'text-red-600'
                }`}
              >
                {selectedLead.score}
              </span>
            </div>
          </div>
          
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
              Additional Information
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
              <div className="space-y-2">
                {selectedLead.additional_data && Object.entries(selectedLead.additional_data).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground">{key}</p>
                    <p>{String(value)}</p>
                  </div>
                ))}
                {!selectedLead.additional_data && <p>No additional data available</p>}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-1">
                <Info className="h-4 w-4" /> Last Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLead.last_insight ? (
                <>
                  <p className="text-sm">{selectedLead.last_insight}</p>
                  {selectedLead.confidence && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {(selectedLead.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm">No insights available for this lead</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={onReanalyze} className="w-full">
                Re-analyze Lead
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailPanel;

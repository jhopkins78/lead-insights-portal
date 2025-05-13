
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  score?: number;
  last_insight?: string;
}

interface LeadSelectorProps {
  selectedLeadId: string;
  onLeadSelect: (leadId: string) => void;
}

const LeadSelector: React.FC<LeadSelectorProps> = ({ selectedLeadId, onLeadSelect }) => {
  // Fetch leads
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await fetch("https://api.example.com/get_leads");
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      return response.json() as Promise<Lead[]>;
    },
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Select Lead</label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : error ? (
        <div className="text-red-500 text-sm">Error loading leads</div>
      ) : (
        <Select value={selectedLeadId} onValueChange={onLeadSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a lead" />
          </SelectTrigger>
          <SelectContent>
            {leads && leads.length > 0 ? (
              leads.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.name} - {lead.title} at {lead.company}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-leads" disabled>
                No leads available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default LeadSelector;


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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Fetch leads
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      try {
        console.log(`🔍 Fetching leads for selector from: ${API_BASE_URL}/get_leads`);
        const response = await fetch(`${API_BASE_URL}/get_leads`);
        if (!response.ok) {
          console.warn(`🔍 Leads API not available (${response.status}), using empty array`);
          throw new Error("Failed to fetch leads");
        }
        const data = await response.json();
        console.log(`🔍 Successfully fetched ${data.length} leads for selector`);
        return data as Lead[];
      } catch (error) {
        console.warn("🔍 Failed to fetch leads for selector, returning empty array:", error);
        return [] as Lead[];
      }
    },
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Select Lead</label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : error ? (
        <div className="text-amber-500 text-sm">Leads temporarily unavailable</div>
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


import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Filter, Search } from "lucide-react";

interface LeadFiltersProps {
  scoreRange: number[];
  setScoreRange: (value: number[]) => void;
  intentFilter: string;
  setIntentFilter: (value: string) => void;
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  scoreRange,
  setScoreRange,
  intentFilter,
  setIntentFilter,
  companyFilter,
  setCompanyFilter,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-muted/30 p-4 rounded-md space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Score Range: {scoreRange[0]} - {scoreRange[1]}
          </label>
          <Slider
            value={scoreRange}
            min={0}
            max={100}
            step={1}
            onValueChange={setScoreRange}
            className="py-4"
          />
        </div>
        
        {/* Intent Filter */}
        <div>
          <label className="text-sm font-medium">Intent</label>
          <Input
            placeholder="Filter by intent..."
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="mt-1"
          />
        </div>
        
        {/* Company Filter */}
        <div>
          <label className="text-sm font-medium">Company</label>
          <Input
            placeholder="Filter by company..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads by name, email, title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default LeadFilters;

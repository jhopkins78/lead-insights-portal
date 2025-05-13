
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Filter, Search, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeLead, LeadAnalysisRequest } from "@/services/api";

// Define types for our Lead data
interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  intent: string;
  score: number;
  last_insight?: string;
  confidence?: number;
  additional_data?: Record<string, any>;
}

// Mock API function to fetch leads
const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`https://api.example.com/get_leads`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    // Return mock data for demonstration purposes
    return [
      {
        id: "1",
        name: "John Doe",
        title: "CTO",
        company: "Tech Solutions Inc",
        email: "john@techsolutions.com",
        intent: "Product Demo",
        score: 85,
        last_insight: "Highly engaged with product pages",
        confidence: 0.92
      },
      {
        id: "2",
        name: "Jane Smith",
        title: "Marketing Director",
        company: "Global Media",
        email: "jane@globalmedia.com",
        intent: "Pricing Information",
        score: 72,
        last_insight: "Downloaded whitepaper on ROI",
        confidence: 0.78
      },
      {
        id: "3",
        name: "Michael Johnson",
        title: "CEO",
        company: "StartUp Innovations",
        email: "michael@startupinnovations.com",
        intent: "Partnership",
        score: 91,
        last_insight: "Attended webinar and asked questions",
        confidence: 0.95
      },
      {
        id: "4",
        name: "Sarah Williams",
        title: "Operations Manager",
        company: "Logistics Pro",
        email: "sarah@logisticspro.com",
        intent: "Technical Support",
        score: 53,
        last_insight: "Submitted support ticket",
        confidence: 0.68
      },
      {
        id: "5",
        name: "Robert Brown",
        title: "IT Director",
        company: "Healthcare Systems",
        email: "robert@healthcaresystems.com",
        intent: "Product Demo",
        score: 78,
        last_insight: "Requested feature comparison",
        confidence: 0.86
      }
    ];
  }
};

const LeadExplorer: React.FC = () => {
  // State for filters
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  const [intentFilter, setIntentFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for side panel
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof Lead>("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const { toast } = useToast();
  
  // Fetch leads data
  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
  
  // Function to handle row click
  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };
  
  // Function to re-analyze lead
  const handleReanalyze = async () => {
    if (!selectedLead) return;
    
    try {
      toast({
        title: "Analyzing lead",
        description: "Please wait while we analyze this lead...",
      });
      
      const leadData: LeadAnalysisRequest = {
        name: selectedLead.name,
        title: selectedLead.title,
        company: selectedLead.company,
        email: selectedLead.email,
        intent: selectedLead.intent
      };
      
      const result = await analyzeLead(leadData);
      
      toast({
        title: "Analysis complete",
        description: `Lead score: ${result.score.toFixed(2)}`,
      });
      
      // Refresh leads data
      refetch();
    } catch (error) {
      console.error("Error analyzing lead:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing this lead.",
        variant: "destructive",
      });
    }
  };
  
  // Filter and sort leads
  const filteredLeads = leads
    .filter((lead) => lead.score >= scoreRange[0] && lead.score <= scoreRange[1])
    .filter((lead) => 
      intentFilter ? lead.intent.toLowerCase().includes(intentFilter.toLowerCase()) : true
    )
    .filter((lead) => 
      companyFilter ? lead.company.toLowerCase().includes(companyFilter.toLowerCase()) : true
    )
    .filter((lead) => 
      searchQuery 
        ? lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        return sortDirection === 'asc'
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number);
      }
    });
    
  // Function to toggle sort
  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: keyof Lead) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading leads data.</p>
        <Button onClick={() => refetch()} className="mt-2">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Explorer</h2>
        <Button onClick={() => refetch()} variant="outline">Refresh Data</Button>
      </div>
      
      {/* Filters */}
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
      
      {/* Leads Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('name')}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Name {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('title')}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Title {renderSortIcon('title')}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('company')}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Company {renderSortIcon('company')}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('email')}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Email {renderSortIcon('email')}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('intent')}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Intent {renderSortIcon('intent')}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('score')}
                className="cursor-pointer hover:bg-muted/50 text-right"
              >
                <div className="flex items-center justify-end">
                  Score {renderSortIcon('score')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading leads...</TableCell>
              </TableRow>
            ) : filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">No leads match your filters</TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id}
                  onClick={() => handleRowClick(lead)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.title}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.intent}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className={`font-medium ${
                        lead.score >= 80 ? 'text-green-600' : 
                        lead.score >= 60 ? 'text-amber-600' : 
                        'text-red-600'
                      }`}
                    >
                      {lead.score}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Side Panel for Lead Details */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>View and analyze lead information</SheetDescription>
          </SheetHeader>
          
          {selectedLead && (
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
                  <Button onClick={handleReanalyze} className="w-full">
                    Re-analyze Lead
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LeadExplorer;

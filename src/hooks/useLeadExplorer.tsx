
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { analyzeLead, LeadAnalysisRequest } from "@/services/api";
import { Lead } from "@/components/coaching/types";

// Mock API function to fetch leads
const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get_leads`);
    
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

export const useLeadExplorer = () => {
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
  
  // State for prediction modal
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState<boolean>(false);
  const [selectedLeadForPrediction, setSelectedLeadForPrediction] = useState<Lead | null>(null);
  
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
  
  // Function to handle prediction button click
  const handleViewPrediction = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation(); // Prevent row click handler from firing
    setSelectedLeadForPrediction(lead);
    setIsPredictionModalOpen(true);
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

  return {
    // State
    scoreRange,
    setScoreRange,
    intentFilter,
    setIntentFilter,
    companyFilter,
    setCompanyFilter,
    searchQuery,
    setSearchQuery,
    isDetailOpen,
    setIsDetailOpen,
    selectedLead,
    sortField,
    sortDirection,
    isPredictionModalOpen,
    setIsPredictionModalOpen,
    selectedLeadForPrediction,
    
    // Data
    leads: filteredLeads,
    isLoading,
    error,
    refetch,
    
    // Functions
    handleRowClick,
    handleViewPrediction,
    handleReanalyze,
    handleSort,
  };
};

export default useLeadExplorer;

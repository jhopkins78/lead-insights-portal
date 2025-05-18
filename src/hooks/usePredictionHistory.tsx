
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the prediction type
interface Prediction {
  lead_name: string;
  company: string;
  deal_amount?: number;
  lead_score: number;
  classification: string;
  predicted_at: string;
  gpt_summary: string;
  industry?: string;
  stage?: string;
  engagement_score?: number;
}

// Define date range type
interface DateRange {
  from?: string;
  to?: string;
}

export function usePredictionHistory() {
  // State
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [sortColumn, setSortColumn] = useState<string>("predicted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { toast } = useToast();

  // Generate mock data for demonstration purposes
  // This would be replaced by a Supabase query once integrated
  const generateMockPredictions = (): Prediction[] => {
    const companies = ["Acme Corp", "Globex", "Initech", "Massive Dynamic", "Stark Industries"];
    const industries = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail"];
    const stages = ["Discovery", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
    const classifications = ["High Value", "Medium Value", "Low Value", "Strategic"];
    
    return Array(25).fill(0).map((_, i) => {
      const daysAgo = Math.floor(Math.random() * 30);
      const predictedDate = new Date();
      predictedDate.setDate(predictedDate.getDate() - daysAgo);
      
      return {
        lead_name: `Lead ${i + 1}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        deal_amount: Math.floor(Math.random() * 100000) + 10000,
        lead_score: Math.floor(Math.random() * 100),
        classification: classifications[Math.floor(Math.random() * classifications.length)],
        predicted_at: predictedDate.toISOString(),
        gpt_summary: `This lead from ${companies[Math.floor(Math.random() * companies.length)]} shows ${Math.random() > 0.5 ? "strong" : "moderate"} engagement with our product. Based on their interaction patterns and company profile, they appear to be a ${Math.random() > 0.5 ? "good" : "potential"} fit for our solutions.`,
        industry: industries[Math.floor(Math.random() * industries.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        engagement_score: Math.floor(Math.random() * 10) + 1,
      };
    });
  };

  // Fetch predictions on component mount
  useEffect(() => {
    // In a real implementation, this would be a Supabase query
    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        // Mock data for now
        const mockData = generateMockPredictions();
        setAllPredictions(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch prediction history.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [toast]);

  // Apply filters, sorting, and pagination
  useEffect(() => {
    let filteredResults = [...allPredictions];
    
    // Apply search filter
    if (searchQuery) {
      filteredResults = filteredResults.filter(
        (p) => p.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply score range filter
    filteredResults = filteredResults.filter(
      (p) => p.lead_score >= scoreRange[0] && p.lead_score <= scoreRange[1]
    );
    
    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filteredResults = filteredResults.filter(
        (p) => new Date(p.predicted_at) >= fromDate
      );
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredResults = filteredResults.filter(
        (p) => new Date(p.predicted_at) <= toDate
      );
    }
    
    // Apply sorting
    filteredResults.sort((a, b) => {
      const aValue = a[sortColumn as keyof Prediction];
      const bValue = b[sortColumn as keyof Prediction];
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    // Calculate total pages
    setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
    
    // Apply pagination
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedResults = filteredResults.slice(start, start + itemsPerPage);
    
    setPredictions(paginatedResults);
  }, [
    allPredictions,
    searchQuery,
    scoreRange,
    dateRange,
    sortColumn,
    sortOrder,
    currentPage,
    itemsPerPage,
  ]);

  // Handle re-scoring a prediction
  const handleRescorePrediction = async (prediction: Prediction) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your API
      const response = await fetch("https://lead-commander-api.onrender.com/leads/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: prediction.lead_name,
          company: prediction.company,
          deal_amount: prediction.deal_amount,
          engagement_score: prediction.engagement_score,
          industry: prediction.industry,
          stage: prediction.stage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // For demo purposes, let's update the prediction with new data
      const newScore = Math.floor(Math.random() * 100);
      const updatedPrediction = {
        ...prediction,
        lead_score: newScore,
        predicted_at: new Date().toISOString(),
      };
      
      // Update predictions
      setAllPredictions(prev => 
        prev.map(p => p.lead_name === prediction.lead_name ? updatedPrediction : p)
      );
      
      // Update selected prediction
      setSelectedPrediction(updatedPrediction);
      
      toast({
        title: "Success",
        description: "Prediction updated successfully.",
      });
    } catch (error) {
      console.error("Error re-scoring prediction:", error);
      toast({
        title: "Error",
        description: "Failed to update prediction.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle exporting to CSV
  const handleExportCSV = () => {
    try {
      const headers = [
        "Lead Name",
        "Company",
        "Lead Score",
        "Classification",
        "Predicted At",
        "Industry",
        "Stage",
        "Engagement Score",
      ].join(",");
      
      const rows = allPredictions.map(p => [
        p.lead_name,
        p.company,
        p.lead_score,
        p.classification,
        p.predicted_at,
        p.industry || "",
        p.stage || "",
        p.engagement_score || "",
      ].join(",")).join("\n");
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "prediction_history.csv");
      link.style.display = "none";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "CSV file downloaded successfully.",
      });
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: "Error",
        description: "Failed to export data to CSV.",
        variant: "destructive",
      });
    }
  };

  // Navigate to Lead Explorer with the selected lead
  const navigateToLeadExplorer = (leadName: string) => {
    // In a real implementation, this would navigate to the Lead Explorer tab
    // and pre-filter for the selected lead
    toast({
      title: "Navigation",
      description: `Navigating to Lead Explorer for ${leadName}`,
    });
    // For demo purposes we'll just close the modal
    setIsModalOpen(false);
  };

  return {
    predictions,
    searchQuery,
    setSearchQuery,
    scoreRange,
    setScoreRange,
    dateRange,
    setDateRange,
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedPrediction,
    setSelectedPrediction,
    isModalOpen,
    setIsModalOpen,
    handleRescorePrediction,
    handleExportCSV,
    navigateToLeadExplorer,
  };
}

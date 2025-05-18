
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

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
  const [error, setError] = useState<string | null>(null);
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

  // Fetch predictions from Supabase
  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('lead_predictions')
          .select('*')
          .order('predicted_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setAllPredictions(data as Prediction[]);
        } else {
          setAllPredictions([]);
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to fetch prediction history.",
          variant: "destructive",
        });
      } finally {
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
      
      // Get the response data
      const newPredictionData = await response.json();
      
      // Update the prediction in Supabase
      const { error: updateError } = await supabase
        .from('lead_predictions')
        .update({
          lead_score: newPredictionData.lead_score || prediction.lead_score,
          predicted_at: new Date().toISOString(),
          classification: newPredictionData.classification || prediction.classification
        })
        .eq('lead_name', prediction.lead_name);
        
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Refresh the data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('lead_predictions')
        .select('*')
        .order('predicted_at', { ascending: false });
        
      if (refreshError) {
        throw new Error(refreshError.message);
      }
      
      if (refreshedData) {
        setAllPredictions(refreshedData as Prediction[]);
      }
      
      // Find the updated prediction to select
      const updatedPrediction = refreshedData?.find(
        (p: Prediction) => p.lead_name === prediction.lead_name
      ) as Prediction;
      
      if (updatedPrediction) {
        setSelectedPrediction(updatedPrediction);
      }
      
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
    error,
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

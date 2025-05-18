
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Prediction } from "@/components/prediction-history/types";

export function usePredictionActions(allPredictions: Prediction[], refetchPredictions: () => Promise<void>) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  // Handle re-scoring a prediction
  const handleRescorePrediction = async (prediction: Prediction) => {
    setIsActionLoading(true);
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
      await refetchPredictions();
      
      // Find the updated prediction to select
      const { data: refreshedData } = await supabase
        .from('lead_predictions')
        .select('*')
        .eq('lead_name', prediction.lead_name)
        .single();
      
      if (refreshedData) {
        setSelectedPrediction(refreshedData as Prediction);
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
      setIsActionLoading(false);
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
    selectedPrediction,
    setSelectedPrediction,
    isModalOpen,
    setIsModalOpen,
    isActionLoading,
    handleRescorePrediction,
    handleExportCSV,
    navigateToLeadExplorer,
  };
}

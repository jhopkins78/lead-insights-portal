
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/components/prediction-history/types";
import { rescorePrediction, getPredictionByName } from "@/services/predictionService";

export function usePredictionActions(allPredictions: Prediction[], refetchPredictions: () => Promise<void>) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  // Handle re-scoring a prediction using our service
  const handleRescorePrediction = async (prediction: Prediction) => {
    setIsActionLoading(true);
    try {
      await rescorePrediction(prediction);
      
      // Refresh the data
      await refetchPredictions();
      
      // Get the updated prediction
      const refreshedData = await getPredictionByName(prediction.lead_name);
      setSelectedPrediction(refreshedData);
      
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


import React from "react";
import { usePredictionHistory } from "@/hooks/usePredictionHistory";
import PredictionHeader from "../prediction-history/PredictionHeader";
import PredictionFilters from "../prediction-history/PredictionFilters";
import PredictionTable from "../prediction-history/PredictionTable";
import PredictionPagination from "../prediction-history/PredictionPagination";
import PredictionDetailModal from "../prediction-history/PredictionDetailModal";
import { Prediction } from "@/components/prediction-history/types";

const PredictionHistoryViewer: React.FC = () => {
  // Use our refactored custom hook for prediction history data and state
  const {
    predictions,
    searchQuery,
    setSearchQuery,
    scoreRange,
    handleSliderChange,
    dateRange,
    setDateRange,
    handleSort,
    sortColumn,
    sortOrder,
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
  } = usePredictionHistory();

  // Handle viewing a prediction
  const handleViewPrediction = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PredictionHeader
        handleExportCSV={handleExportCSV}
        isLoading={isLoading}
        error={error}
      />
      
      <PredictionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        scoreRange={scoreRange}
        handleSliderChange={handleSliderChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isLoading={isLoading}
      />
      
      <PredictionTable
        predictions={predictions}
        isLoading={isLoading}
        error={error}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onViewPrediction={handleViewPrediction}
      />
      
      <PredictionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      
      <PredictionDetailModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        prediction={selectedPrediction}
        handleRescorePrediction={handleRescorePrediction}
        navigateToLeadExplorer={navigateToLeadExplorer}
      />
    </div>
  );
};

export default PredictionHistoryViewer;

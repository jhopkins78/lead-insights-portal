
import { useState } from "react";
import { usePredictionData } from "./prediction/usePredictionData";
import { usePredictionFilters } from "./prediction/usePredictionFilters";
import { usePredictionSort } from "./prediction/usePredictionSort";
import { usePredictionPagination } from "./prediction/usePredictionPagination";
import { usePredictionActions } from "./prediction/usePredictionActions";

export const usePredictionHistory = () => {
  // Use the data hook for fetching predictions
  const { allPredictions, isLoading, error, refetchPredictions } = usePredictionData();
  
  // Use the filters hook
  const { filters, setSearchQuery, setScoreRange, setDateRange, filteredPredictions } = 
    usePredictionFilters(allPredictions);
  
  // Use the sort hook
  const { sort, sortedPredictions, handleSort } = usePredictionSort(filteredPredictions);
  
  // Use the pagination hook
  const { pagination, setCurrentPage, paginatedPredictions } = 
    usePredictionPagination(sortedPredictions);
  
  // Use the actions hook
  const { 
    selectedPrediction, 
    setSelectedPrediction,
    isModalOpen,
    setIsModalOpen,
    isActionLoading,
    handleRescorePrediction,
    handleExportCSV,
    navigateToLeadExplorer
  } = usePredictionActions(allPredictions, refetchPredictions);
  
  // Handle slider changes
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      setScoreRange([values[0], values[1]]);
    }
  };

  return {
    // Expose all required properties and methods
    predictions: paginatedPredictions,
    searchQuery: filters.searchQuery,
    setSearchQuery,
    scoreRange: filters.scoreRange,
    handleSliderChange,
    dateRange: filters.dateRange,
    setDateRange,
    handleSort,
    sortColumn: sort.column,
    sortOrder: sort.order,
    isLoading,
    error,
    currentPage: pagination.currentPage,
    setCurrentPage,
    totalPages: pagination.totalPages,
    selectedPrediction,
    setSelectedPrediction,
    isModalOpen,
    setIsModalOpen,
    handleRescorePrediction,
    handleExportCSV,
    navigateToLeadExplorer,
  };
};

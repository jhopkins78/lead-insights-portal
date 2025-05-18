
import { usePredictionData } from "./prediction/usePredictionData";
import { usePredictionFilters } from "./prediction/usePredictionFilters";
import { usePredictionSort } from "./prediction/usePredictionSort";
import { usePredictionPagination } from "./prediction/usePredictionPagination";
import { usePredictionActions } from "./prediction/usePredictionActions";

export function usePredictionHistory() {
  // Get prediction data from Supabase
  const { allPredictions, isLoading, error, refetchPredictions } = usePredictionData();
  
  // Apply filters
  const { filters, setSearchQuery, setScoreRange, setDateRange, filteredPredictions } = 
    usePredictionFilters(allPredictions);
  
  // Apply sorting
  const { sort, sortedPredictions, handleSort } = 
    usePredictionSort(filteredPredictions);
  
  // Apply pagination
  const { pagination, setCurrentPage, paginatedPredictions } = 
    usePredictionPagination(sortedPredictions);
  
  // Actions
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

  // Helper function for slider value change
  const handleSliderChange = (value: number[]) => {
    setScoreRange([value[0], value[1]] as [number, number]);
  };

  return {
    predictions: paginatedPredictions,
    searchQuery: filters.searchQuery,
    setSearchQuery,
    scoreRange: filters.scoreRange,
    setScoreRange,
    handleSliderChange,
    dateRange: filters.dateRange,
    setDateRange,
    sortColumn: sort.column,
    sortOrder: sort.order,
    setSortColumn: (column: string) => handleSort(column),
    setSortOrder: (order: "asc" | "desc") => {},  // This is handled by handleSort
    isLoading: isLoading || isActionLoading,
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
    handleSort,
  };
}

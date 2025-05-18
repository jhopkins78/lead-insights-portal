
import { useState, useEffect } from "react";
import { Prediction } from "@/components/prediction-history/types";
import { PredictionFilters } from "./types";

export function usePredictionFilters(allPredictions: Prediction[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allPredictions];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) => p.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply score range filter
    filtered = filtered.filter(
      (p) => p.lead_score >= scoreRange[0] && p.lead_score <= scoreRange[1]
    );
    
    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filtered = filtered.filter(
        (p) => new Date(p.predicted_at) >= fromDate
      );
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(
        (p) => new Date(p.predicted_at) <= toDate
      );
    }
    
    setFilteredPredictions(filtered);
  }, [allPredictions, searchQuery, scoreRange, dateRange]);

  const filters: PredictionFilters = {
    searchQuery,
    scoreRange,
    dateRange
  };

  return {
    filters,
    setSearchQuery,
    setScoreRange,
    setDateRange,
    filteredPredictions
  };
}


import { useState, useEffect } from "react";
import { Prediction } from "@/components/prediction-history/types";
import { PredictionPage } from "./types";

export function usePredictionPagination(predictions: Prediction[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedPredictions, setPaginatedPredictions] = useState<Prediction[]>([]);

  // Apply pagination and calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(predictions.length / itemsPerPage));
    
    // Reset to first page if we're on a page that no longer exists
    if (currentPage > Math.ceil(predictions.length / itemsPerPage) && predictions.length > 0) {
      setCurrentPage(1);
    }
    
    // Apply pagination
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedResults = predictions.slice(start, start + itemsPerPage);
    
    setPaginatedPredictions(paginatedResults);
  }, [predictions, currentPage, itemsPerPage]);

  const pagination: PredictionPage = {
    currentPage,
    itemsPerPage,
    totalPages
  };

  return { 
    pagination,
    setCurrentPage,
    paginatedPredictions 
  };
}

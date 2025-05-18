
import { useState, useEffect } from "react";
import { Prediction } from "@/components/prediction-history/types";
import { PredictionSort } from "./types";

export function usePredictionSort(predictions: Prediction[]) {
  const [sortColumn, setSortColumn] = useState<string>("predicted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortedPredictions, setSortedPredictions] = useState<Prediction[]>([]);

  // Apply sorting
  useEffect(() => {
    const sorted = [...predictions].sort((a, b) => {
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
    
    setSortedPredictions(sorted);
  }, [predictions, sortColumn, sortOrder]);

  const sort: PredictionSort = {
    column: sortColumn,
    order: sortOrder
  };

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return { 
    sort,
    sortedPredictions,
    handleSort 
  };
}

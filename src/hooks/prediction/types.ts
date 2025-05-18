
import { Prediction, DateRange } from "@/components/prediction-history/types";

export interface PredictionFilters {
  searchQuery: string;
  scoreRange: [number, number];
  dateRange: DateRange;
}

export interface PredictionSort {
  column: string;
  order: "asc" | "desc";
}

export interface PredictionPage {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

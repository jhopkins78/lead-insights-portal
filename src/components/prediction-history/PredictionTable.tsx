import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Eye, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Prediction } from "@/components/prediction-history/types";

interface PredictionTableProps {
  predictions: Prediction[];
  isLoading: boolean;
  error: string | null;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  handleSort: (column: string) => void;
  onViewPrediction: (prediction: Prediction) => void;
}

const PredictionTable: React.FC<PredictionTableProps> = ({
  predictions,
  isLoading,
  error,
  sortColumn,
  sortOrder,
  handleSort,
  onViewPrediction,
}) => {
  // Function to determine badge color based on score
  const getBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-amber-500 hover:bg-amber-600";
    return "bg-rose-500 hover:bg-rose-600";
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("lead_name")}
            >
              Lead
              {sortColumn === "lead_name" && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("company")}
            >
              Company
              {sortColumn === "company" && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("lead_score")}
            >
              Score
              {sortColumn === "lead_score" && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("classification")}
            >
              Classification
              {sortColumn === "classification" && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("predicted_at")}
            >
              Date
              {sortColumn === "predicted_at" && (
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={`loading-${i}`}>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-destructive">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <p>Error loading prediction data</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : predictions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No prediction data found
              </TableCell>
            </TableRow>
          ) : (
            predictions.map((prediction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{prediction.lead_name}</TableCell>
                <TableCell>{prediction.company}</TableCell>
                <TableCell>
                  <Badge className={`${getBadgeColor(prediction.lead_score)}`}>
                    {prediction.lead_score}
                  </Badge>
                </TableCell>
                <TableCell>{prediction.classification}</TableCell>
                <TableCell>{formatDate(prediction.predicted_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPrediction(prediction)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PredictionTable;

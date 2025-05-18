import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Eye, ArrowUpDown, RefreshCcw, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePredictionHistory } from "@/hooks/usePredictionHistory";

const PredictionHistoryViewer: React.FC = () => {
  // Use our custom hook for prediction history data and state
  const {
    predictions,
    searchQuery,
    setSearchQuery,
    scoreRange,
    setScoreRange,
    dateRange,
    setDateRange,
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
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

  // Function to determine badge color based on score
  const getBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-amber-500 hover:bg-amber-600";
    return "bg-rose-500 hover:bg-rose-600";
  };

  // Function to format date
  const formatDate = (dateString: string, useRelative = true) => {
    try {
      const date = new Date(dateString);
      if (useRelative) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Handle slider value change with type conversion
  const handleSliderChange = (value: number[]) => {
    setScoreRange([value[0], value[1]] as [number, number]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Prediction History</h2>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading || !!error}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search by Lead</label>
          <Input
            placeholder="Search lead name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Score Range: {scoreRange[0]} - {scoreRange[1]}
          </label>
          <Slider
            defaultValue={[0, 100]}
            min={0}
            max={100}
            step={1}
            value={[scoreRange[0], scoreRange[1]]}
            onValueChange={handleSliderChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prediction Date</label>
          <div className="flex space-x-2">
            <Input
              type="date"
              value={dateRange.from ? dateRange.from : ""}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full"
              disabled={isLoading}
            />
            <Input
              type="date"
              value={dateRange.to ? dateRange.to : ""}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
                      onClick={() => {
                        setSelectedPrediction(prediction);
                        setIsModalOpen(true);
                      }}
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

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Prediction Details for {selectedPrediction?.lead_name}
            </DialogTitle>
          </DialogHeader>

          {selectedPrediction && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Lead Score</p>
                <Badge className={`text-lg px-3 py-1 ${getBadgeColor(selectedPrediction.lead_score)}`}>
                  {selectedPrediction.lead_score}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Classification</p>
                <Badge variant="outline" className="text-sm">
                  {selectedPrediction.classification}
                </Badge>
              </div>
              
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium">GPT Summary</p>
                <Textarea
                  value={selectedPrediction.gpt_summary}
                  readOnly
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Industry</p>
                <p className="text-sm">{selectedPrediction.industry || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Stage</p>
                <p className="text-sm">{selectedPrediction.stage || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Engagement Score</p>
                <p className="text-sm">{selectedPrediction.engagement_score || "Not available"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Predicted At</p>
                <p className="text-sm">{formatDate(selectedPrediction.predicted_at, false)}</p>
              </div>
              
              <div className="col-span-2 flex space-x-3 pt-4">
                <Button
                  onClick={() => handleRescorePrediction(selectedPrediction)}
                  className="w-1/2"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> Re-score
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigateToLeadExplorer(selectedPrediction.lead_name)}
                  className="w-1/2"
                >
                  Open in Lead Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PredictionHistoryViewer;

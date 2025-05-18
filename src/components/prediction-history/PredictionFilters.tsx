
import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface DateRange {
  from?: string;
  to?: string;
}

interface PredictionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  scoreRange: [number, number];
  handleSliderChange: (value: number[]) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  isLoading: boolean;
}

const PredictionFilters: React.FC<PredictionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  scoreRange,
  handleSliderChange,
  dateRange,
  setDateRange,
  isLoading,
}) => {
  return (
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
  );
};

export default PredictionFilters;

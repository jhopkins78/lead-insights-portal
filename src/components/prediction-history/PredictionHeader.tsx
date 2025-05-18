
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PredictionHeaderProps {
  handleExportCSV: () => void;
  isLoading: boolean;
  error: string | null;
}

const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  handleExportCSV,
  isLoading,
  error,
}) => {
  return (
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
  );
};

export default PredictionHeader;

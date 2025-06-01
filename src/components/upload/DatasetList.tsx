import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Dataset {
  id: string;
  name: string;
  uploadedAt: Date;
  fileType: string;
  size: number;
  usedBy: string[];
  status: "processing" | "ready" | "error";
}

interface DatasetListProps {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  onSelectDataset: (dataset: Dataset) => void;
  onRemoveDataset: (id: string) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  currentDataset,
  onSelectDataset,
  onRemoveDataset
}) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // De-duplicate datasets based on name and prefer "ready" status over "processing"
  const deduplicatedDatasets = React.useMemo(() => {
    const datasetMap = new Map<string, Dataset>();
    
    datasets.forEach(dataset => {
      const key = dataset.name; // Use name as the deduplication key
      const existing = datasetMap.get(key);
      
      if (!existing) {
        datasetMap.set(key, dataset);
      } else {
        // Prefer "ready" status over "processing" or "error"
        if (dataset.status === "ready" && existing.status !== "ready") {
          datasetMap.set(key, dataset);
        } else if (dataset.status === "processing" && existing.status === "error") {
          datasetMap.set(key, dataset);
        }
        // Keep the most recent one if statuses are the same
        else if (dataset.status === existing.status && 
                 new Date(dataset.uploadedAt) > new Date(existing.uploadedAt)) {
          datasetMap.set(key, dataset);
        }
      }
    });
    
    return Array.from(datasetMap.values());
  }, [datasets]);

  if (deduplicatedDatasets.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Available Datasets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deduplicatedDatasets.map((dataset) => (
            <div key={dataset.id} className={`flex items-center justify-between p-3 border rounded-lg ${
              currentDataset?.id === dataset.id ? 'border-green-500 bg-green-50' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {dataset.status === 'ready' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : dataset.status === 'processing' ? (
                    <Upload className="h-5 w-5 animate-pulse text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">{dataset.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(dataset.uploadedAt, 'MMM d, yyyy HH:mm')}
                      <span>•</span>
                      <span>{formatFileSize(dataset.size)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentDataset?.id === dataset.id && (
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                )}
                <div className="flex flex-wrap gap-1">
                  {dataset.usedBy.slice(0, 2).map((module) => (
                    <Badge key={module} variant="secondary" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                  {dataset.usedBy.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{dataset.usedBy.length - 2}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectDataset(dataset)}
                  disabled={currentDataset?.id === dataset.id}
                >
                  {currentDataset?.id === dataset.id ? 'Selected' : 'Select'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDataset(dataset.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetList;

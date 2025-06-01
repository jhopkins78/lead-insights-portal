
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Info } from "lucide-react";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DataUploader: React.FC = () => {
  const { currentDataset } = useDataset();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Data Upload Management</h2>
        <p className="text-muted-foreground mb-6">
          View and manage your uploaded datasets. All uploads are now handled through the centralized Data Upload Hub in the header.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>New Upload Process:</strong> Use the "Data Upload Hub" button in the top-right header to upload new datasets. 
          Files uploaded there will be automatically available across all analysis modules.
        </AlertDescription>
      </Alert>

      {/* Dataset Status */}
      <DatasetStatus moduleName="Data Management" />

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentDataset ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">File Type</h4>
                  <p className="text-lg">{currentDataset.fileType.toUpperCase()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <p className="text-lg capitalize">{currentDataset.status}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Used By Modules</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentDataset.usedBy.map((module) => (
                    <span key={module} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No dataset currently loaded. Use the Data Upload Hub to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUploader;

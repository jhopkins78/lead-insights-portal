
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Info, RefreshCw } from "lucide-react";
import DatasetStatus from "@/components/upload/DatasetStatus";
import { useDataset } from "@/contexts/DatasetContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DataUploader: React.FC = () => {
  const { 
    currentDataset, 
    datasets, 
    isLoading, 
    error, 
    fetchAvailableDatasets,
    selectDataset 
  } = useDataset();

  const handleRefreshDatasets = async () => {
    await fetchAvailableDatasets();
  };

  const handleSelectDataset = (datasetId: string) => {
    selectDataset(datasetId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Data Upload Management</h2>
          <p className="text-muted-foreground mb-6">
            View and manage your uploaded datasets. All uploads are now handled through the centralized Data Upload Hub in the header.
          </p>
        </div>
        <Button 
          onClick={handleRefreshDatasets} 
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Connection Error:</strong> {error}
            <br />
            <span className="text-sm">Using local fallback data if available.</span>
          </AlertDescription>
        </Alert>
      )}

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

      {/* Available Datasets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Available Datasets ({datasets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading datasets...</p>
            </div>
          ) : datasets.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No datasets found. Use the Data Upload Hub to upload your first dataset.
            </p>
          ) : (
            <div className="space-y-3">
              {datasets.map((dataset) => (
                <div 
                  key={dataset.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentDataset?.id === dataset.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectDataset(dataset.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{dataset.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {dataset.uploadedAt.toLocaleDateString()} • {dataset.fileType.toUpperCase()}
                      </p>
                      {dataset.usedBy.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dataset.usedBy.map((module) => (
                            <span key={module} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {module}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        dataset.status === 'ready' ? 'bg-green-100 text-green-800' :
                        dataset.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dataset.status}
                      </span>
                      {currentDataset?.id === dataset.id && (
                        <p className="text-xs text-blue-600 mt-1">Currently Active</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      {currentDataset && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Current Dataset Details
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Size</h4>
                  <p className="text-lg">{(currentDataset.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Dataset ID</h4>
                  <p className="text-sm font-mono">{currentDataset.id}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Used By Modules</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentDataset.usedBy.length > 0 ? (
                    currentDataset.usedBy.map((module) => (
                      <span key={module} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {module}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Not yet used by any modules</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataUploader;

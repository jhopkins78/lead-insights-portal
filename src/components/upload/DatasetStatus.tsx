import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataset } from '@/contexts/DatasetContext';
import { Database, Clock, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DatasetStatusProps {
  moduleName: string;
}

const DatasetStatus: React.FC<DatasetStatusProps> = ({ 
  moduleName
}) => {
  const { 
    currentDataset, 
    updateDatasetUsage, 
    isLoading, 
    error, 
    fetchAvailableDatasets 
  } = useDataset();

  // Only update usage when currentDataset changes, not on every render
  React.useEffect(() => {
    if (currentDataset?.id) {
      updateDatasetUsage(currentDataset.id, [moduleName]);
    }
  }, [currentDataset?.id, moduleName]); // Remove updateDatasetUsage from dependencies to prevent infinite loop

  const handleRefresh = async () => {
    await fetchAvailableDatasets();
  };

  if (isLoading) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="text-center py-8">
          <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading datasets...</h3>
          <p className="text-muted-foreground">
            Fetching available datasets from the backend
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-dashed border-2 border-red-200">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Backend Connection Error</h3>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentDataset) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="text-center py-8">
          <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No dataset selected</h3>
          <p className="text-muted-foreground mb-4">
            Upload data through the <strong>Data Upload Hub</strong> in the top-right header to get started with {moduleName}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            <Info className="h-4 w-4" />
            <span>Use the "Data Upload Hub" button in the header to upload datasets</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'border-l-green-500';
      case 'processing': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor(currentDataset.status)}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              currentDataset.status === 'ready' ? 'bg-green-100' :
              currentDataset.status === 'processing' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Database className={`h-5 w-5 ${
                currentDataset.status === 'ready' ? 'text-green-600' :
                currentDataset.status === 'processing' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <div>
              <h3 className="font-medium">{currentDataset.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Uploaded {format(currentDataset.uploadedAt, 'MMM d, yyyy HH:mm')}
                <span>•</span>
                <span>{formatFileSize(currentDataset.size)}</span>
                <Badge variant="outline" className="ml-2">
                  {currentDataset.fileType.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${
                currentDataset.status === 'ready' ? 'bg-green-50 text-green-700' :
                currentDataset.status === 'processing' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }`}
            >
              Active in {moduleName}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Use Data Upload Hub to switch datasets</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetStatus;

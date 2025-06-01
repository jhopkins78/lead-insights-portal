
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataset } from '@/contexts/DatasetContext';
import { Database, Clock, RefreshCw, Info } from 'lucide-react';
import { format } from 'date-fns';

interface DatasetStatusProps {
  moduleName: string;
}

const DatasetStatus: React.FC<DatasetStatusProps> = ({ 
  moduleName
}) => {
  const { currentDataset, updateDatasetUsage } = useDataset();

  React.useEffect(() => {
    if (currentDataset) {
      updateDatasetUsage(currentDataset.id, [moduleName]);
    }
  }, [currentDataset, moduleName, updateDatasetUsage]);

  if (!currentDataset) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="text-center py-8">
          <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No dataset loaded</h3>
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

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
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
            <Badge variant="secondary" className="bg-green-50 text-green-700">
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

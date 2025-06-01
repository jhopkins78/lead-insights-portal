
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Database, Clock, FileText, CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useDataset } from "@/contexts/DatasetContext";

interface DataUploadHubProps {
  trigger?: React.ReactNode;
}

const DataUploadHub: React.FC<DataUploadHubProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { datasets, currentDataset, addDataset, removeDataset, setCurrentDataset } = useDataset();
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Process each file
      for (const file of files) {
        const newDataset = {
          id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          uploadedAt: new Date(),
          fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: file.size,
          usedBy: ['Auto Analysis', 'EDA Explorer', 'Strategy Scanner'],
          status: 'processing' as const
        };

        addDataset(newDataset);

        // Simulate processing
        setTimeout(() => {
          addDataset({ ...newDataset, status: 'ready' });
        }, 2000);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) processed and available across all modules`,
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDataset = (id: string) => {
    removeDataset(id);
    toast({
      title: "Dataset removed",
      description: "Dataset has been removed from all modules",
    });
  };

  const handleSelectDataset = (dataset: any) => {
    setCurrentDataset(dataset);
    toast({
      title: "Dataset selected",
      description: `Now using ${dataset.name} across all modules`,
    });
    setIsOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Upload className="h-4 w-4" />
      Data Upload Hub
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Upload Hub
          </DialogTitle>
          <DialogDescription>
            Upload datasets once and use them across all analysis modules. Supports CSV, XLSX, and JSON files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload New Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                onFilesSelected={handleFilesSelected}
                acceptedTypes={['csv', 'xlsx', 'json']}
                maxFiles={5}
                maxSizeMB={50}
                className="mb-4"
              />
              {isUploading && (
                <div className="text-center text-muted-foreground">
                  <Upload className="h-8 w-8 animate-pulse mx-auto mb-2" />
                  Processing files...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Datasets */}
          {datasets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {datasets.map((dataset) => (
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
                          onClick={() => handleSelectDataset(dataset)}
                          disabled={currentDataset?.id === dataset.id}
                        >
                          {currentDataset?.id === dataset.id ? 'Selected' : 'Select'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDataset(dataset.id)}
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
          )}

          {/* Usage Instructions */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Upload datasets here once and they'll be available across all analysis modules</li>
                <li>• Files are automatically routed to EDA Explorer, Auto Analysis, Strategy Scanner, and other modules</li>
                <li>• Switch active datasets anytime by selecting a different one from the list above</li>
                <li>• View upload history and module usage from this central hub</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploadHub;

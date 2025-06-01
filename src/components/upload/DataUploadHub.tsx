
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Database, Clock, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface UploadedDataset {
  id: string;
  name: string;
  uploadedAt: Date;
  fileType: string;
  size: number;
  usedBy: string[];
  status: "processing" | "ready" | "error";
}

interface DataUploadHubProps {
  trigger?: React.ReactNode;
  onDatasetUploaded?: (dataset: UploadedDataset) => void;
}

const DataUploadHub: React.FC<DataUploadHubProps> = ({ 
  trigger, 
  onDatasetUploaded 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [datasets, setDatasets] = useState<UploadedDataset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Process each file
      for (const file of files) {
        const newDataset: UploadedDataset = {
          id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          uploadedAt: new Date(),
          fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: file.size,
          usedBy: ['EDA Explorer', 'Auto Analysis'], // Auto-assign to common modules
          status: 'processing'
        };

        setDatasets(prev => [...prev, newDataset]);

        // Simulate processing
        setTimeout(() => {
          setDatasets(prev => 
            prev.map(d => 
              d.id === newDataset.id 
                ? { ...d, status: 'ready' as const }
                : d
            )
          );
        }, 2000);

        onDatasetUploaded?.(newDataset);
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

  const removeDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Dataset removed",
      description: "Dataset has been removed from all modules",
    });
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
                <CardTitle className="text-lg">Current Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {datasets.map((dataset) => (
                    <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                        <div className="flex flex-wrap gap-1">
                          {dataset.usedBy.map((module) => (
                            <Badge key={module} variant="secondary" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDataset(dataset.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
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
                <li>• Files are automatically routed to EDA Explorer, Auto Analysis, and other relevant modules</li>
                <li>• Switch datasets anytime using the "Switch Dataset" button in each module</li>
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

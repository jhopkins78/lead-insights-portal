
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Upload } from "lucide-react";

interface UploadSectionProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onFilesSelected,
  isUploading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload New Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUploader
          onFilesSelected={onFilesSelected}
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
  );
};

export default UploadSection;

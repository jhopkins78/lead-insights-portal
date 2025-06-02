
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import DataUploadDialogContent from "./DataUploadDialogContent";

interface DataUploadHubProps {
  trigger?: React.ReactNode;
}

const DataUploadHub: React.FC<DataUploadHubProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <DataUploadDialogContent onClose={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default DataUploadHub;


import React from "react";
import { Button } from "../button";
import { getFileIcon } from "./utils";
import { FileItemProps } from "./types";

const FileItem: React.FC<FileItemProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
      <div className="flex items-center gap-2">
        {getFileIcon(file.name)}
        <span className="text-sm truncate max-w-[250px]" title={file.name}>
          {file.name}
        </span>
        <span className="text-xs text-muted-foreground">
          ({(file.size / 1024 / 1024).toFixed(2)}MB)
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
      >
        Remove
      </Button>
    </div>
  );
};

export default FileItem;

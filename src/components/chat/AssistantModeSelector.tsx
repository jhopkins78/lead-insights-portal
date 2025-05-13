
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export type AssistantMode = "sales" | "analyst";

interface AssistantModeSelectorProps {
  assistantMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
}

const AssistantModeSelector: React.FC<AssistantModeSelectorProps> = ({ assistantMode, onModeChange }) => {
  const getAssistantModeLabel = () => {
    return assistantMode === "sales" ? "Sales Coach" : "Data Analyst";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BadgeIcon className="h-4 w-4" />
          <Badge className={cn(
            "font-normal",
            assistantMode === "sales" ? "bg-insight-500" : "bg-blue-500"
          )}>
            Assistant Mode: {getAssistantModeLabel()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onModeChange("sales")}>
          <span className={cn(
            "w-2 h-2 rounded-full mr-2", 
            assistantMode === "sales" ? "bg-insight-500" : "bg-muted"
          )}></span>
          Sales Coach
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("analyst")}>
          <span className={cn(
            "w-2 h-2 rounded-full mr-2", 
            assistantMode === "analyst" ? "bg-blue-500" : "bg-muted"
          )}></span>
          Data Analyst
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssistantModeSelector;

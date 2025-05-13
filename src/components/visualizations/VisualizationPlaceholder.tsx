
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart2, 
  LineChart, 
  ScatterChart, 
  Table,
  BarChart as BarChartIcon,
  CircleOff
} from "lucide-react";

interface VisualizationPlaceholderProps {
  type: 'histogram' | 'boxplot' | 'heatmap' | 'scatter' | 'bar' | 'line';
  title: string;
}

const VisualizationPlaceholder: React.FC<VisualizationPlaceholderProps> = ({ 
  type, 
  title 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'histogram':
      case 'bar':
        return <BarChart2 className="h-12 w-12 text-muted-foreground" />;
      case 'line':
        return <LineChart className="h-12 w-12 text-muted-foreground" />;
      case 'scatter':
        return <ScatterChart className="h-12 w-12 text-muted-foreground" />;
      case 'heatmap':
        return <Table className="h-12 w-12 text-muted-foreground" />;
      case 'boxplot':
        return <BarChartIcon className="h-12 w-12 text-muted-foreground" />;
      default:
        return <CircleOff className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-[300px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center flex-col gap-2 bg-muted/20">
        {getIcon()}
        <p className="text-sm text-muted-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1)} visualization will appear here
        </p>
        <p className="text-xs text-muted-foreground">
          (Upload data to generate visualization)
        </p>
      </CardContent>
    </Card>
  );
};

export default VisualizationPlaceholder;

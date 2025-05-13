
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPreviewProps {
  data: Array<Record<string, any>> | null;
  maxRows?: number;
}

const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  maxRows = 10 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Get column headers from the first row
  const columns = Object.keys(data[0]);
  
  // Limit to displaying only first `maxRows` rows
  const displayData = data.slice(0, maxRows);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dataset Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {typeof row[column] === 'object' 
                        ? JSON.stringify(row[column]) 
                        : String(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;

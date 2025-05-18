
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Lead } from "@/components/coaching/types";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  sortField: keyof Lead;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof Lead) => void;
  handleRowClick: (lead: Lead) => void;
  handleViewPrediction: (e: React.MouseEvent, lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  handleRowClick,
  handleViewPrediction,
}) => {
  // Render sort icon
  const renderSortIcon = (field: keyof Lead) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              onClick={() => handleSort('name')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center">
                Name {renderSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('title')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center">
                Title {renderSortIcon('title')}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('company')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center">
                Company {renderSortIcon('company')}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('email')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center">
                Email {renderSortIcon('email')}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('intent')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center">
                Intent {renderSortIcon('intent')}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('score')}
              className="cursor-pointer hover:bg-muted/50 text-right"
            >
              <div className="flex items-center justify-end">
                Score {renderSortIcon('score')}
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">Loading leads...</TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">No leads match your filters</TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow 
                key={lead.id}
                onClick={() => handleRowClick(lead)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.title}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.intent}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span 
                    className={`font-medium ${
                      lead.score >= 80 ? 'text-green-600' : 
                      lead.score >= 60 ? 'text-amber-600' : 
                      'text-red-600'
                    }`}
                  >
                    {lead.score}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleViewPrediction(e, lead)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;

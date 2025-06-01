
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface AnalysisReportProps {
  report: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  return (
    <Collapsible className="mt-6 border rounded-md overflow-hidden">
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
        <h3 className="text-lg">Analysis Report</h3>
        <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 border-t prose max-w-none">
          <pre className="whitespace-pre-wrap overflow-auto max-h-[500px] p-4 bg-gray-50 rounded text-sm text-left">
            {report}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalysisReport;

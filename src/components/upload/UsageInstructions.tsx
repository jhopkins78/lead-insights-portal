
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const UsageInstructions: React.FC = () => {
  return (
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
  );
};

export default UsageInstructions;

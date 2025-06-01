
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FutureFeatures: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="future-features">
        <AccordionTrigger>Future Features</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-muted-foreground">
            <p>• Model Metrics Tab - Compare RMSE, MAE, R² across models</p>
            <p>• Transformation Preview Tab - Before/after data state visualization</p>
            <p>• Report Download Button - With versioning and timestamping</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FutureFeatures;

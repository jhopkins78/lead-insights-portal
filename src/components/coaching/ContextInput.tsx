
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ContextInput: React.FC<ContextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Scenario/Context
      </label>
      <Textarea
        placeholder="E.g., how to best pitch this person, how to handle objections, etc."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  );
};

export default ContextInput;

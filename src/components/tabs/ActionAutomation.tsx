
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { PlayCircle } from "lucide-react";

interface AutomationFormData {
  lead_id: string;
  action_type: string;
  parameters: string;
}

interface AutomationResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

const automationTypes = [
  { value: "send_email", label: "Send Email", example: '{"template": "follow_up", "subject": "Following up on our conversation"}' },
  { value: "assign_to_sales", label: "Assign to Sales", example: '{"sales_rep_id": "SR123", "priority": "high"}' },
  { value: "trigger_followup", label: "Trigger Followup", example: '{"delay_days": 3, "channel": "phone"}' },
  { value: "update_status", label: "Update Status", example: '{"new_status": "qualified", "reason": "Budget confirmed"}' },
  { value: "add_to_campaign", label: "Add to Campaign", example: '{"campaign_id": "CAM456", "sequence": "nurture"}' },
];

const ActionAutomation = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AutomationResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const form = useForm<AutomationFormData>({
    defaultValues: {
      lead_id: "",
      action_type: "",
      parameters: "",
    },
  });

  const handleSelectAutomationType = (value: string) => {
    const selectedType = automationTypes.find(type => type.value === value);
    form.setValue("action_type", value);
    
    if (selectedType) {
      form.setValue("parameters", selectedType.example);
    }
  };

  const addLog = (message: string, success: boolean) => {
    const timestamp = new Date().toISOString();
    const formattedLog = `[${timestamp}] ${success ? "✅" : "❌"} ${message}`;
    setLogs(prev => [formattedLog, ...prev]);
  };

  const onSubmit = async (data: AutomationFormData) => {
    setIsLoading(true);
    try {
      // Validate that parameters is valid JSON
      try {
        JSON.parse(data.parameters);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "The parameters field must contain valid JSON",
          variant: "destructive",
        });
        addLog("Failed to run automation: Invalid JSON parameters", false);
        setIsLoading(false);
        return;
      }

      // Make API request
      const response = await fetch("/automate_actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResponse({
        ...result,
        timestamp: new Date().toISOString(),
      });
      
      addLog(`Successfully ran ${data.action_type} automation for lead ${data.lead_id}`, true);
      
      toast({
        title: "Automation executed",
        description: `Successfully ran ${data.action_type} automation`,
      });
    } catch (error) {
      console.error("Error running automation:", error);
      
      setResponse({
        success: false,
        message: error instanceof Error ? error.message : "Failed to run automation",
        timestamp: new Date().toISOString(),
      });
      
      addLog(`Failed to run automation: ${error instanceof Error ? error.message : "Unknown error"}`, false);
      
      toast({
        title: "Automation failed",
        description: "Failed to run the automation. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Action Automation</CardTitle>
            <CardDescription>
              Configure and execute automated actions for your leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="lead_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lead identifier" {...field} />
                      </FormControl>
                      <FormDescription>
                        The unique identifier for the target lead
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Action Type</FormLabel>
                  <Select onValueChange={handleSelectAutomationType}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an automation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {automationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of automation to execute
                  </FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="parameters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parameters (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{}'
                          className="font-mono h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Configuration parameters in JSON format
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {isLoading ? "Running..." : "Run Automation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col space-y-6 flex-1">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Result Console</CardTitle>
              <CardDescription>
                API response from the automation execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto h-40">
                {response ? (
                  <pre className={response.success ? "text-green-500" : "text-red-500"}>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground">No results yet. Run an automation to see the response.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>
                History of automation execution attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-auto h-40 space-y-1">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="border-b border-border pb-1 last:border-0">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No logs yet. Run an automation to see the execution history.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActionAutomation;

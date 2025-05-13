import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Play, Loader2, HelpCircle, Check, History, Database, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Model info for tooltips
const MODEL_INFO = {
  linear: "Best for simple relationships with few features. Fast and interpretable.",
  ridge: "Linear regression with L2 regularization. Good for when features are correlated.",
  lasso: "Linear regression with L1 regularization. Performs feature selection.",
  knn: "Makes predictions based on similar training examples. Good for non-linear data.",
  decision_tree: "Simple tree-based model. Easily interpretable but prone to overfitting.",
  random_forest: "Ensemble of decision trees. More robust than single trees.",
  xgboost: "Gradient boosting implementation. Often wins ML competitions.",
  svr: "Support Vector Regressor. Good for high-dimensional spaces.",
  gradient_boosting: "Ensemble method that combines weak learners sequentially.",
  optimal: "Automatically selects the best model based on cross-validation performance."
};

// Hyperparameter configurations by model type
const MODEL_HYPERPARAMS = {
  linear: [],
  ridge: [
    { name: "alpha", label: "Alpha", type: "slider", min: 0.01, max: 10, step: 0.01, defaultValue: 1 }
  ],
  lasso: [
    { name: "alpha", label: "Alpha", type: "slider", min: 0.01, max: 1, step: 0.01, defaultValue: 0.1 }
  ],
  knn: [
    { name: "n_neighbors", label: "Number of Neighbors", type: "slider", min: 1, max: 20, step: 1, defaultValue: 5 },
    { name: "weights", label: "Weight Function", type: "select", options: ["uniform", "distance"], defaultValue: "uniform" }
  ],
  decision_tree: [
    { name: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 20, step: 1, defaultValue: 5 },
    { name: "min_samples_split", label: "Min Samples Split", type: "slider", min: 2, max: 20, step: 1, defaultValue: 2 }
  ],
  random_forest: [
    { name: "n_estimators", label: "Number of Trees", type: "slider", min: 10, max: 200, step: 10, defaultValue: 100 },
    { name: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 20, step: 1, defaultValue: 5 }
  ],
  xgboost: [
    { name: "n_estimators", label: "Number of Trees", type: "slider", min: 10, max: 200, step: 10, defaultValue: 100 },
    { name: "learning_rate", label: "Learning Rate", type: "slider", min: 0.01, max: 0.3, step: 0.01, defaultValue: 0.1 },
    { name: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 10, step: 1, defaultValue: 3 }
  ],
  svr: [
    { name: "C", label: "Regularization Parameter", type: "slider", min: 0.1, max: 10, step: 0.1, defaultValue: 1 },
    { name: "kernel", label: "Kernel", type: "select", options: ["linear", "poly", "rbf", "sigmoid"], defaultValue: "rbf" }
  ],
  gradient_boosting: [
    { name: "n_estimators", label: "Number of Trees", type: "slider", min: 10, max: 200, step: 10, defaultValue: 100 },
    { name: "learning_rate", label: "Learning Rate", type: "slider", min: 0.01, max: 0.3, step: 0.01, defaultValue: 0.1 },
    { name: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 10, step: 1, defaultValue: 3 }
  ],
  optimal: []
};

interface ModelParams {
  [key: string]: number | string;
}

interface ModelHistoryEntry {
  id: string;
  timestamp: Date;
  modelType: string;
  hyperParams: ModelParams;
  metrics: {
    r2_score: number;
    rmse: number;
    mae: number;
  };
}

const ModelBuilder: React.FC = () => {
  const [modelType, setModelType] = useState<string>("linear");
  const [testSplit, setTestSplit] = useState<number[]>([0.3]);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [modelTrained, setModelTrained] = useState<boolean>(false);
  const [targetVariable, setTargetVariable] = useState<string>("");
  const [configMode, setConfigMode] = useState<string>("default");
  const [hyperParams, setHyperParams] = useState<ModelParams>({});
  const [modelHistory, setModelHistory] = useState<ModelHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>("builder");
  
  const { toast } = useToast();
  
  const form = useForm<ModelParams>({
    defaultValues: {}
  });

  // Update hyperparameters when model changes
  const handleModelChange = (value: string) => {
    setModelType(value);
    
    // Reset hyperparameters to defaults for new model
    const defaultParams: ModelParams = {};
    MODEL_HYPERPARAMS[value as keyof typeof MODEL_HYPERPARAMS]?.forEach(param => {
      defaultParams[param.name] = param.defaultValue;
    });
    
    setHyperParams(defaultParams);
    form.reset(defaultParams);
  };

  // Handle hyperparameter changes
  const handleParamChange = (name: string, value: number | string) => {
    setHyperParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrain = () => {
    if (!targetVariable) {
      toast({
        title: "Missing information",
        description: "Please specify a target variable",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    
    // In a real implementation, you would send the model configuration to the backend
    const modelConfig = {
      model_type: modelType,
      target_variable: targetVariable,
      test_split: testSplit[0],
      hyperparameters: configMode === "custom" ? hyperParams : "default"
    };
    
    console.log("Training model with config:", modelConfig);
    
    // Simulate API call and training process
    setTimeout(() => {
      setIsTraining(false);
      setModelTrained(true);
      
      // Generate mock metrics based on the model type
      const mockMetrics = {
        r2_score: Math.random() * 0.3 + 0.7, // Random R² between 0.7 and 1.0
        rmse: Math.random() * 0.5 + 0.2,     // Random RMSE between 0.2 and 0.7
        mae: Math.random() * 0.3 + 0.1       // Random MAE between 0.1 and 0.4
      };
      
      // Add to model history
      const historyEntry: ModelHistoryEntry = {
        id: `run-${Date.now()}`,
        timestamp: new Date(),
        modelType: modelType,
        hyperParams: configMode === "custom" ? {...hyperParams} : {},
        metrics: mockMetrics
      };
      
      setModelHistory(prev => [historyEntry, ...prev]);
      
      toast({
        title: "Model training complete",
        description: `${getModelDisplayName(modelType)} model trained successfully. View results in Model Metrics tab.`,
      });
    }, 3000);
  };

  const getModelDisplayName = (modelKey: string): string => {
    const modelNames: {[key: string]: string} = {
      linear: "Linear Regression",
      ridge: "Ridge Regression",
      lasso: "Lasso Regression",
      knn: "K-Nearest Neighbors",
      decision_tree: "Decision Tree",
      random_forest: "Random Forest",
      xgboost: "XGBoost",
      svr: "Support Vector Regressor",
      gradient_boosting: "Gradient Boosting",
      optimal: "Optimal Model"
    };
    
    return modelNames[modelKey] || modelKey;
  };

  const handleRerunModel = (entry: ModelHistoryEntry) => {
    setModelType(entry.modelType);
    
    if (Object.keys(entry.hyperParams).length > 0) {
      setConfigMode("custom");
      setHyperParams(entry.hyperParams);
    } else {
      setConfigMode("default");
      
      // Reset hyperparameters to defaults for this model
      const defaultParams: ModelParams = {};
      MODEL_HYPERPARAMS[entry.modelType as keyof typeof MODEL_HYPERPARAMS]?.forEach(param => {
        defaultParams[param.name] = param.defaultValue;
      });
      setHyperParams(defaultParams);
    }
    
    setActiveTab("builder");
    
    toast({
      title: "Configuration loaded",
      description: `${getModelDisplayName(entry.modelType)} settings have been loaded. Ready to train.`,
    });
  };

  const handleSaveToReport = (entry: ModelHistoryEntry) => {
    toast({
      title: "Added to report",
      description: `${getModelDisplayName(entry.modelType)} results have been added to the report.`,
    });
  };

  const exportHistory = (format: 'csv' | 'json') => {
    if (modelHistory.length === 0) {
      toast({
        title: "Nothing to export",
        description: "No model history entries to export.",
        variant: "destructive",
      });
      return;
    }
    
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'json') {
      content = JSON.stringify(modelHistory, null, 2);
      filename = "model-history.json";
      mimeType = "application/json";
    } else {
      // Create CSV headers
      const headers = "Timestamp,Model Type,R2 Score,RMSE,MAE,Hyperparameters\n";
      
      // Create CSV rows
      const rows = modelHistory.map(entry => {
        const timestamp = entry.timestamp.toISOString();
        const modelType = getModelDisplayName(entry.modelType);
        const r2Score = entry.metrics.r2_score.toFixed(4);
        const rmse = entry.metrics.rmse.toFixed(4);
        const mae = entry.metrics.mae.toFixed(4);
        const hyperParams = JSON.stringify(entry.hyperParams);
        
        return `${timestamp},${modelType},${r2Score},${rmse},${mae},${hyperParams}`;
      }).join("\n");
      
      content = headers + rows;
      filename = "model-history.csv";
      mimeType = "text/csv";
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `Model history exported as ${format.toUpperCase()}.`,
    });
  };
  
  // Render hyperparameter inputs based on model selection and configuration mode
  const renderHyperParameters = () => {
    if (configMode === "default" || !MODEL_HYPERPARAMS[modelType as keyof typeof MODEL_HYPERPARAMS]?.length) {
      return (
        <div className="text-sm text-muted-foreground italic">
          Using default hyperparameters for {getModelDisplayName(modelType)}.
        </div>
      );
    }
    
    return MODEL_HYPERPARAMS[modelType as keyof typeof MODEL_HYPERPARAMS]?.map((param) => (
      <div key={param.name} className="space-y-3">
        <Label htmlFor={param.name}>{param.label}</Label>
        
        {param.type === "slider" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>{param.min}</span>
              <span className="font-medium">
                {hyperParams[param.name] !== undefined ? hyperParams[param.name] : param.defaultValue}
              </span>
              <span>{param.max}</span>
            </div>
            <Slider
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              value={[hyperParams[param.name] as number || param.defaultValue]}
              onValueChange={(value) => handleParamChange(param.name, value[0])}
            />
          </div>
        )}
        
        {param.type === "select" && (
          <Select 
            value={hyperParams[param.name] as string || param.defaultValue} 
            onValueChange={(value) => handleParamChange(param.name, value)}
          >
            <SelectTrigger id={param.name}>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    ));
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Model Builder</h2>
        <p className="text-muted-foreground mb-6">
          Create and train predictive models using your data
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">
            <Settings className="h-4 w-4 mr-2" />
            Model Builder
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Model History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Basic Configuration</span>
              </CardTitle>
              <CardDescription>
                Select target variable and set training parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="target-var">Target Variable</Label>
                  <Input 
                    id="target-var" 
                    placeholder="e.g., revenue, conversion" 
                    value={targetVariable}
                    onChange={(e) => setTargetVariable(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Test Split Ratio: {testSplit[0] * 100}%</Label>
                  </div>
                  <Slider
                    defaultValue={[0.3]}
                    max={0.5}
                    step={0.05}
                    value={testSplit}
                    onValueChange={setTestSplit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Model Configuration</span>
              </CardTitle>
              <CardDescription>
                Select model type and configure hyperparameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="model-type">Model Type</Label>
                  <div className="flex items-center">
                    <Select value={modelType} onValueChange={handleModelChange}>
                      <SelectTrigger id="model-type" className="w-full">
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear Regression</SelectItem>
                        <SelectItem value="ridge">Ridge Regression</SelectItem>
                        <SelectItem value="lasso">Lasso Regression</SelectItem>
                        <SelectItem value="knn">K-Nearest Neighbors</SelectItem>
                        <SelectItem value="decision_tree">Decision Tree</SelectItem>
                        <SelectItem value="random_forest">Random Forest</SelectItem>
                        <SelectItem value="xgboost">XGBoost</SelectItem>
                        <SelectItem value="svr">Support Vector Regressor</SelectItem>
                        <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
                        <SelectItem value="optimal">Optimal Model (Auto-select)</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2 px-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs" side="right">
                          <p>{MODEL_INFO[modelType as keyof typeof MODEL_INFO] || "No information available"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="block mb-2">Configuration Mode</Label>
                  <RadioGroup
                    value={configMode}
                    onValueChange={setConfigMode}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="default-config" />
                      <Label htmlFor="default-config">Default Settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom-config" />
                      <Label htmlFor="custom-config">Custom Configuration</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className={`space-y-4 pt-2 ${configMode === "default" ? "opacity-70" : ""}`}>
                  {renderHyperParameters()}
                </div>

                <Button 
                  onClick={handleTrain} 
                  disabled={isTraining}
                  className="w-full md:w-auto bg-insight-500 hover:bg-insight-600"
                >
                  {isTraining ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Training Model...</span>
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      <span>Train Model</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {modelTrained && (
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="text-green-700">Model Training Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your {getModelDisplayName(modelType)} model has been successfully trained.
                </p>
                <p className="text-muted-foreground mb-2">
                  Training data: {Math.round((1 - testSplit[0]) * 100)}% • Test data: {Math.round(testSplit[0] * 100)}%
                </p>
                <p>Check the Model Evaluator tab to see detailed performance metrics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <span>Model Training History</span>
              </CardTitle>
              <CardDescription>
                A log of all model training runs and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modelHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No models have been trained yet.</p>
                  <p className="text-sm mt-2">
                    Train your first model using the Model Builder tab.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[450px] pr-4">
                  <div className="space-y-4">
                    {modelHistory.map((entry) => (
                      <Card key={entry.id} className="bg-card/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {getModelDisplayName(entry.modelType)}
                                {entry === modelHistory[0] && (
                                  <Badge className="ml-2 bg-blue-500">Latest</Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {formatDate(entry.timestamp)}
                              </CardDescription>
                            </div>
                            <Badge variant={
                              entry.metrics.r2_score > 0.85 ? "default" : 
                              entry.metrics.r2_score > 0.7 ? "secondary" : "outline"
                            }>
                              R² {entry.metrics.r2_score.toFixed(3)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">RMSE</p>
                              <p className="font-mono">{entry.metrics.rmse.toFixed(4)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">MAE</p>
                              <p className="font-mono">{entry.metrics.mae.toFixed(4)}</p>
                            </div>
                            
                            {Object.keys(entry.hyperParams).length > 0 && (
                              <div className="col-span-2 mt-2">
                                <p className="text-xs text-muted-foreground mb-1">Hyperparameters</p>
                                <div className="text-xs flex flex-wrap gap-2">
                                  {Object.entries(entry.hyperParams).map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-[10px] py-0">
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRerunModel(entry)}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Re-run
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSaveToReport(entry)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Save to Report
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t bg-muted/50 p-4">
              <div className="text-sm text-muted-foreground">
                {modelHistory.length} model training runs
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportHistory('csv')}
                  disabled={modelHistory.length === 0}
                >
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportHistory('json')}
                  disabled={modelHistory.length === 0}
                >
                  Export JSON
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelBuilder;

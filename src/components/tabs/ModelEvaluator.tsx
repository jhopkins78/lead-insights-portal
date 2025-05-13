
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";

// Dummy data for demonstration
const metrics = {
  linearRegression: { 
    r2: 0.78, 
    rmse: 12.3, 
    mae: 8.7 
  },
  knnRegression: { 
    r2: 0.72, 
    rmse: 14.1, 
    mae: 9.2 
  }
};

const performanceData = [
  { name: "Linear", r2: 0.78, rmse: 12.3, mae: 8.7 },
  { name: "Ridge", r2: 0.76, rmse: 12.8, mae: 8.9 },
  { name: "Lasso", r2: 0.75, rmse: 13.0, mae: 9.0 },
  { name: "KNN", r2: 0.72, rmse: 14.1, mae: 9.2 },
  { name: "Decision Tree", r2: 0.68, rmse: 15.2, mae: 10.1 },
];

const scatterData = [
  { actual: 15, predicted: 17, feature: 'A' },
  { actual: 28, predicted: 26, feature: 'B' },
  { actual: 42, predicted: 44, feature: 'C' },
  { actual: 33, predicted: 32, feature: 'D' },
  { actual: 55, predicted: 52, feature: 'E' },
  { actual: 72, predicted: 75, feature: 'F' },
  { actual: 85, predicted: 82, feature: 'G' },
  { actual: 64, predicted: 63, feature: 'H' },
];

const ModelEvaluator: React.FC = () => {
  const [selectedModel, setSelectedModel] = React.useState<string>("linear");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">Model Evaluator</h2>
        <p className="text-muted-foreground mb-6">
          Evaluate and compare the performance of your trained models
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">R² Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {metrics.linearRegression.r2.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Coefficient of determination</p>
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">Good</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RMSE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {metrics.linearRegression.rmse.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Root Mean Squared Error</p>
              </div>
              <div className="flex items-center text-amber-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">Average</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MAE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {metrics.linearRegression.mae.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Mean Absolute Error</p>
              </div>
              <div className="flex items-center text-amber-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">Average</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="comparison" className="flex gap-2 items-center">
            <TrendingUp className="h-4 w-4" />
            <span>Model Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span>Predictions Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex gap-2 items-center">
            <BarChart className="h-4 w-4" />
            <span>Feature Importance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="r2" fill="#3b82f6" name="R² Score" />
                    <Bar dataKey="rmse" fill="#ef4444" name="RMSE" />
                    <Bar dataKey="mae" fill="#f59e0b" name="MAE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Actual vs Predicted Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={scatterData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual" dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="predicted" stroke="#10b981" name="Predicted" dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { feature: "Feature A", importance: 0.32 },
                      { feature: "Feature B", importance: 0.28 },
                      { feature: "Feature C", importance: 0.21 },
                      { feature: "Feature D", importance: 0.12 },
                      { feature: "Feature E", importance: 0.07 },
                    ]}
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="feature" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="importance" fill="#3b82f6" name="Importance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelEvaluator;

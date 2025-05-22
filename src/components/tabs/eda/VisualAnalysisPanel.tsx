import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  BarChart2,
  LineChart,
  Grid
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface VisualAnalysisPanelProps {
  data: any;
}

const VisualAnalysisPanel: React.FC<VisualAnalysisPanelProps> = ({ data }) => {
  // If no visualization data is available
  if (!data || !data.correlation_matrix || !data.categorical_counts || !data.time_series) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">No visualization data is available for this dataset.</p>
      </div>
    );
  }

  // Transform correlation matrix data for the heatmap
  const correlationData = data.correlation_matrix.variables.map((variable: string, i: number) => {
    const result: Record<string, any> = { name: variable };
    data.correlation_matrix.variables.forEach((v: string, j: number) => {
      result[v] = data.correlation_matrix.values[i][j];
    });
    return result;
  });

  // Get categorical data for bar charts
  const categoryData = Object.entries(data.categorical_counts).map(([key, value]: [string, any]) => ({
    name: key,
    labels: value.labels,
    values: value.values
  }));

  // Transform for selected category
  const transformCategoryData = (category: any) => {
    return category.labels.map((label: string, index: number) => ({
      name: label,
      value: category.values[index]
    }));
  };

  const barChartData = categoryData.length > 0 ? transformCategoryData(categoryData[0][1]) : [];

  // Create time series data
  const timeSeriesData = data.time_series.dates.map((date: string, i: number) => ({
    date,
    sales: data.time_series.sales[i],
    growth: data.time_series.growth[i]
  }));

  // Helper function to get color based on correlation value
  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return "#047857"; // Strong positive - emerald-700
    if (value >= 0.4) return "#10B981"; // Moderate positive - emerald-500
    if (value >= 0.2) return "#6EE7B7"; // Weak positive - emerald-300
    if (value > -0.2) return "#D1D5DB"; // Negligible - gray-300
    if (value > -0.4) return "#FCA5A5"; // Weak negative - rose-300
    if (value > -0.7) return "#F87171"; // Moderate negative - rose-400
    return "#EF4444"; // Strong negative - rose-600
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="distribution" className="flex gap-2 items-center">
            <BarChart className="h-4 w-4" />
            <span>Category Distribution</span>
          </TabsTrigger>
          <TabsTrigger value="timeseries" className="flex gap-2 items-center">
            <LineChart className="h-4 w-4" />
            <span>Time Series</span>
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex gap-2 items-center">
            <Grid className="h-4 w-4" />
            <span>Correlation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Category Distribution</span>
                <Badge variant="outline">Top Categories</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#6366F1" name="Count" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeseries">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Sales & Growth Trends</span>
                <Badge variant="outline">Quarterly Data</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      name="Sales"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      stroke="#82ca9d"
                      name="Growth %"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Correlation Matrix</span>
                <Badge variant="outline">Variable Relationships</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border"></th>
                      {data.correlation_matrix.variables.map((variable: string, i: number) => (
                        <th key={i} className="p-2 border text-sm whitespace-nowrap">
                          {variable}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {correlationData.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 border font-medium text-sm whitespace-nowrap">{row.name}</td>
                        {data.correlation_matrix.variables.map((variable: string, j: number) => (
                          <td
                            key={j}
                            className="p-2 border text-center"
                            style={{ backgroundColor: getCorrelationColor(row[variable]) }}
                          >
                            {row[variable].toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualAnalysisPanel;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Target } from "lucide-react";

interface ForecastValue {
  period: string;
  value: number;
}

interface ForecastVisualizerProps {
  forecastTarget: string;
  forecastValues: ForecastValue[];
  method: string;
  summary: string;
}

const ForecastVisualizer: React.FC<ForecastVisualizerProps> = ({
  forecastTarget,
  forecastValues,
  method,
  summary,
}) => {
  const chartConfig = {
    value: {
      label: forecastTarget,
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Forecast Summary</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{summary}</div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Target className="mr-1 h-4 w-4" />
              Target: {forecastTarget}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Method: {method}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastValues}>
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Forecast Values Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {forecastValues.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{item.period}</span>
                <span className="text-lg font-bold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastVisualizer;

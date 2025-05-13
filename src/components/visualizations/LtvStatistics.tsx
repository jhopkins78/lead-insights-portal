
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const distributionData = [
  { value: 5000, frequency: 10 },
  { value: 10000, frequency: 25 },
  { value: 15000, frequency: 45 },
  { value: 20000, frequency: 35 },
  { value: 25000, frequency: 20 },
  { value: 30000, frequency: 12 },
  { value: 35000, frequency: 8 },
  { value: 40000, frequency: 5 },
];

const lifetimeValues = [
  { name: "SaaS", ltv: 28000, retention: 85 },
  { name: "E-commerce", ltv: 12000, retention: 45 },
  { name: "Consulting", ltv: 35000, retention: 70 },
  { name: "Agency", ltv: 22000, retention: 65 },
  { name: "Manufacturing", ltv: 18000, retention: 60 },
];

const heatMapData = [
  { purchase: 1, churn: 50, value: 5000 },
  { purchase: 1, churn: 40, value: 7500 },
  { purchase: 1, churn: 30, value: 10000 },
  { purchase: 1, churn: 20, value: 12500 },
  { purchase: 1, churn: 10, value: 15000 },
  { purchase: 2, churn: 50, value: 8000 },
  { purchase: 2, churn: 40, value: 12000 },
  { purchase: 2, churn: 30, value: 16000 },
  { purchase: 2, churn: 20, value: 20000 },
  { purchase: 2, churn: 10, value: 24000 },
  { purchase: 3, churn: 50, value: 10000 },
  { purchase: 3, churn: 40, value: 15000 },
  { purchase: 3, churn: 30, value: 20000 },
  { purchase: 3, churn: 20, value: 25000 },
  { purchase: 3, churn: 10, value: 30000 },
  { purchase: 4, churn: 50, value: 12000 },
  { purchase: 4, churn: 40, value: 18000 },
  { purchase: 4, churn: 30, value: 24000 },
  { purchase: 4, churn: 20, value: 30000 },
  { purchase: 4, churn: 10, value: 36000 },
  { purchase: 5, churn: 50, value: 15000 },
  { purchase: 5, churn: 40, value: 22500 },
  { purchase: 5, churn: 30, value: 30000 },
  { purchase: 5, churn: 20, value: 37500 },
  { purchase: 5, churn: 10, value: 45000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const HeatMapColors = [
  "#E5DEFF",
  "#D6BCFA",
  "#9b87f5",
  "#7E69AB",
  "#6E59A5"
];

const getHeatMapColor = (value: number) => {
  const min = 5000;
  const max = 45000;
  const normalizedValue = (value - min) / (max - min);
  const colorIndex = Math.min(
    Math.floor(normalizedValue * HeatMapColors.length),
    HeatMapColors.length - 1
  );
  return HeatMapColors[colorIndex];
};

const LtvStatistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">LTV Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distributionData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="value"
                  tickFormatter={(value) => `$${value/1000}k`}
                  label={{ value: 'Customer LTV Value', position: 'insideBottom', offset: -15 }}
                />
                <YAxis 
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'Count']}
                  labelFormatter={(label) => `$${label}`}
                />
                <Bar dataKey="frequency" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Industry Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lifetimeValues}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis dataKey="name" type="category" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'LTV']}
                />
                <Bar dataKey="ltv" fill="#7E69AB">
                  {lifetimeValues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#${Math.floor(6000 + (index * 1000)).toString(16)}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">LTV by Retention %</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lifetimeValues}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}%`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#E5DEFF" 
                  fill="#D6BCFA" 
                  yAxisId="left"
                />
                <Area 
                  type="monotone" 
                  dataKey="ltv" 
                  stroke="#6E59A5" 
                  fill="#9b87f5" 
                  yAxisId="right"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">LTV Heat Map (Purchase Frequency vs. Churn Rate)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={heatMapData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="purchase" 
                  label={{ value: 'Repeat Purchases', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="churn" 
                  label={{ value: 'Churn Rate %', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'LTV']}
                  labelFormatter={(label) => `Churn: ${label}%`}
                />
                <Bar dataKey="value">
                  {heatMapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getHeatMapColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LtvStatistics;

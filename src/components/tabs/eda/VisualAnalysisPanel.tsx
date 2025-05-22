
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface VisualAnalysisPanelProps {
  data: any;
}

const VisualAnalysisPanel: React.FC<VisualAnalysisPanelProps> = ({ data }) => {
  // Format categorical data for charts
  const formatCategoryData = (categoryKey: string) => {
    if (!data?.categorical_counts?.[categoryKey]) return [];
    
    const { labels, values } = data.categorical_counts[categoryKey];
    return labels.map((label: string, index: number) => ({
      name: label,
      value: values[index]
    }));
  };

  // Format time series data
  const formatTimeSeriesData = () => {
    if (!data?.time_series) return [];
    
    const { dates, sales, growth } = data.time_series;
    return dates.map((date: string, index: number) => ({
      name: date,
      sales: sales[index],
      growth: growth[index]
    }));
  };

  // Create heatmap data for correlation matrix
  const renderCorrelationMatrix = () => {
    if (!data?.correlation_matrix) return null;
    
    const { variables, values } = data.correlation_matrix;
    const cellSize = 60;
    const margin = 60;
    const width = variables.length * cellSize + margin;
    const height = variables.length * cellSize + margin;
    
    return (
      <div className="overflow-auto">
        <svg width={width} height={height}>
          {/* Y-axis labels */}
          {variables.map((variable: string, i: number) => (
            <text 
              key={`y-${i}`}
              x={margin - 10} 
              y={margin + i * cellSize + cellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="12"
            >
              {variable}
            </text>
          ))}
          
          {/* X-axis labels */}
          {variables.map((variable: string, i: number) => (
            <text 
              key={`x-${i}`}
              x={margin + i * cellSize + cellSize / 2} 
              y={margin - 10}
              textAnchor="middle"
              fontSize="12"
            >
              {variable}
            </text>
          ))}
          
          {/* Heatmap cells */}
          {values.map((row: number[], i: number) => 
            row.map((value: number, j: number) => {
              // Color scale from blue (negative) to white (0) to red (positive)
              const color = value < 0 
                ? `rgb(${Math.floor(255 * (1 - Math.abs(value)))}, ${Math.floor(255 * (1 - Math.abs(value)))}, 255)`
                : `rgb(255, ${Math.floor(255 * (1 - value))}, ${Math.floor(255 * (1 - value))})`;
              
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={margin + j * cellSize}
                    y={margin + i * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={color}
                    stroke="#ddd"
                  />
                  <text
                    x={margin + j * cellSize + cellSize / 2}
                    y={margin + i * cellSize + cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={Math.abs(value) > 0.7 ? "white" : "black"}
                    fontSize="12"
                  >
                    {value.toFixed(2)}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {data?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Records</div>
                <div className="text-2xl font-semibold">{data.summary.records.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Columns</div>
                <div className="text-2xl font-semibold">{data.summary.columns}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Missing Data</div>
                <div className="text-2xl font-semibold">{data.summary.missing_percentage}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Data Types</div>
                <div className="text-2xl font-semibold">
                  {Object.values(data.summary.data_types).reduce((a: number, b: number) => a + b, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.categorical_counts?.category && (
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatCategoryData('category')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.time_series && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Sales" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth %" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.correlation_matrix && (
        <Card>
          <CardHeader>
            <CardTitle>Correlation Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {renderCorrelationMatrix()}
          </CardContent>
        </Card>
      )}

      {data?.categorical_counts?.region && (
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatCategoryData('region')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualAnalysisPanel;

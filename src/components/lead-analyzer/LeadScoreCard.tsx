
import React from "react";
import { ChartBar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LeadAnalysisResponse } from "@/services/api";

interface LeadScoreCardProps {
  result: LeadAnalysisResponse;
}

const LeadScoreCard: React.FC<LeadScoreCardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-rose-600";
  };

  return (
    <Card className="border-t-4 border-t-insight-500 shadow-md lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Lead Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-muted">
            <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Score</span>
            <span>{result.score}/100</span>
          </div>
          <Progress value={result.score} className={getProgressColor(result.score)} />
        </div>
        {result.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadScoreCard;

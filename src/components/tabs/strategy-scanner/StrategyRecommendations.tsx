
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target } from 'lucide-react';

interface StrategyRecommendationsProps {
  recommendations: string[];
  datasetSummary: string;
}

const StrategyRecommendations: React.FC<StrategyRecommendationsProps> = ({
  recommendations,
  datasetSummary,
}) => {
  return (
    <div className="space-y-6">
      {/* Dataset Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-sm">
            {datasetSummary}
          </Badge>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-medium">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyRecommendations;

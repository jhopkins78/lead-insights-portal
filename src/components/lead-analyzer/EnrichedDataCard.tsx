
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadAnalysisResponse } from "@/services/api";

interface EnrichedDataCardProps {
  result: LeadAnalysisResponse;
}

const EnrichedDataCard: React.FC<EnrichedDataCardProps> = ({ result }) => {
  return (
    <Card className="border shadow-md lg:col-span-2">
      <CardHeader>
        <CardTitle>Enriched Lead Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {result.enriched_data?.company_info && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">COMPANY INFO</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(result.enriched_data?.company_info ?? {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                  <dd className="text-sm">{value ?? 'N/A'}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}

        {result.enriched_data?.contact_info && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">CONTACT INFO</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(result.enriched_data?.contact_info ?? {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                  <dd className="text-sm">
                    {key === 'linkedin' || key === 'twitter' ? (
                      <a href={value ?? '#'} className="text-insight-500 hover:underline" target="_blank" rel="noreferrer">{value ?? 'N/A'}</a>
                    ) : (
                      value ?? 'N/A'
                    )}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}

        {result.enriched_data?.engagement_history && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">ENGAGEMENT HISTORY</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(result.enriched_data?.engagement_history ?? {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="text-sm font-medium capitalize">{key.replace('_', ' ')}</dt>
                  <dd className="text-sm">
                    {Array.isArray(value) ? value.join(', ') : value ?? 'N/A'}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrichedDataCard;

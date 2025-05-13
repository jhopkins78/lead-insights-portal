
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, BarChart2, FileText } from "lucide-react";

const EdaExplorer: React.FC = () => {
  const [selectedView, setSelectedView] = useState("visual");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-insight-900 mb-2">EDA Explorer</h2>
        <p className="text-muted-foreground mb-6">
          Explore your data through visual and narrative exploratory data analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Exploratory Data Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="visual" className="flex gap-2 items-center">
                <BarChart2 className="h-4 w-4" />
                <span>Visual Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="narrative" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                <span>Narrative Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual">
              <div className="space-y-6">
                <div className="text-center p-12 border-2 border-dashed rounded-lg">
                  <BarChart2 className="h-16 w-16 mx-auto text-insight-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No data visualizations available</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and process data files to generate visualizations
                  </p>
                  <Button>Upload Data</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="narrative">
              <div className="prose max-w-none">
                <h3>Data Overview</h3>
                <p>No data has been processed yet. Upload and process data files to generate narrative EDA.</p>
                <p className="text-muted-foreground">
                  The narrative EDA will include data summaries, key insights, and recommendations.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EdaExplorer;

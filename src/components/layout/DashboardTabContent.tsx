
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import InsightGenerator from "@/components/tabs/InsightGenerator";
import LeadAnalyzer from "@/components/tabs/LeadAnalyzer";
import LtvEstimator from "@/components/tabs/LtvEstimator";
import AutoAnalysis from "@/components/tabs/AutoAnalysis";
import StrategyScanner from "@/components/tabs/StrategyScanner";
import PipelineOptimizer from "@/components/tabs/PipelineOptimizer";
import ModelMetrics from "@/components/tabs/ModelMetrics";
import AgentConsole from "@/components/tabs/AgentConsole";
import LeadExplorer from "@/components/tabs/LeadExplorer";
import ActionAutomation from "@/components/tabs/ActionAutomation";
import CoachingGenerator from "@/components/tabs/CoachingGenerator";
import DataUploader from "@/components/tabs/DataUploader";
import EdaExplorer from "@/components/tabs/EdaExplorer";
import ModelBuilder from "@/components/tabs/ModelBuilder";
import ModelEvaluator from "@/components/tabs/ModelEvaluator";
import ReportComposer from "@/components/tabs/ReportComposer";
import BusinessForecaster from "@/components/tabs/BusinessForecaster";
import ScenarioPlanner from "@/components/tabs/ScenarioPlanner";

const DashboardTabContent: React.FC = () => {
  return (
    <>
      <TabsContent value="insight" className="mt-0">
        <InsightGenerator />
      </TabsContent>
      <TabsContent value="lead" className="mt-0">
        <LeadAnalyzer />
      </TabsContent>
      <TabsContent value="explorer" className="mt-0">
        <LeadExplorer />
      </TabsContent>
      <TabsContent value="ltv" className="mt-0">
        <LtvEstimator />
      </TabsContent>
      <TabsContent value="auto" className="mt-0">
        <AutoAnalysis />
      </TabsContent>
      <TabsContent value="strategy" className="mt-0">
        <StrategyScanner />
      </TabsContent>
      <TabsContent value="pipeline" className="mt-0">
        <PipelineOptimizer />
      </TabsContent>
      <TabsContent value="metrics" className="mt-0">
        <ModelMetrics />
      </TabsContent>
      <TabsContent value="automation" className="mt-0">
        <ActionAutomation />
      </TabsContent>
      <TabsContent value="coaching" className="mt-0">
        <CoachingGenerator />
      </TabsContent>
      <TabsContent value="console" className="mt-0">
        <AgentConsole />
      </TabsContent>
      
      {/* Samaritan AI - Data Intelligence Suite Tab Contents */}
      <TabsContent value="uploader" className="mt-0">
        <DataUploader />
      </TabsContent>
      <TabsContent value="eda" className="mt-0">
        <EdaExplorer />
      </TabsContent>
      <TabsContent value="modelBuilder" className="mt-0">
        <ModelBuilder />
      </TabsContent>
      <TabsContent value="modelEval" className="mt-0">
        <ModelEvaluator />
      </TabsContent>
      <TabsContent value="report" className="mt-0">
        <ReportComposer />
      </TabsContent>
      <TabsContent value="forecaster" className="mt-0">
        <BusinessForecaster />
      </TabsContent>
      <TabsContent value="scenario" className="mt-0">
        <ScenarioPlanner />
      </TabsContent>
    </>
  );
};

export default DashboardTabContent;


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
import PredictionHistoryViewer from "@/components/tabs/PredictionHistoryViewer";

const DashboardTabContent: React.FC = () => {
  return (
    <>
      {/* Lead Intelligence tabs */}
      <TabsContent value="insight" className="mt-0 pt-2">
        <InsightGenerator />
      </TabsContent>
      <TabsContent value="lead" className="mt-0 pt-2">
        <LeadAnalyzer />
      </TabsContent>
      <TabsContent value="explorer" className="mt-0 pt-2">
        <LeadExplorer />
      </TabsContent>
      <TabsContent value="ltv" className="mt-0 pt-2">
        <LtvEstimator />
      </TabsContent>
      <TabsContent value="auto" className="mt-0 pt-2">
        <AutoAnalysis />
      </TabsContent>
      
      {/* Predictive Analysis tabs */}
      <TabsContent value="strategy" className="mt-0 pt-2">
        <StrategyScanner />
      </TabsContent>
      <TabsContent value="pipeline" className="mt-0 pt-2">
        <PipelineOptimizer />
      </TabsContent>
      <TabsContent value="metrics" className="mt-0 pt-2">
        <ModelMetrics />
      </TabsContent>
      
      {/* System Settings tabs */}
      <TabsContent value="automation" className="mt-0 pt-2">
        <ActionAutomation />
      </TabsContent>
      <TabsContent value="coaching" className="mt-0 pt-2">
        <CoachingGenerator />
      </TabsContent>
      <TabsContent value="console" className="mt-0 pt-2">
        <AgentConsole />
      </TabsContent>
      <TabsContent value="predictions" className="mt-0 pt-2">
        <PredictionHistoryViewer />
      </TabsContent>
      
      {/* Data Intelligence Suite Tab Contents - Fixed spacing */}
      <TabsContent value="uploader" className="mt-0 pt-2">
        <DataUploader />
      </TabsContent>
      <TabsContent value="eda" className="mt-0 pt-2">
        <EdaExplorer />
      </TabsContent>
      <TabsContent value="modelBuilder" className="mt-0 pt-2">
        <ModelBuilder />
      </TabsContent>
      <TabsContent value="modelEval" className="mt-0 pt-2">
        <ModelEvaluator />
      </TabsContent>
      <TabsContent value="report" className="mt-0 pt-2">
        <ReportComposer />
      </TabsContent>
      <TabsContent value="forecaster" className="mt-0 pt-2">
        <BusinessForecaster />
      </TabsContent>
      <TabsContent value="scenario" className="mt-0 pt-2">
        <ScenarioPlanner />
      </TabsContent>
    </>
  );
};

export default DashboardTabContent;


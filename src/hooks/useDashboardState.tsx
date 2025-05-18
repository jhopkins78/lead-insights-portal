import { useState, useCallback } from "react";
import {
  BarChart4,
  Brain,
  Calculator,
  CreditCard,
  History,
  LineChart,
  PieChart,
  Database,
  Settings,
  ShoppingBag,
  Table2,
  User,
  Users,
  Zap,
  FlaskRound,
  Sparkles
} from "lucide-react";
import { DashboardState } from "@/types/dashboard";

export default function useDashboardState(): DashboardState {
  const [activeTab, setActiveTab] = useState("insight");
  const [activePage, setActivePage] = useState("lead-intelligence");
  const [isSamaritanAI, setIsSamaritanAI] = useState(false);
  const [activeSamaritanGroup, setActiveSamaritanGroup] = useState("group1");

  // Define all available tabs with their metadata
  const tabInfo = {
    insight: { icon: Brain, title: "Insight Generator", shortTitle: "Insights" },
    lead: { icon: User, title: "Lead Analyzer", shortTitle: "Analyze" },
    explorer: { icon: Users, title: "Lead Explorer", shortTitle: "Explorer" },
    ltv: { icon: CreditCard, title: "LTV Estimator", shortTitle: "LTV" },
    auto: { icon: Zap, title: "Auto Analysis", shortTitle: "Auto" },
    predictions: { icon: History, title: "Prediction History", shortTitle: "History" },
    strategy: { icon: Sparkles, title: "Strategy Scanner", shortTitle: "Strategy" },
    pipeline: { icon: LineChart, title: "Pipeline Optimizer", shortTitle: "Pipeline" },
    metrics: { icon: BarChart4, title: "Model Metrics", shortTitle: "Metrics" },
    automation: { icon: Zap, title: "Action Automation", shortTitle: "Actions" },
    coaching: { icon: FlaskRound, title: "Coaching Generator", shortTitle: "Coach" },
    console: { icon: Brain, title: "Agent Console", shortTitle: "Console" },
    uploader: { icon: Database, title: "Data Uploader", shortTitle: "Uploader" },
    eda: { icon: Table2, title: "EDA Explorer", shortTitle: "EDA" },
    modelBuilder: { icon: Calculator, title: "Model Builder", shortTitle: "Builder" },
    modelEval: { icon: PieChart, title: "Model Evaluator", shortTitle: "Evaluator" },
    report: { icon: Table2, title: "Report Composer", shortTitle: "Report" },
    forecaster: { icon: LineChart, title: "Business Forecaster", shortTitle: "Forecaster" },
    scenario: { icon: Settings, title: "Scenario Planner", shortTitle: "Planner" },
  };

  // Get tabs for a specific page
  const getTabsForPage = useCallback((page: string): string[] => {
    switch (page) {
      case "lead-intelligence":
        return ["insight", "lead", "explorer", "ltv", "predictions"];
      case "predictive-analysis":
        return ["auto", "strategy", "pipeline"];
      case "system-settings":
        return ["metrics", "automation", "coaching", "console"];
      default:
        return [];
    }
  }, []);

  // Get tabs for a specific Samaritan AI group
  const getTabsForGroup = useCallback((group: string): string[] => {
    switch (group) {
      case "data-intelligence":
        return ["uploader", "eda", "modelBuilder", "modelEval", "report"];
      case "business-forecasting":
        return ["forecaster", "scenario"];
      default:
        return [];
    }
  }, []);

  // Determine if a tab should be shown based on the current page or Samaritan group
  const shouldShowTab = useCallback((tabName: string): boolean => {
    if (isSamaritanAI) {
      return getTabsForGroup(activeSamaritanGroup).includes(tabName);
    } else {
      return getTabsForPage(activePage).includes(tabName);
    }
  }, [isSamaritanAI, activePage, activeSamaritanGroup, getTabsForPage, getTabsForGroup]);

  return {
    activeTab,
    setActiveTab,
    activePage,
    setActivePage,
    isSamaritanAI,
    setIsSamaritanAI,
    activeSamaritanGroup,
    setActiveSamaritanGroup,
    tabInfo,
    getTabsForPage,
    getTabsForGroup,
    shouldShowTab,
  };
}

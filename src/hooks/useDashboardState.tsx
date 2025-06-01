import { useState, useCallback, useContext } from "react";
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
  Sparkles,
  FileText
} from "lucide-react";
import { DashboardState, Product, SamaritanGroup } from "@/types/dashboard";
import { ProductContext } from "@/contexts/ProductContext";

export default function useDashboardState(): DashboardState {
  const { selectedProduct, setSelectedProduct } = useContext(ProductContext);
  const [activeTab, setActiveTab] = useState("insight");
  const [activePage, setActivePage] = useState("lead-intelligence");
  const [isSamaritanAI, setIsSamaritanAI] = useState(false);
  const [activeSamaritanGroup, setActiveSamaritanGroup] = useState("data-exploration");

  // Define products
  const products: Product[] = [
    { id: "lead-commander", name: "Lead Commander" },
    { id: "samaritan-ai", name: "Samaritan AI" },
    { id: "startup-advisor", name: "Startup Advisor (Coming Soon)" },
    { id: "retail-advisor", name: "Retail Insights (Coming Soon)" }
  ];

  // Define Samaritan AI groups
  const samaritanGroups: SamaritanGroup[] = [
    { id: "data-exploration", name: "Data Exploration" },
    { id: "modeling-evaluation", name: "Modeling & Evaluation" },
    { id: "forecasting-simulation", name: "Forecasting & Simulation" },
    { id: "reporting-insights", name: "Reporting & Insights" }
  ];

  // Get the current product
  const currentProduct = products.find(p => p.id === (selectedProduct || "lead-commander")) || products[0];

  // Define available pages based on the current product
  const availablePages = (() => {
    if (currentProduct.id === "samaritan-ai") {
      return samaritanGroups.map(group => group.id);
    }
    return ["lead-intelligence", "predictive-analysis", "system-settings", "data-intelligence"];
  })();

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
    reports: { icon: FileText, title: "Quarterly Reports", shortTitle: "Reports" },
    automation: { icon: Zap, title: "Action Automation", shortTitle: "Actions" },
    coaching: { icon: FlaskRound, title: "Coaching Generator", shortTitle: "Coach" },
    console: { icon: Brain, title: "Agent Console", shortTitle: "Console" },
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
        return ["auto", "strategy", "pipeline", "reports"];
      case "system-settings":
        return ["metrics", "automation", "coaching", "console"];
      case "data-intelligence":
        return ["uploader", "eda", "modelBuilder", "modelEval", "report"];
      default:
        return [];
    }
  }, []);

  // Get tabs for a specific Samaritan AI group
  const getTabsForGroup = useCallback((group: string): string[] => {
    switch (group) {
      case "data-exploration":
        return ["eda"];
      case "modeling-evaluation":
        return ["modelBuilder", "modelEval"];
      case "forecasting-simulation":
        return ["forecaster", "scenario"];
      case "reporting-insights":
        return ["report"];
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

  // Handle product change
  const handleProductChange = useCallback((productId: string) => {
    setSelectedProduct(productId as any);
    
    const newProduct = products.find(p => p.id === productId);
    if (newProduct) {
      setIsSamaritanAI(newProduct.id === "samaritan-ai");
      if (newProduct.id === "samaritan-ai") {
        setActiveSamaritanGroup("data-exploration");
        setActiveTab("eda"); // Set default tab to EDA since uploader is removed
      } else {
        setActivePage("lead-intelligence");
        setActiveTab("insight");
      }
    }
  }, [products, setSelectedProduct]);

  // Handle page change
  const handlePageChange = useCallback((page: string) => {
    setActivePage(page);
    const tabsForPage = getTabsForPage(page);
    if (tabsForPage.length > 0 && !tabsForPage.includes(activeTab)) {
      setActiveTab(tabsForPage[0]);
    }
  }, [activeTab, getTabsForPage]);

  // Handle Samaritan group change
  const handleSamaritanGroupChange = useCallback((groupId: string) => {
    setActiveSamaritanGroup(groupId);
    const tabsForGroup = getTabsForGroup(groupId);
    if (tabsForGroup.length > 0 && !tabsForGroup.includes(activeTab)) {
      setActiveTab(tabsForGroup[0]);
    }
  }, [activeTab, getTabsForGroup]);

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
    products,
    samaritanGroups,
    currentProduct,
    availablePages,
    handleProductChange,
    handlePageChange,
    handleSamaritanGroupChange
  };
}

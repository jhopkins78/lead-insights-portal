
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "@/contexts/ProductContext";
import { Product, SamaritanGroup } from "@/types/dashboard";
import { 
  FileSearch, 
  ChartBar, 
  Calculator, 
  Upload, 
  FileInput, 
  Scan, 
  Settings, 
  BarChart2, 
  MessageSquare, 
  Users, 
  PlayCircle, 
  Headphones,
  Database,
  TrendingUp,
  FileText,
  Search,
  Activity
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const useDashboardState = () => {
  const { toast } = useToast();
  const { selectedProduct, setSelectedProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  
  // Original state
  const [activePage, setActivePage] = useState("lead-intelligence");
  const [activeTab, setActiveTab] = useState("insight");
  
  // New state for Samaritan AI
  const [activeSamaritanGroup, setActiveSamaritanGroup] = useState("data-exploration");
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // State to remember tab selection for each product
  const [productTabState, setProductTabState] = useState<Record<string, {page: string, tab: string, samaritanGroup?: string}>>({
    "lead-commander": { page: "lead-intelligence", tab: "insight" },
    "samaritan-ai": { page: "data-intelligence", tab: "uploader", samaritanGroup: "data-exploration" }
  });

  // Available products
  const products: Product[] = [
    {
      id: "lead-commander",
      name: "Lead Commander",
      availablePages: ["lead-intelligence", "predictive-analysis", "system-settings"]
    },
    {
      id: "samaritan-ai",
      name: "Samaritan AI",
      availablePages: ["data-intelligence"] 
    },
    // Placeholders for future products
    {
      id: "startup-advisor",
      name: "Startup Advisor (Coming Soon)",
      availablePages: []
    },
    {
      id: "retail-insights",
      name: "Retail Insights (Coming Soon)",
      availablePages: []
    }
  ];

  // Define Samaritan AI groups
  const samaritanGroups: SamaritanGroup[] = [
    {
      id: "data-exploration",
      name: "Data Exploration",
      icon: Search
    },
    {
      id: "modeling-evaluation",
      name: "Modeling & Evaluation",
      icon: Activity
    },
    {
      id: "forecasting-simulation",
      name: "Forecasting & Simulation",
      icon: TrendingUp
    },
    {
      id: "reporting-insights",
      name: "Reporting & Insights",
      icon: FileText
    }
  ];

  // Define which tabs belong to which Samaritan group
  const samaritanGroupTabs: Record<string, string[]> = {
    "data-exploration": ["uploader", "eda"],
    "modeling-evaluation": ["modelBuilder", "modelEval"],
    "forecasting-simulation": ["forecaster", "scenario"],
    "reporting-insights": ["insight", "report"]
  };

  // Map tab names to their display information
  const tabInfo = {
    "insight": { title: "Insight Generator", shortTitle: "Insights", icon: FileSearch },
    "uploader": { title: "Data Uploader", shortTitle: "Upload", icon: Upload },
    "eda": { title: "EDA Explorer", shortTitle: "EDA", icon: Search },
    "modelBuilder": { title: "Model Builder", shortTitle: "Builder", icon: Settings },
    "modelEval": { title: "Model Evaluator", shortTitle: "Evaluate", icon: Activity },
    "report": { title: "Report Composer", shortTitle: "Report", icon: FileText },
    "forecaster": { title: "Business Forecaster", shortTitle: "Forecast", icon: TrendingUp },
    "scenario": { title: "Scenario Planner", shortTitle: "Scenarios", icon: PlayCircle },
    // Lead Commander tabs
    "lead": { title: "Lead Analyzer", shortTitle: "Leads", icon: ChartBar },
    "explorer": { title: "Lead Explorer", shortTitle: "Explorer", icon: Users },
    "ltv": { title: "LTV Estimator", shortTitle: "LTV", icon: Calculator },
    "auto": { title: "Auto Analysis", shortTitle: "Auto", icon: FileInput },
    "metrics": { title: "Model Metrics", shortTitle: "Metrics", icon: BarChart2 },
    "coaching": { title: "Coaching Generator", shortTitle: "Coaching", icon: Headphones },
    "pipeline": { title: "Pipeline Optimizer", shortTitle: "Pipeline", icon: Settings },
    "automation": { title: "Action Automation", shortTitle: "Actions", icon: PlayCircle },
    "console": { title: "Agent Console", shortTitle: "Console", icon: MessageSquare },
    "strategy": { title: "Strategy Scanner", shortTitle: "Strategy", icon: Scan }
  };

  // Get tabs for specific group
  const getTabsForGroup = (groupId: string): string[] => {
    return samaritanGroupTabs[groupId] || [];
  };

  // Handle product selection change
  const handleProductChange = (productId: string) => {
    // Store current tab state for current product
    setProductTabState(prev => ({
      ...prev,
      [selectedProduct]: selectedProduct === "samaritan-ai" 
        ? { page: activePage, tab: activeTab, samaritanGroup: activeSamaritanGroup }
        : { page: activePage, tab: activeTab }
    }));
    
    // Update selected product
    setSelectedProduct(productId as any);
    
    // Restore tab state for newly selected product
    const productState = productTabState[productId];
    if (productState) {
      setActivePage(productState.page);
      setActiveTab(productState.tab);
      if (productId === "samaritan-ai" && productState.samaritanGroup) {
        setActiveSamaritanGroup(productState.samaritanGroup);
      }
    } else {
      // Default state for new products
      const product = products.find(p => p.id === productId);
      if (product && product.availablePages.length > 0) {
        setActivePage(product.availablePages[0]);
        
        // Set default tab and group for Samaritan AI
        if (productId === "samaritan-ai") {
          setActiveSamaritanGroup("data-exploration");
          setActiveTab("uploader");
        } else {
          setActiveTab("insight"); // Default tab for other products
        }
      }
    }
  };

  // Set default active tab when page changes
  const handlePageChange = (page: string) => {
    setActivePage(page);
    
    // Set default tab for each page
    if (page === "lead-intelligence") {
      setActiveTab("insight");
    } else if (page === "predictive-analysis") {
      setActiveTab("auto");
    } else if (page === "system-settings") {
      setActiveTab("pipeline");
    } else if (page === "data-intelligence") {
      // For Samaritan AI, set default group and tab
      setActiveSamaritanGroup("data-exploration");
      setActiveTab("uploader");
    }
  };

  // Handle Samaritan group change
  const handleSamaritanGroupChange = (groupId: string) => {
    setActiveSamaritanGroup(groupId);
    // Set default tab for the selected group
    const groupTabs = getTabsForGroup(groupId);
    if (groupTabs.length > 0) {
      setActiveTab(groupTabs[0]);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    toast({
      title: "Files selected",
      description: `${files.length} file${files.length !== 1 ? 's' : ''} ready for processing`,
    });
  };

  // Helper function to determine if a tab should be shown based on current active page
  // and for Samaritan AI, the active group
  const shouldShowTab = (tabName: string) => {
    const leadIntelligenceTabs = ["insight", "lead", "explorer", "ltv"];
    const predictiveAnalysisTabs = ["auto", "metrics", "coaching"];
    const systemSettingsTabs = ["pipeline", "automation", "console", "strategy"];
    
    // For Samaritan AI, show tabs based on active group
    if (activePage === "data-intelligence") {
      const groupTabs = getTabsForGroup(activeSamaritanGroup);
      return groupTabs.includes(tabName);
    }
    
    if (activePage === "lead-intelligence") {
      return leadIntelligenceTabs.includes(tabName);
    } else if (activePage === "predictive-analysis") {
      return predictiveAnalysisTabs.includes(tabName);
    } else if (activePage === "system-settings") {
      return systemSettingsTabs.includes(tabName);
    }
    
    return false;
  };
  
  // Get current product details
  const currentProduct = products.find(p => p.id === selectedProduct) || products[0];
  
  // Filter available pages for navigation menu based on selected product
  const availablePages = currentProduct.availablePages;

  // Determine if showing Samaritan AI product
  const isSamaritanAI = selectedProduct === "samaritan-ai" && activePage === "data-intelligence";

  return {
    activePage,
    setActivePage,
    activeTab,
    setActiveTab,
    activeSamaritanGroup,
    setActiveSamaritanGroup,
    uploadedFiles,
    setUploadedFiles,
    productTabState,
    setProductTabState,
    products,
    samaritanGroups,
    tabInfo,
    getTabsForGroup,
    handleProductChange,
    handlePageChange,
    handleSamaritanGroupChange,
    handleFilesSelected,
    shouldShowTab,
    currentProduct,
    availablePages,
    isSamaritanAI
  };
};

export default useDashboardState;

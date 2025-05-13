
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { FileSearch, ChartBar, Settings, Database, Search, Activity, TrendingUp, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationMenuProps {
  activePage: string;
  setActivePage: (page: string) => void;
  availablePages: string[];
  isSamaritanAI?: boolean;
}

const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({ 
  activePage, 
  setActivePage,
  availablePages,
  isSamaritanAI = false
}) => {
  // Menu option details for Lead Commander
  const leadCommanderOptions = [
    {
      id: "lead-intelligence",
      label: "Lead Intelligence",
      icon: FileSearch,
      description: "Analyze and extract insights from lead data"
    },
    {
      id: "predictive-analysis",
      label: "Predictive Analysis",
      icon: ChartBar,
      description: "Use AI models to predict lead outcomes"
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: Settings,
      description: "Configure system parameters and automation"
    },
    {
      id: "data-intelligence",
      label: "Data Intelligence Suite",
      icon: Database,
      description: "Advanced data analysis and modeling tools"
    }
  ];
  
  // Menu options for Samaritan AI groups
  const samaritanGroupOptions = [
    {
      id: "data-exploration",
      label: "Data Exploration",
      icon: Search,
      description: "Upload and explore your datasets"
    },
    {
      id: "modeling-evaluation",
      label: "Modeling & Evaluation",
      icon: Activity,
      description: "Build and evaluate machine learning models"
    },
    {
      id: "forecasting-simulation",
      label: "Forecasting & Simulation",
      icon: TrendingUp,
      description: "Create business forecasts and simulate scenarios"
    },
    {
      id: "reporting-insights",
      label: "Reporting & Insights",
      icon: FileText,
      description: "Generate reports and extract actionable insights"
    }
  ];
  
  // Select the appropriate options based on whether we're in Samaritan AI mode
  const menuOptions = isSamaritanAI ? samaritanGroupOptions : leadCommanderOptions;
  
  // Filter menu options based on available pages
  const filteredMenuOptions = menuOptions.filter(option => 
    availablePages.includes(option.id)
  );

  return (
    <TooltipProvider>
      <NavigationMenu className="max-w-full justify-start">
        <NavigationMenuList className="space-x-2">
          {filteredMenuOptions.map((option) => (
            <NavigationMenuItem key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavigationMenuTrigger 
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-base",
                      activePage === option.id ? "bg-insight-50 text-insight-900" : ""
                    )}
                    onClick={() => setActivePage(option.id)}
                  >
                    <option.icon className="h-5 w-5" />
                    <span>{option.label}</span>
                  </NavigationMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.description}</p>
                </TooltipContent>
              </Tooltip>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </TooltipProvider>
  );
};

export default NavigationMenuComponent;

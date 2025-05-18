
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTabContent from "./DashboardTabContent";
import { TabInfo } from "@/types/dashboard";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSamaritanAI: boolean;
  activeSamaritanGroup: string;
  activePage: string;
  tabInfo: Record<string, TabInfo>;
  shouldShowTab: (tabName: string) => boolean;
  getTabsForGroup: (groupId: string) => string[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  isSamaritanAI,
  activeSamaritanGroup,
  activePage,
  tabInfo,
  shouldShowTab,
  getTabsForGroup
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid rounded-none border-b bg-muted/50 h-14"
               style={{ 
                 gridTemplateColumns: `repeat(${
                   isSamaritanAI ? getTabsForGroup(activeSamaritanGroup).length :
                   activePage === "lead-intelligence" ? 5 : // Updated to include predictions tab
                   activePage === "predictive-analysis" ? 3 : 
                   activePage === "system-settings" ? 4 : 1
                 }, minmax(0, 1fr))`
               }}>
        
        {/* Dynamically render tabs based on current page or Samaritan group */}
        {Object.keys(tabInfo).map(tabKey => {
          const tab = tabInfo[tabKey];
          if (shouldShowTab(tabKey)) {
            return (
              <TabsTrigger 
                key={tabKey}
                value={tabKey} 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-insight-500 rounded-none"
              >
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.title}</span>
                <span className="sm:hidden">{tab.shortTitle}</span>
              </TabsTrigger>
            );
          }
          return null;
        })}
      </TabsList>
      <div className="p-6">
        <DashboardTabContent />
      </div>
    </Tabs>
  );
};

export default DashboardTabs;

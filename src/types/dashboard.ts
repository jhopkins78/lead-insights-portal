import React from "react";
import { BarChart4, Brain, FlaskRound, PieChart, Table2, Users } from "lucide-react";
// Add more imports if needed for your tabInfo

export interface TabInfo {
  icon: React.ElementType;
  title: string;
  shortTitle: string;
}

export interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  isSamaritanAI: boolean;
  setIsSamaritanAI: (value: boolean) => void;
  activeSamaritanGroup: string;
  setActiveSamaritanGroup: (group: string) => void;
  tabInfo: Record<string, TabInfo>;
  getTabsForPage: (page: string) => string[];
  getTabsForGroup: (group: string) => string[];
  shouldShowTab: (tab: string) => boolean;
}

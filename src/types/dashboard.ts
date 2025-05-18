
import React from "react";
import { BarChart4, Brain, FlaskRound, PieChart, Table2, Users } from "lucide-react";

export interface TabInfo {
  icon: React.ElementType;
  title: string;
  shortTitle: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
}

export interface SamaritanGroup {
  id: string;
  name: string;
  description?: string;
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
  // Additional properties needed
  products: Product[];
  samaritanGroups: SamaritanGroup[];
  currentProduct: Product;
  availablePages: string[];
  handleProductChange: (productId: string) => void;
  handlePageChange: (page: string) => void;
  handleSamaritanGroupChange: (groupId: string) => void;
}

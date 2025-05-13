
import { ReactElement } from "react";

export interface Product {
  id: string;
  name: string;
  availablePages: string[];
}

export interface SamaritanGroup {
  id: string;
  name: string;
  icon: React.ElementType;
}

export interface TabInfo {
  title: string;
  shortTitle: string;
  icon: React.ElementType;
}

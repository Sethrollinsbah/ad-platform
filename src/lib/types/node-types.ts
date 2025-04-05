// src/lib/types/node-types.ts

import type { SvelteComponent } from 'svelte';

// Base node interface
export interface BaseNode {
  id: string;
  position: { x: number; y: number };
  component: typeof SvelteComponent;
  type: string;
}

// Data interfaces for each node type
export interface TableNodeData {
  headingText: string;
  headingColor: string;
  borderColor: string;
  shadowColor: string;
  tableData: Array<{ field: string; type: string; constraint: string }>;
  anchorDirection?: string;
  anchorTop?: number;
  anchorLeft?: number;
  cellWidth?: number;
  cellPadding?: number;
  backgroundColor?: string;
}

export interface CampaignNodeData {
  campaignName: string;
  campaignStatus: string;
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  mainColor: string;
  borderColor?: string;
  shadowColor: string;
  anchorDirection?: string;
  anchorTop?: number;
  anchorLeft?: number;
  backgroundColor?: string;
}

export interface PlatformNodeData {
  platformName: string;
  platformType: string;
  platformIcon: string;
  budget: number;
  budgetPercentage: number;
  impressions: number;
  clicks: number;
  conversions: number;
  costPerClick: number;
  costPerConversion: number;
  mainColor: string;
  borderColor?: string;
  shadowColor: string;
  anchorDirection?: string;
  anchorTop?: number;
  anchorLeft?: number;
  backgroundColor?: string;
}

// Typed node interfaces
export interface TableNode extends BaseNode {
  type: 'table';
  data: TableNodeData;
}

export interface CampaignNode extends BaseNode {
  type: 'campaign';
  data: CampaignNodeData;
}

export interface PlatformNode extends BaseNode {
  type: 'platform';
  data: PlatformNodeData;
}

// Union type for all node types
export type Node = TableNode | CampaignNode | PlatformNode;

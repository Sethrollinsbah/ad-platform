// Types for the chat dashboard components

export interface ChatMessage {
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface RestaurantInfo {
  name: string;
  type: string;
  location: string;
  targetAudience: string;
  goals: string;
}

export interface CampaignSettings {
  budget: number;
  duration: number;
  primaryGoal: string;
  secondaryGoal: string;
}

export interface FunnelMetrics {
  [key: string]: string;
}

export interface FunnelStep {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  x: number;
  y: number;
  width: number;
  targets: string[];
  metrics: FunnelMetrics;
}

export interface FunnelEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label: string;
  color: string;
}

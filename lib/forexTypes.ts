export interface ForexEvent {
  actual: number | null;
  country: string;
  estimate: number | null;
  event: string;
  impact: string;
  prev: number | null;
  time: string;
  unit: string;
}

export type ImpactLevel = "High" | "Medium" | "Low" | "high" | "medium" | "low" | string;

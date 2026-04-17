export interface PollResponse {
  id: number;
  timestamp: string;
  ageGroup: string;
  gender: string;
  region: string;
  preferredTool: string;
  satisfaction: number;
  feedback: string;
}

export interface SummaryStats {
  totalResponses: number;
  topTool: string;
  avgSatisfaction: number;
  uniqueRegions: number;
}

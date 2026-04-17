import { PollResponse } from '../types';
import { subDays, format } from 'date-fns';

const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55+'];
const GENDERS = ['Male', 'Female', 'Non-binary'];
const TOOLS = ['Python', 'R', 'Excel', 'Power BI', 'Tableau'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const FEEDBACKS = [
  'Very helpful and intuitive',
  'Needs better documentation',
  'Great for data analysis',
  'Could be faster',
  'Love the visualizations',
  'Good community support',
  'Steep learning curve',
  'Highly recommend',
];

export function generateMockData(n: number = 300): PollResponse[] {
  const data: PollResponse[] = [];
  const now = new Date();

  for (let i = 1; i <= n; i++) {
    const timestamp = subDays(now, Math.floor(Math.random() * 90)).toISOString();
    
    data.push({
      id: i,
      timestamp,
      ageGroup: AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)],
      gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      preferredTool: TOOLS[Math.floor(Math.random() * TOOLS.length)],
      satisfaction: Math.floor(Math.random() * 5) + 1,
      feedback: FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)],
    });
  }

  return data;
}

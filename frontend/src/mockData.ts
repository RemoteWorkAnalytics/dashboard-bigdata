import {
  DailyStat,
  EmployeeOverview,
  ProductivityData,
  StressFactor,
  RealTimeCMSData,
} from './types';

export const OVERVIEW_STATS: EmployeeOverview = {
  totalEmployees: 1248,
  avgMentalHealth: 7.2,
  avgProductivity: 8.1,
  burnoutRiskCount: 52,
};

export const TREND_DATA: DailyStat[] = [
  { date: 'Dec 15', stressLevel: 4.2, productivity: 8.2, highStressCount: 120, remoteEmployees: 600, onsiteEmployees: 300, hybridEmployees: 348 },
  { date: 'Dec 16', stressLevel: 4.5, productivity: 8.0, highStressCount: 145, remoteEmployees: 610, onsiteEmployees: 290, hybridEmployees: 348 },
  { date: 'Dec 17', stressLevel: 4.8, productivity: 7.5, highStressCount: 168, remoteEmployees: 620, onsiteEmployees: 280, hybridEmployees: 348 },
  { date: 'Dec 18', stressLevel: 5.1, productivity: 7.2, highStressCount: 190, remoteEmployees: 605, onsiteEmployees: 295, hybridEmployees: 348 },
  { date: 'Dec 19', stressLevel: 4.3, productivity: 8.5, highStressCount: 130, remoteEmployees: 615, onsiteEmployees: 285, hybridEmployees: 348 },
  { date: 'Dec 20', stressLevel: 4.0, productivity: 8.8, highStressCount: 110, remoteEmployees: 625, onsiteEmployees: 275, hybridEmployees: 348 },
  { date: 'Dec 21', stressLevel: 3.8, productivity: 9.0, highStressCount: 95, remoteEmployees: 630, onsiteEmployees: 270, hybridEmployees: 348 },
];

export const STRESS_BY_LOCATION: StressFactor[] = [
  { location: 'Remote', stressScore: 3.8 },
  { location: 'Hybrid', stressScore: 4.5 },
  { location: 'Onsite', stressScore: 6.2 },
];

export const PERFORMANCE_DATA: ProductivityData[] = [
  { sleepQuality: 'Poor', productivityScore: 45, avgMeetings: 8, burnoutScore: 85 },
  { sleepQuality: 'Fair', productivityScore: 65, avgMeetings: 6, burnoutScore: 60 },
  { sleepQuality: 'Good', productivityScore: 85, avgMeetings: 3, burnoutScore: 30 },
  { sleepQuality: 'Excellent', productivityScore: 95, avgMeetings: 2, burnoutScore: 15 },
];

/* ✅ هذا كان ناقص */
export const SCATTER_PERFORMANCE = Array.from({ length: 50 }).map((_, i) => ({
  meetings: Math.floor(Math.random() * 10) + 1,
  burnout: Math.floor(Math.random() * 80) + (i % 5) * 10,
  productivity: Math.floor(Math.random() * 100),
}));

export const generateCMSData = (): RealTimeCMSData => {
  const baseTotal = 1200;

  return {
    timestamp: new Date().toLocaleTimeString(),
    stressLevels: [
      { label: 'Low', estimate: Math.floor(baseTotal * 0.45), color: '#10b981' },
      { label: 'Medium', estimate: Math.floor(baseTotal * 0.35), color: '#f59e0b' },
      { label: 'High', estimate: Math.floor(baseTotal * 0.2), color: '#ef4444' },
    ],
    productivityChanges: [
      { label: 'Increased', estimate: 320, color: '#6366f1' },
      { label: 'Decreased', estimate: 140, color: '#f43f5e' },
      { label: 'No Change', estimate: 740, color: '#94a3b8' },
    ],
    locations: [
      { label: 'Remote', estimate: 650, color: '#8b5cf6' },
      { label: 'Office A', estimate: 300, color: '#3b82f6' },
      { label: 'Office B', estimate: 250, color: '#06b6d4' },
    ],
  };
};

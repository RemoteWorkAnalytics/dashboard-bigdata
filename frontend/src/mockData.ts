
import { DailyStat, EmployeeOverview, ProductivityData, StressFactor } from './types';

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

export const SCATTER_PERFORMANCE = Array.from({ length: 50 }).map((_, i) => ({
  meetings: Math.floor(Math.random() * 10) + 1,
  burnout: Math.floor(Math.random() * 80) + (i % 5) * 10,
  productivity: Math.floor(Math.random() * 100),
}));

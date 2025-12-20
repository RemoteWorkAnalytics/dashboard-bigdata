export interface DailyStat {
  date: string;
  stressLevel: number;
  productivity: number;
  highStressCount: number;
  remoteEmployees: number;
  onsiteEmployees: number;
  hybridEmployees: number;
}

export interface EmployeeOverview {
  totalEmployees: number;
  avgMentalHealth: number;
  avgProductivity: number;
  burnoutRiskCount: number;
}

export interface StressFactor {
  location: string;
  stressScore: number;
}

export interface ProductivityData {
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  productivityScore: number;
  avgMeetings: number;
  burnoutScore: number;
}

export interface RiskPrediction {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  recommendations: string[];
  explanation: string;
}

/* ===== CMS Real-Time ===== */

export interface CMSStat {
  label: string;
  estimate: number;
  color: string;
}

export interface RealTimeCMSData {
  timestamp: string;
  stressLevels: CMSStat[];
  productivityChanges: CMSStat[];
  locations: CMSStat[];
}

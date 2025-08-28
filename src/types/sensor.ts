export interface SensorData {
  id: number;
  customerName: string;
  sensorAssigned: string;
  deploymentDate: string;
  status: 'Live' | 'Trouble' | 'NA';
  latestUpdates: string;
  reasonForTrouble: string;
  resolutionStatus: string;
  deployment: string;
  unit: string;
  application: string;
  parameter: string;
  measurementRange: string;
}

export interface SensorStats {
  total: number;
  live: number;
  trouble: number;
  notDeployed: number;
}

export interface FilterOptions {
  status: string;
  customer: string;
  unit: string;
  parameter: string;
}

export interface SortConfig {
  key: keyof SensorData;
  direction: 'asc' | 'desc';
}
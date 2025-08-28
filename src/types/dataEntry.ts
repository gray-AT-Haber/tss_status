export interface DataPoint {
  id?: string;
  timestamp: string;
  sensorId: string;
  value: number;
  status: 'Live' | 'Trouble' | 'NA';
  notes: string;
  unit?: string;
  parameter?: string;
}

export interface ContactOption {
  type: 'phone' | 'email';
  label: string;
  value: string;
  icon: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: {
    [key: string]: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
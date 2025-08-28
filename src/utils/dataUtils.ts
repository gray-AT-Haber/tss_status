import { SensorData, SensorStats } from '../types/sensor';

export const calculateSensorStats = (sensors: SensorData[]): SensorStats => {
  const stats = sensors.reduce(
    (acc, sensor) => {
      acc.total++;
      switch (sensor.status) {
        case 'Live':
          acc.live++;
          break;
        case 'Trouble':
          acc.trouble++;
          break;
        case 'NA':
          acc.notDeployed++;
          break;
      }
      return acc;
    },
    { total: 0, live: 0, trouble: 0, notDeployed: 0 }
  );

  return stats;
};

export const getStatusColor = (status: string, isDark = false): string => {
  switch (status) {
    case 'Live':
      return isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
    case 'Trouble':
      return isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
    case 'NA':
      return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    default:
      return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
  }
};

export const getStatusRowColor = (status: string, isDark = false): string => {
  switch (status) {
    case 'Live':
      return isDark ? 'hover:bg-green-900/30' : 'hover:bg-green-50';
    case 'Trouble':
      return isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50';
    default:
      return isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  }
};
export const exportToCSV = (sensors: SensorData[], filename: string = 'sensor-data') => {
  const headers = [
    'Customer Name',
    'Sensor Assigned',
    'Deployment Date',
    'Status',
    'Latest Updates',
    'Reason for Trouble',
    'Resolution Status',
    'Deployment',
    'Unit',
    'Application',
    'Parameter',
    'Measurement Range'
  ];

  const csvContent = [
    headers.join(','),
    ...sensors.map(sensor => [
      `"${sensor.customerName}"`,
      `"${sensor.sensorAssigned}"`,
      `"${sensor.deploymentDate}"`,
      `"${sensor.status}"`,
      `"${sensor.latestUpdates.replace(/"/g, '""')}"`,
      `"${sensor.reasonForTrouble}"`,
      `"${sensor.resolutionStatus}"`,
      `"${sensor.deployment}"`,
      `"${sensor.unit}"`,
      `"${sensor.application}"`,
      `"${sensor.parameter}"`,
      `"${sensor.measurementRange}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatUpdateText = (updates: string): string => {
  if (!updates) return 'No updates available';
  
  // Limit to first 100 characters for table view
  return updates.length > 100 ? updates.substring(0, 100) + '...' : updates;
};

export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);
  
  // Handle various date formats
  const cleaned = dateString.trim();
  if (cleaned.match(/^\d{1,2}\s+\w{3}\s+\d{2}$/)) {
    // Format: "28 Sep 23"
    return new Date(`${cleaned.slice(-2) > '50' ? '19' : '20'}${cleaned.slice(-2)}-${cleaned}`);
  }
  
  return new Date(dateString);
};
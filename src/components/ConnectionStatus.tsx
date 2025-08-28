import React from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  lastUpdated: Date;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  error, 
  lastUpdated 
}) => {
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Connection Error</span>
        <span className="text-xs text-red-500">({error})</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Google Sheets Connected</span>
        <span className="text-xs text-gray-500">
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-amber-600">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Using Sample Data</span>
      <span className="text-xs text-gray-500">Configure Google Sheets API</span>
    </div>
  );
};

export default ConnectionStatus;
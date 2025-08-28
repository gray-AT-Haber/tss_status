import React from 'react';
import { SensorStats } from '../types/sensor';

interface StatusCardsProps {
  stats: SensorStats;
  isDark?: boolean;
  lastUpdated?: Date | null;
}

const StatusCards: React.FC<StatusCardsProps> = ({ stats, isDark = false, lastUpdated }) => {
  const total = stats.total || 1;
  const deployedPercentage = (stats.live / total) * 100;

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Live */}
      <div className={`group rounded-xl p-6 border transition-all duration-300 hover:shadow-md hover:scale-102 ${
        isDark 
          ? 'bg-gradient-to-br from-green-900/30 to-transparent border-green-800/50' 
          : 'bg-gradient-to-br from-green-50 to-transparent border-green-200'
      }`}>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-50 animate-ping"></div>
          </div>
          <div className="ml-4">
            <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
              {stats.live}
            </div>
            <div className={`text-sm font-semibold tracking-wide uppercase ${isDark ? 'text-green-300' : 'text-green-600'}`}>
              Live
            </div>
          </div>
        </div>
        <div className={`mt-2 text-xs ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
          Operational & updating on Dashboard
        </div>
      </div>

      {/* Trouble */}
      <div className={`group rounded-xl p-6 border transition-all duration-300 hover:shadow-md hover:scale-102 ${
        isDark 
          ? 'bg-gradient-to-br from-red-900/30 to-transparent border-red-800/50' 
          : 'bg-gradient-to-br from-red-50 to-transparent border-red-200'
      }`}>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 bg-red-400 rounded-full opacity-50 animate-ping"></div>
          </div>
          <div className="ml-4">
            <div className={`text-3xl font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
              {stats.trouble}
            </div>
            <div className={`text-sm font-semibold tracking-wide uppercase ${isDark ? 'text-red-300' : 'text-red-600'}`}>
              Trouble
            </div>
          </div>
        </div>
        <div className={`mt-2 text-xs ${isDark ? 'text-red-400/70' : 'text-red-600/70'}`}>
          Needs attention or maintenance
        </div>
      </div>

      {/* Not Deployed */}
      <div className={`group rounded-xl p-6 border transition-all duration-300 hover:shadow-md hover:scale-102 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800/40 to-transparent border-gray-700' 
          : 'bg-gradient-to-br from-gray-50 to-transparent border-gray-200'
      }`}>
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} shadow-sm`}></div>
          <div>
            <div className={`text-3xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {stats.notDeployed}
            </div>
            <div className={`text-sm font-semibold tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Not Deployed
            </div>
          </div>
        </div>
        <div className={`mt-2 text-xs ${isDark ? 'text-gray-400/70' : 'text-gray-600/70'}`}>
          Pending installation
        </div>
      </div>

      {/* Deployment Progress */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Deployment Progress</span>
          <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
            {Math.round(deployedPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${deployedPercentage}%` }}
          ></div>
        </div>
        <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {stats.live} of {total} sensors active
        </div>
      </div>
 
      {/* Last Updated */}
      {lastUpdated && (
        <div className={`text-xs mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default StatusCards;
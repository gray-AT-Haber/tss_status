import React from 'react';
import { SensorStats } from '../types/sensor';

interface StatusGaugeProps {
  stats: SensorStats;
  isDark?: boolean;
}

const StatusGauge: React.FC<StatusGaugeProps> = ({ stats, isDark = false }) => {
  const total = stats.total || 1;
  const livePercentage = (stats.live / total) * 100;
  const troublePercentage = (stats.trouble / total) * 100;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const liveOffset = circumference - (livePercentage / 100) * circumference;
  const troubleOffset = circumference - (troublePercentage / 100) * circumference;

  return (
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Live Sensor Dashboard 
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Real-time status of deployed sensor
        </p>
      </div>

      <div className="flex items-center justify-center relative">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 240 240">
          {/* Background Circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={isDark ? "rgba(107, 114, 128, 0.3)" : "rgba(229, 231, 235, 0.6)"}
            strokeWidth="14"
            fill="transparent"
          />

          {/* Live Arc */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="url(#liveGradient)"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={liveOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(16, 185, 129, 0.4))' }}
          />

          {/* Trouble Arc (inner, thinner) */}
          <circle
            cx="120"
            cy="120"
            r="95"
            stroke="url(#troubleGradient)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference * 0.95}
            strokeDashoffset={troubleOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="liveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="troubleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(livePercentage)}%
          </div>
          <div className="text-xs font-semibold text-green-500 tracking-wide uppercase mt-1">
            LIVE
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {stats.live} of {total}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-6 space-x-6 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            Live: <strong>{stats.live}</strong>
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            Trouble: <strong>{stats.trouble}</strong>
          </span>
        </div>
      </div>

      {/* Alert Banner */}
      {stats.trouble > 0 && (
        <div className={`mt-6 p-4 rounded-xl border-l-4 border-orange-400 animate-pulse-fast ${
          isDark ? 'bg-orange-900/30' : 'bg-orange-50'
        }`}>
          <div className="flex items-start">
            <svg className="h-5 w-5 text-orange-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                Action Required
              </h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-orange-100' : 'text-orange-700'}`}>
                {stats.trouble} sensors{stats.trouble > 1 ? 's' : ''} are in trouble. Please review and resolve.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusGauge;
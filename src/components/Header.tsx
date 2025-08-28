import React from 'react';
import { RefreshCw } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date;
  isDark: boolean;
  onThemeToggle: () => void;
}

// Batman Logo component with yellow oval and symmetrical bat wings
const BatmanLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="40"     // scaled smaller from original 320 for header use
    height="24"    // scaled proportionally
    className={className}
    viewBox="0 0 300 196"  // adjusted viewBox to contain the original shape
  >
    <g className="batman_logo" transform="translate(5,5)">
      <g className="background_shield">
        <ellipse
          cx="150"
          cy="93"
          ry="93"
          rx="150.5"
          stroke="#000000"
          strokeWidth="9"
          fill="#FFF200"
        />
      </g>
      <g className="bat_symbol">
        <path
          strokeWidth="1"
          stroke="#000000"
          fill="#000000"
          d="M150, 30 L140, 30 L132, 19 C134, 100 67, 83 102, 20 C0,70 0, 100 70, 156 C38 125 81 105, 107 145 C115 127.6 140 127.6 149.5 169 L150, 30 z"
        />
      </g>
      <g
        className="bat_symbol_flipped"
        transform="scale(-1, 1) translate(-299, 0)"
      >
        <path
          strokeWidth="1"
          stroke="#000000"
          fill="#000000"
          d="M150, 30 L140, 30 L132, 19 C134, 100 67, 83 102, 20 C0,70 0, 100 70, 156 C38 125 81 105, 107 145 C115 127.6 140 127.6 149.5, 169 L150, 30 z"
        />
      </g>
    </g>
  </svg>
);

const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing,
  lastUpdated,
  isDark,
  onThemeToggle,
}) => {
  return (
    <header
      className={`shadow-sm border-b transition-colors duration-200 ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Batman Logo */}
              <BatmanLogo className="h-6 w-auto" />
              <div className="ml-4">
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  TSS Sensor Monitoring Dashboard
                </h1>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Paper/Pulp Plant Deployments
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <div className="text-right">
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Last updated
              </p>
              <p
                className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                isDark
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

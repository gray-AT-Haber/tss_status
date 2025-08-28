import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatusGauge from './components/StatusGauge';
import StatusCards from './components/StatusCards';
import DataTable from './components/DataTable';
import DetailPanel from './components/DetailPanel';
import ConnectionStatus from './components/ConnectionStatus';
import { SensorData } from './types/sensor';
import { calculateSensorStats, exportToCSV } from './utils/dataUtils';
import { useSensorData } from './hooks/useSensorData';
import { useTheme } from './hooks/useTheme';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { 
    sensorData, 
    isLoading, 
    error, 
    lastUpdated, 
    refresh, 
    isConnected 
  } = useSensorData(300000); // 5 minutes auto-refresh
  
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);

  const handleExport = () => {
    exportToCSV(sensorData, 'sensor-deployment-status');
  };

  const stats = calculateSensorStats(sensorData);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header
        onRefresh={refresh}
        isRefreshing={isLoading}
        lastUpdated={lastUpdated}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status Banner */}
        <div className="mb-8">
          <div className={`rounded-lg shadow-sm border p-4 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <ConnectionStatus 
                isConnected={isConnected}
                error={error}
                lastUpdated={lastUpdated}
              />
              {!isConnected && !error && (
                <div className={`text-sm ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  <span className="font-medium">Setup Required:</span> Configure Google Sheets API to enable live data
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Dashboard Layout - Left Gauge, Right Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
  {/* Left Side - Status Gauge (larger) */}
  <div className="lg:col-span-2 h-full">
    <div className={`rounded-xl shadow-sm border transition-colors duration-200 h-full ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="p-6">
        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          TSS Sensor Status Overview
        </h3>
        <StatusGauge stats={stats} isDark={isDark} />
      </div>
    </div>
  </div>

  {/* Right Side - Status Cards */}
  <div className="lg:col-span-1 h-full">
    <div className={`rounded-xl shadow-sm p-6 border transition-colors duration-200 h-full ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Deployment Status
      </h3>
      <StatusCards stats={stats} isDark={isDark} />
    </div>
  </div>
</div>
        
        <div>
          
          <DataTable
            data={sensorData}
            onRowSelect={setSelectedSensor}
            onExport={handleExport}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className={`rounded-lg p-6 shadow-xl transition-colors duration-200 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                isDark ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Refreshing sensor data...
              </span>
            </div>
          </div>
        </div>
      )}

      <DetailPanel
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
        isDark={isDark}
      />

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © TSS Sensor Monitoring Dashboard. 
            </div>
            <div className={`flex items-center space-x-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>Version 2.1.20</span>
              <span>•</span>
              <span>Production Ready</span>
              <span>•</span>
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
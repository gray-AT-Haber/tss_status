import React, { useState } from 'react';
import { SensorData } from '../types/sensor';
import { X, Calendar, MapPin, Activity, AlertCircle, CheckCircle, Clock, Plus, Phone } from 'lucide-react';
import { getStatusColor } from '../utils/dataUtils';
import DataPointModal from './DataPointModal';
import EscalationModal from './EscalationModal';
import { useDataPointSubmission } from '../hooks/useDataPointSubmission';
import { DataPoint } from '../types/dataEntry';

interface DetailPanelProps {
  sensor: SensorData | null;
  onClose: () => void;
  isDark?: boolean;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ sensor, onClose, isDark = false }) => {
  const [isDataPointModalOpen, setIsDataPointModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const { submitDataPoint } = useDataPointSubmission();

  if (!sensor) return null;

  const handleDataPointSubmit = async (dataPoint: DataPoint) => {
    await submitDataPoint(dataPoint);
    setIsDataPointModalOpen(false);
  };

  const formatUpdates = (updates: string) => {
    if (!updates) return [];
    return updates.split('\n').filter(line => line.trim());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Trouble':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'NA':
        return <Clock className="w-5 h-5 text-gray-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      {/* Backdrop (full-screen, behind panel) */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right-side Panel - Fixed, Always in View */}
      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full z-50 transform transition-transform duration-500 ease-in-out ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } flex flex-col shadow-2xl`}
        style={{ willChange: 'transform' }}
      >
        {/* Header - Sticky */}
        <div
  className={`px-6 py-4 ${
    isDark
      ? 'bg-gray-900 border-b border-gray-700'
      : 'bg-white border-b border-gray-100 shadow-sm'
  }`}
>
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {getStatusIcon(sensor.status)}
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {sensor.sensorAssigned}
        </h2>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          {sensor.customerName}
        </p>
      </div>
    </div>

    <button
      onClick={onClose}
      className={`p-2 rounded-lg transition-colors ${
        isDark
          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      } focus:outline-none focus:ring-2 focus:ring-gray-300`}
      aria-label="Close panel"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
</div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex items-center justify-center min-h-40 px-4 py-8 w-full">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
    {/* Card 1: Status */}
    <div
      className={`group relative p-6 rounded-2xl transition-all duration-300 transform bg-gradient-to-br 
        ${
          isDark
            ? 'from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800'
            : 'from-white to-gray-50 border border-gray-300 hover:to-white'
        }
        hover:shadow-2xl hover:scale-105 hover:shadow-gray-300/40`}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div
          className={`p-2 rounded-xl bg-opacity-20 transition-colors ${
            sensor.status === 'Active'
              ? 'bg-green-100'
              : sensor.status === 'Inactive'
              ? 'bg-red-100'
              : 'bg-yellow-100'
          }`}
        >
          <Activity
            className={`w-5 h-5 ${
              sensor.status === 'Active'
                ? 'text-green-600'
                : sensor.status === 'Inactive'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          />
        </div>
        <h4
          className={`text-sm font-semibold ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          System Status
        </h4>
      </div>

      {/* Status Badge */}
      <span
        className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-sm transition-all duration-300 
          ${
            sensor.status === 'Active'
              ? 'bg-green-100 text-green-800 ring-2 ring-green-200'
              : sensor.status === 'Inactive'
              ? 'bg-red-100 text-red-800 ring-2 ring-red-200'
              : 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-200'
          }
          group-hover:shadow-md group-hover:ring-4`}
      >
        {sensor.status === 'Active' && '✅ '}
        {sensor.status === 'Inactive' && '🛑 '}
        {sensor.status === 'Pending' && '⏳ '}
        {sensor.status}
      </span>
    </div>

    {/* Card 2: Deployment Date */}
    <div
      className={`group relative p-6 rounded-2xl transition-all duration-300 transform bg-gradient-to-br 
        ${
          isDark
            ? 'from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800'
            : 'from-white to-gray-50 border border-gray-300 hover:to-white'
        }
        hover:shadow-2xl hover:scale-105 hover:shadow-blue-200/40`}
    >
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2 rounded-xl bg-blue-50">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Deployed On
        </h4>
      </div>
      <p
        className={`text-lg font-bold bg-clip-text text-transparent ${
          isDark
            ? 'bg-gradient-to-r from-blue-300 to-purple-200'
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
      >
        {sensor.deploymentDate || 'Not Deployed'}
      </p>
    </div>

    {/* Card 3: Location/Status */}
    <div
      className={`group relative p-6 rounded-2xl transition-all duration-300 transform bg-gradient-to-br 
        ${
          isDark
            ? 'from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800'
            : 'from-white to-gray-50 border border-gray-300 hover:to-white'
        }
        hover:shadow-2xl hover:scale-105 hover:shadow-emerald-200/40`}
    >
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2 rounded-xl bg-emerald-50">
          <MapPin className="w-5 h-5 text-emerald-600" />
        </div>
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Deployment Site
        </h4>
      </div>
      <p
        className={`text-lg font-bold truncate ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
        title={sensor.deployment}
      >
        {sensor.deployment || 'Unknown Location'}
      </p>
      <p
        className={`text-xs mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        {sensor.unit ? `Unit: ${sensor.unit}` : 'No unit assigned'}
      </p>
    </div>
  </div>
</div>

          {/* Technical Specs */}
          <div className="mb-8">
            <div
              className={`rounded-xl border overflow-hidden ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              } shadow-sm`}
            >
              <div
                className={`px-6 py-3 ${
                  isDark
                    ? 'bg-indigo-900/80 border-b border-indigo-800'
                    : 'bg-indigo-500 border-b border-indigo-200'
                }`}
              >
                <h3 className="text-lg font-bold text-white">Technical Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {[
                  { label: 'Unit', value: sensor.unit, icon: '🏢' },
                  { label: 'Application', value: sensor.application, icon: '🧪' },
                  { label: 'Parameter', value: sensor.parameter, icon: '🌡️' },
                  { label: 'Range', value: sensor.measurementRange, icon: '📏' },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className={`text-center p-4 rounded-lg ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <div className="text-lg mb-1">{spec.icon}</div>
                    <p
                      className={`text-xs font-medium uppercase tracking-wide ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {spec.label}
                    </p>
                    <p
                      className={`font-semibold mt-1 truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {spec.value || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Troubleshooting Information */}
          {(sensor.reasonForTrouble || sensor.resolutionStatus) && (
            <div className={`border rounded-lg p-6 mb-8 transition-colors duration-200 ${
              isDark 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center ${
                isDark ? 'text-red-400' : 'text-red-900'
              }`}>
                <AlertCircle className="w-5 h-5 mr-2" />
                Troubleshooting Information
              </h3>
              {sensor.reasonForTrouble && (
                <div className="mb-4">
                  <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                    Issue:
                  </span>
                  <p className={`mt-1 ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                    {sensor.reasonForTrouble}
                  </p>
                </div>
              )}
              {sensor.resolutionStatus && (
                <div>
                  <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                    
                    Resolution Status:
                  </span>
                  <p className={`mt-1 ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                    {sensor.resolutionStatus}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Update History */}
          <div
  className={`border rounded-lg p-6 transition-colors duration-200 ${
    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  }`}
>
  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
    Update History
  </h3>

  {sensor.latestUpdates ? (
    <div className="space-y-4">
      {formatUpdates(sensor.latestUpdates)
        .slice(0, 5) // 👈 Only show first 5 updates
        .map((update, index) => (
          <div key={index} className="flex space-x-3">
            <div className="flex-shrink-0 mt-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDark ? 'bg-blue-400' : 'bg-blue-600'
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                {update.trim()}
              </p>
            </div>
          </div>
        ))}

      {/* Optional: Show "More updates..." if there are more than 5 */}
      {formatUpdates(sensor.latestUpdates).length > 5 && (
        <p
          className={`text-xs italic mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          +{formatUpdates(sensor.latestUpdates).length - 5} more updates...
        </p>
      )}
    </div>
  ) : (
    <div
      className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
    >
      <Activity
        className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
      />
      <p>No update history available</p>
    </div>
  )}
</div>
          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {sensor.status === 'Trouble' && (
              <button
                onClick={() => setIsEscalationModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                <Phone className="w-4 h-4" />
                <span>Escalate Issue</span>
              </button>
            )}
            <button
              onClick={() => setIsDataPointModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Update</span>
            </button>
            <button
              onClick={onClose}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200
                ${isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`}
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DataPointModal
        sensor={sensor}
        isOpen={isDataPointModalOpen}
        onClose={() => setIsDataPointModalOpen(false)}
        onSubmit={handleDataPointSubmit}
        isDark={isDark}
      />
      <EscalationModal
        sensor={sensor}
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        isDark={isDark}
      />
    </>
  );
};

export default DetailPanel;
import React from 'react';
import ReactDOM from 'react-dom';
import { X, Phone, Mail } from 'lucide-react';
import { SensorData } from '../types/sensor';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isDark?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, isDark = false }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`rounded-3xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden transition-colors duration-200 ${
          isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5 relative">
          <h2 className="text-xl font-semibold text-center">{title}</h2>
          
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto max-h-96 p-6 space-y-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`p-4 border-t transition-colors duration-200 ${
              isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

interface EscalationModalProps {
  sensor: SensorData;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean; // Required for theme sync
}

const EscalationModal: React.FC<EscalationModalProps> = ({ sensor, isOpen, onClose, isDark }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escalate Sensor Issue"
      isDark={isDark}
      footer={
        <button
          onClick={onClose}
          className={`w-full px-6 py-2.5 font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
            isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
          }`}
        >
          Close
        </button>
      }
    >
      {/* === Issue Summary === */}
      <div
        className={`rounded-2xl p-5 border space-y-2 text-sm ${
          isDark
            ? 'bg-red-900/20 border-red-800 text-red-100'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}
      >
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-red-300' : 'text-red-900'}`}>
          ⚠️ Issue Summary
        </h3>
        <p>
          <span className="font-medium">Sensor:</span> {sensor.sensorAssigned}
        </p>
        <p>
          <span className="font-medium">Customer:</span> {sensor.customerName}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              isDark
                ? 'bg-red-900 text-red-200'
                : 'bg-red-200 text-red-800'
            }`}
          >
            {sensor.status}
          </span>
        </p>
        {sensor.unit && (
          <p>
            <span className="font-medium">Unit:</span> {sensor.unit}
          </p>
        )}
        {sensor.parameter && (
          <p>
            <span className="font-medium">Parameter:</span> {sensor.parameter}
          </p>
        )}
        {sensor.reasonForTrouble && (
          <p>
            <span className="font-medium">Issue:</span> {sensor.reasonForTrouble}
          </p>
        )}
      </div>

      {/* === Contact Information === */}
      <div>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Primary Contact
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          For urgent resolution, please reach out to the designated engineer.
        </p>

        <div
          className={`rounded-2xl p-5 space-y-4 border ${
            isDark
              ? 'bg-gray-900 border-gray-700 text-gray-100'
              : 'bg-white border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}
            >
              👤
            </div>
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Saurabh Marne
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Senior Implementation Engineer
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-3 text-sm">
              <Phone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span>saurabh.marne@haberwater.com</span>
            </div>
          </div>

          <div
            className={`text-xs mt-3 p-3 rounded-lg ${
              isDark
                ? 'bg-amber-900/30 text-amber-200 border border-amber-800'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <strong>Note:</strong> For urgent issues, a phone call is recommended during business hours or maybe just Slack them :3
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EscalationModal;
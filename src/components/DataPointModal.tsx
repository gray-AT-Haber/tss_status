import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { SensorData } from '../types/sensor';
import { DataPoint, FormValidation } from '../types/dataEntry';

interface DataPointModalProps {
  sensor: SensorData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dataPoint: DataPoint) => Promise<void>;
  isDark?: boolean; // ← Add this
}

const DataPointModal: React.FC<DataPointModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onSubmit,
  isDark = false, // Default to light if not passed
}) => {
  const [formData, setFormData] = useState<Partial<DataPoint>>({
    timestamp: new Date().toISOString().slice(0, 16),
    sensorId: sensor.id.toString(),
    status: sensor.status,
    notes: '',
    unit: sensor.unit,
    parameter: sensor.parameter,
  });

  const [validation, setValidation] = useState<FormValidation>({
    isValid: false,
    errors: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        timestamp: new Date().toISOString().slice(0, 16),
        sensorId: sensor.id.toString(),
        status: sensor.status,
        notes: '',
        unit: sensor.unit,
        parameter: sensor.parameter,
      });
      setSubmitStatus('idle');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, sensor]);

  const validateForm = (data: Partial<DataPoint>): FormValidation => {
    const errors: { [key: string]: string } = {};
    if (!data.timestamp) errors.timestamp = 'Timestamp is required';
    if (!data.status) errors.status = 'Status is required';
    if (!data.notes || data.notes.trim().length < 5) {
      errors.notes = 'Notes must be at least 5 characters long';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  useEffect(() => {
    const validationResult = validateForm(formData);
    setValidation(validationResult);
  }, [formData]);

  const handleInputChange = (field: keyof DataPoint, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData as DataPoint);
      setSubmitStatus('success');
      setTimeout(onClose, 1500);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Failed to submit data point:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto transition-colors duration-200 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 ${isDark ? 'bg-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Add New Update</h2>
              <p className="text-blue-100">
                {sensor.sensorAssigned} - {sensor.customerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Timestamp */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Timestamp *
              </label>
              <input
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) => handleInputChange('timestamp', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } ${validation.errors.timestamp ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`
                }
                disabled={isSubmitting}
              />
              {validation.errors.timestamp && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.errors.timestamp}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } ${validation.errors.status ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`
                }
                disabled={isSubmitting}
              >
                <option value="Live">Live</option>
                <option value="Trouble">Trouble</option>
                <option value="NA">Not Available</option>
              </select>
              {validation.errors.status && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.errors.status}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Notes *
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter detailed notes about this reading..."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                } ${validation.errors.notes ? 'border-red-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`
                }
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                {validation.errors.notes ? (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validation.errors.notes}
                  </p>
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.notes?.length || 0} characters (minimum 5)
                  </p>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className={`rounded-lg p-4 ${isDark ? 'bg-green-900/30 text-green-200 border border-green-800' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Data point added successfully!</span>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className={`rounded-lg p-4 ${isDark ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Failed to add data point. Please try again.</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t transition-colors duration-200 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validation.isValid || isSubmitting}
              className={`px-6 py-2 text-white rounded-lg flex items-center font-medium transition-colors ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Confirm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataPointModal;
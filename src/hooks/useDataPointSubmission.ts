import { useState, useCallback } from 'react';
import { DataPoint } from '../types/dataEntry';
import { createGoogleSheetsDataService } from '../services/googleSheetsDataService';

interface UseDataPointSubmissionReturn {
  submitDataPoint: (dataPoint: DataPoint) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export const useDataPointSubmission = (): UseDataPointSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitDataPoint = useCallback(async (dataPoint: DataPoint) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const dataService = createGoogleSheetsDataService();
      
      if (!dataService) {
        // Fallback: simulate submission for demo purposes
        console.log('Demo mode: Data point would be submitted:', dataPoint);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setSuccess(true);
        return;
      }

      // Initialize the data sheet if needed
      await dataService.initializeDataSheet();
      
      // Submit the data point
      await dataService.appendDataPoint(dataPoint);
      
      setSuccess(true);
      console.log('Data point submitted successfully:', dataPoint);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit data point';
      setError(errorMessage);
      console.error('Data point submission error:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    submitDataPoint,
    isSubmitting,
    error,
    success
  };
};
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SensorData } from '../types/sensor';
import { createGoogleSheetsService } from '../services/googleSheetsService';
import { sampleSensorData } from '../utils/sampleData';

interface UseSensorDataReturn {
  sensorData: SensorData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date;
  refresh: () => Promise<void>;
  isConnected: boolean;
}

export const useSensorData = (autoRefreshInterval: number = 300000): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData[]>(sampleSensorData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);

  // ✅ FIX: Create service once with useMemo to prevent recreation
  const googleSheetsService = useMemo(() => createGoogleSheetsService(), []);

  const fetchData = useCallback(async () => {
    if (!googleSheetsService) {
      setSensorData(sampleSensorData);
      setIsConnected(false);
      setError(null);
      setLastUpdated(new Date());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rawData = await googleSheetsService.fetchSheetData();
      const transformedData = googleSheetsService.transformToSensorData(rawData);
      
      setSensorData(transformedData);
      setIsConnected(true);
      setLastUpdated(new Date());
      
      console.log(`Successfully loaded ${transformedData.length} sensor records from Google Sheets`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data from Google Sheets';
      setError(errorMessage);
      setIsConnected(false);
      
      // Fallback to sample data on error
      setSensorData(sampleSensorData);
      
      console.error('Google Sheets fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [googleSheetsService]); // ✅ Now googleSheetsService is stable

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // ✅ FIX: Single useEffect for both initial load and auto-refresh
  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    // Initial fetch
    const initialFetch = async () => {
      if (!mounted) return;
      await fetchData();
      
      // Set up auto-refresh only after initial load
      if (mounted && autoRefreshInterval > 0) {
        intervalId = setInterval(() => {
          if (mounted) fetchData();
        }, autoRefreshInterval);
      }
    };

    initialFetch();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, autoRefreshInterval]);

  // ✅ FIX: Remove separate testConnection - it's redundant
  // Connection status is already handled by fetchData

  return {
    sensorData,
    isLoading,
    error,
    lastUpdated,
    refresh,
    isConnected
  };
};

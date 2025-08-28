import { DataPoint } from '../types/dataEntry';

interface GoogleSheetsDataConfig {
  apiKey: string;
  sheetId: string;
  dataSheetRange: string; // e.g., 'DataPoints!A:F'
}

export class GoogleSheetsDataService {
  private config: GoogleSheetsDataConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsDataConfig) {
    this.config = config;
  }

  /**
   * Append a new data point to the Google Sheet
   */
  async appendDataPoint(dataPoint: DataPoint): Promise<void> {
    try {
      const values = [
        [
          dataPoint.timestamp,
          dataPoint.sensorId,
          dataPoint.value.toString(),
          dataPoint.status,
          dataPoint.notes,
          dataPoint.unit || '',
          dataPoint.parameter || ''
        ]
      ];

      const url = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.dataSheetRange}:append`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to append data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data point added successfully:', result);
    } catch (error) {
      console.error('Error appending data point:', error);
      throw new Error('Failed to save data point to Google Sheets');
    }
  }

  /**
   * Batch append multiple data points
   */
  async appendMultipleDataPoints(dataPoints: DataPoint[]): Promise<void> {
    try {
      const values = dataPoints.map(dataPoint => [
        dataPoint.timestamp,
        dataPoint.sensorId,
        dataPoint.value.toString(),
        dataPoint.status,
        dataPoint.notes,
        dataPoint.unit || '',
        dataPoint.parameter || ''
      ]);

      const url = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.dataSheetRange}:append`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to append data: ${response.status} ${response.statusText}`);
      }

      console.log(`Successfully added ${dataPoints.length} data points`);
    } catch (error) {
      console.error('Error appending multiple data points:', error);
      throw new Error('Failed to save data points to Google Sheets');
    }
  }

  /**
   * Initialize the data sheet with headers if it doesn't exist
   */
  async initializeDataSheet(): Promise<void> {
    try {
      const headers = [
        'Timestamp',
        'Sensor ID',
        'Value',
        'Status',
        'Notes',
        'Unit',
        'Parameter'
      ];

      // First, try to read the sheet to see if it exists
      const readUrl = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.dataSheetRange}?key=${this.config.apiKey}`;
      
      try {
        const readResponse = await fetch(readUrl);
        if (readResponse.ok) {
          const data = await readResponse.json();
          if (data.values && data.values.length > 0) {
            console.log('Data sheet already exists with data');
            return;
          }
        }
      } catch (readError) {
        console.log('Data sheet may not exist, will create headers');
      }

      // Add headers if sheet is empty or doesn't exist
      const url = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.dataSheetRange}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers],
          valueInputOption: 'USER_ENTERED'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize sheet: ${response.status} ${response.statusText}`);
      }

      console.log('Data sheet initialized with headers');
    } catch (error) {
      console.error('Error initializing data sheet:', error);
      throw new Error('Failed to initialize Google Sheets data storage');
    }
  }

  /**
   * Fetch recent data points for a specific sensor
   */
  async getRecentDataPoints(sensorId: string, limit: number = 10): Promise<DataPoint[]> {
    try {
      const url = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.dataSheetRange}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        return [];
      }

      const [headers, ...rows] = data.values;
      
      return rows
        .filter((row: string[]) => row[1] === sensorId) // Filter by sensor ID
        .slice(-limit) // Get last N entries
        .map((row: string[]) => ({
          timestamp: row[0] || '',
          sensorId: row[1] || '',
          value: parseFloat(row[2]) || 0,
          status: (row[3] as 'Live' | 'Trouble' | 'NA') || 'NA',
          notes: row[4] || '',
          unit: row[5] || '',
          parameter: row[6] || ''
        }));
    } catch (error) {
      console.error('Error fetching recent data points:', error);
      return [];
    }
  }
}

// Factory function to create service instance
export const createGoogleSheetsDataService = (): GoogleSheetsDataService | null => {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const dataSheetRange = import.meta.env.VITE_GOOGLE_SHEET_DATA_RANGE || 'DataPoints!A:G';

  if (!apiKey || !sheetId) {
    console.warn('Google Sheets configuration missing for data service.');
    return null;
  }

  return new GoogleSheetsDataService({ apiKey, sheetId, dataSheetRange });
};
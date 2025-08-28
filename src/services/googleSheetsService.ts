interface GoogleSheetsConfig {
  apiKey: string;
  sheetId: string;
  range: string;
}

interface SheetRow {
  [key: string]: string;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  /**
   * Fetch data from Google Sheets using the Sheets API
   */
  async fetchSheetData(retries = 3, delay = 1000): Promise<SheetRow[]> {
    try {
      const url = `${this.baseUrl}/${this.config.sheetId}/values/${this.config.range}?key=${this.config.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          console.warn(`Google Sheets API rate limit hit, retrying after ${delay} ms...`);
          await new Promise(r => setTimeout(r, delay));
          return this.fetchSheetData(retries - 1, delay * 2);
        }
        throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.values || data.values.length === 0) {
        throw new Error('No data found in the specified range');
      }

      const [headers, ...rows] = data.values;

      return rows.map((row: string[]) => {
        const rowData: SheetRow = {};
        headers.forEach((header: string, index: number) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });

    } catch (error) {
      // Only retry on network errors, not all errors
      if (retries > 0 && error instanceof TypeError) { // Network errors
        console.warn(`Network error, retrying after ${delay} ms...`, error);
        await new Promise(r => setTimeout(r, delay));
        return this.fetchSheetData(retries - 1, delay * 2);
      }
      throw error; // Don't retry API errors like 403, 401, etc.
    }
  }

  /**
   * Transform raw sheet data to SensorData format
   */
  transformToSensorData(rawData: SheetRow[]): any[] {
    return rawData.map((row, index) => ({
      id: parseInt(row['elz'] || row['ID'] || (index + 1).toString()),
      customerName: row['Customer'] || '',
      sensorAssigned: row['Sensor Assigned'] || '',
      deploymentDate: row['Deply date'] || row['Deploy date'] || row['Deployment Date'] || '',
      status: this.normalizeStatus(row['Status'] || ''),
      latestUpdates: row['Updates'] || row['Latest Updates'] || '',
      reasonForTrouble: row['Reason'] || row['Reason for Trouble'] || '',
      resolutionStatus: row['Resolution'] || row['Resolution Status'] || '',
      deployment: row['Deployment'] || '',
      unit: row['Unit'] || '',
      application: row['Application'] || '',
      parameter: row['Parameter'] || '',
      measurementRange: row['Range'] || row['Measurement Range'] || ''
    }));
  }

  /**
   * Normalize status values to match expected format
   */
  private normalizeStatus(status: string): 'Live' | 'Trouble' | 'NA' {
    const normalized = status.toLowerCase().trim();
    
    if (normalized === 'live' || normalized === 'online' || normalized === 'active') {
      return 'Live';
    } else if (normalized === 'trouble' || normalized === 'error' || normalized === 'offline' || normalized === 'problem') {
      return 'Trouble';
    } else {
      return 'NA';
    }
  }
}

// Factory function to create service instance
export const createGoogleSheetsService = (): GoogleSheetsService | null => {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const range = import.meta.env.VITE_GOOGLE_SHEET_RANGE || 'Sheet1!A:L';

  if (!apiKey || !sheetId) {
    console.warn('Google Sheets configuration missing. Using sample data.');
    return null;
  }

  return new GoogleSheetsService({ apiKey, sheetId, range });
};

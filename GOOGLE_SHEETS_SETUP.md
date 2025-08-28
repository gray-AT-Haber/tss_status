# Google Sheets Integration Setup Guide

## Step 1: Prepare Your Google Sheet

1. **Create or Open Your Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new sheet or open your existing sensor data sheet

2. **Format Your Sheet Headers** (Row 1 should contain these exact headers):
   ```
   elz | Sensor Assigned | Deply date | Customer | Status | Updates | Reason | Resolution | Deployment | Unit | Application | Parameter | Range
   ```

3. **Create Data Points Sheet** (for storing sensor readings):
   - Add a new sheet tab called "DataPoints"
   - Add these headers in row 1:
   ```
   Timestamp | Sensor ID | Value | Status | Notes | Unit | Parameter
   ```

3. **Make Your Sheet Public** (Option 1 - Easiest):
   - Click "Share" button in top right
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Copy the share link

4. **Get Your Sheet ID**:
   - From the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the SHEET_ID_HERE part

## Step 2: Enable Google Sheets API (Option 2 - More Secure)

1. **Go to Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create API Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - (Optional) Restrict the API key to Google Sheets API only

## Step 3: Configure Your Dashboard

1. **Create Environment File**:
   - Copy `.env.example` to `.env`
   - Add your configuration:

   ```env
   # For Public Sheet (Option 1)
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   VITE_GOOGLE_SHEET_ID=your_sheet_id_here
   VITE_GOOGLE_SHEET_RANGE=Sheet1!A:M
   VITE_GOOGLE_SHEET_DATA_RANGE=DataPoints!A:G

   # Sheet URL Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
   ```

2. **Test the Connection**:
   - The dashboard will automatically detect the configuration
   - Look for the connection status in the header
   - Green checkmark = Connected to Google Sheets
   - Orange warning = Using sample data (not connected)

## Step 4: Verify Data Format

Your Google Sheet should match this structure:

| elz | Sensor Assigned | Deply date | Customer | Status | Updates | Reason | Resolution | Deployment | Unit | Application | Parameter | Range |
|-----|----------------|------------|----------|---------|---------|---------|------------|------------|------|-------------|-----------|-------|
| 5   | Sensor 2       | 28 Sep 23  | Yash Pakka | Live   | Updates text... | | | Deployed | PM3 | RDA | TSS | 400-3000 ppm |

**Data Points Sheet Structure:**

| Timestamp | Sensor ID | Value | Status | Notes | Unit | Parameter |
|-----------|-----------|-------|---------|-------|------|-----------|
| 2024-01-15T10:30:00 | 5 | 1250.5 | Live | Normal reading | ppm | TSS |

## Troubleshooting

**Common Issues:**

1. **"No data found" error**:
   - Check that your sheet has data in the specified range
   - Verify the sheet name (default is "Sheet1")
   - Ensure headers are in row 1

2. **"API error" messages**:
   - Verify your API key is correct
   - Check that Google Sheets API is enabled
   - Ensure the sheet is accessible (public or shared)

3. **Data not updating**:
   - Check the auto-refresh is working (every 5 minutes)
   - Use the manual refresh button in the header
   - Verify your sheet ID is correct

**Security Notes:**
- For production use, consider using Service Account credentials
- Restrict API keys to specific domains
- Regularly rotate API keys
- Monitor API usage in Google Cloud Console

## Advanced Configuration

For server-side access or enhanced security, you can use Service Account credentials:

1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Share your Google Sheet with the service account email
4. Use the service account credentials in your backend

The dashboard architecture supports both client-side API key access and server-side service account access.

## New Features

### Data Point Entry
- Click "Add Data Point" on any sensor to log new readings
- Data is automatically saved to the "DataPoints" sheet
- Includes timestamp, sensor value, status, and detailed notes

### Escalation System
- "Escalate Issue" button for sensors in trouble status
- Direct phone calling and email composition
- Pre-filled email templates with sensor details

### Enhanced UI
- Modern modal interfaces with form validation
- Real-time feedback and loading states
- Mobile-responsive design with improved accessibility
import React, { useState } from 'react';
import { FileSpreadsheet, ExternalLink, CheckCircle, AlertCircle, X } from 'lucide-react';

const GoogleSheetsNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <FileSpreadsheet className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Google Sheets Integration Setup
          </h3>
          <div className="text-sm text-blue-700 space-y-3">
            <p>
              This dashboard is designed to integrate with Google Sheets for real-time data updates.
              Currently displaying sample data for demonstration purposes.
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Create a Google Sheet with the following columns: Customer, Sensor Assigned, Deploy date, Status, Updates, Reason, Resolution, Deployment, Unit, Application, Parameter, Range</li>
                <li>Enable Google Sheets API in your Google Cloud Console</li>
                <li>Create service account credentials</li>
                <li>Share your Google Sheet with the service account email</li>
                <li>Add your credentials to the environment variables</li>
              </ol>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-700 text-sm">Dashboard UI Ready</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-amber-600 mr-1" />
                <span className="text-amber-700 text-sm">Google Sheets API Pending</span>
              </div>
            </div>

            <a
              href="https://developers.google.com/sheets/api/quickstart/nodejs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Google Sheets API Documentation
            </a>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsNotice;
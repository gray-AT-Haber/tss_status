import React, { useState, useMemo } from 'react';
import { SensorData, SortConfig, FilterOptions } from '../types/sensor';
import { getStatusColor, getStatusRowColor, formatUpdateText } from '../utils/dataUtils';
import { Search, Filter, ChevronUp, ChevronDown, Eye, Download } from 'lucide-react';

interface DataTableProps {
  data: SensorData[];
  onRowSelect: (sensor: SensorData) => void;
  onExport: () => void;
  isDark: boolean; // <-- Add this
}

const DataTable: React.FC<DataTableProps> = ({ data, onRowSelect, onExport, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'customerName', direction: 'asc' });
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    customer: '',
    unit: '',
    parameter: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueValues = useMemo(() => ({
    customers: [...new Set(data.map(item => item.customerName))].filter(Boolean).sort(),
    units: [...new Set(data.map(item => item.unit))].filter(Boolean).sort(),
    parameters: [...new Set(data.map(item => item.parameter))].filter(Boolean).sort(),
  }), [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(sensor => {
      const matchesSearch = Object.values(sensor).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesFilters = 
        (!filters.status || sensor.status === filters.status) &&
        (!filters.customer || sensor.customerName === filters.customer) &&
        (!filters.unit || sensor.unit === filters.unit) &&
        (!filters.parameter || sensor.parameter === filters.parameter);

      return matchesSearch && matchesFilters;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data, searchTerm, sortConfig, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key: keyof SensorData) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterKey: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: '', customer: '', unit: '', parameter: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const SortIcon = ({ column }: { column: keyof SensorData }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className={`rounded-xl shadow-sm border transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-200 ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sensor Deployment Status
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredAndSortedData.length} sensors • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'} w-4 h-4`} />
              <input
                type="text"
                placeholder="Search all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Status</option>
            <option value="Live">Live</option>
            <option value="Trouble">Trouble</option>
            <option value="NA">Not Deployed</option>
          </select>

          <select
            value={filters.customer}
            onChange={(e) => handleFilterChange('customer', e.target.value)}
            className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Customers</option>
            {uniqueValues.customers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>

          <select
            value={filters.unit}
            onChange={(e) => handleFilterChange('unit', e.target.value)}
            className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Units</option>
            {uniqueValues.units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b transition-colors ${
            isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('customerName')}
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <span>Customer</span>
                  <SortIcon column="customerName" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('sensorAssigned')}
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <span>Sensor</span>
                  <SortIcon column="sensorAssigned" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <span>Status</span>
                  <SortIcon column="status" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('unit')}
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <span>Unit</span>
                  <SortIcon column="unit" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('parameter')}
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <span>Parameter</span>
                  <SortIcon column="parameter" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Latest Updates</span>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
            {paginatedData.map((sensor) => (
              <tr
                key={sensor.id}
                className={`${
                  isDark 
                    ? getStatusRowColor(sensor.status, true) // Pass isDark to row color
                    : getStatusRowColor(sensor.status, false)
                } transition-colors cursor-pointer hover:bg-opacity-80`}
                onClick={() => onRowSelect(sensor)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{sensor.customerName}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{sensor.deploymentDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{sensor.sensorAssigned}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sensor.status, isDark)}`}>
                    {sensor.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {sensor.unit}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {sensor.parameter}
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm max-w-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatUpdateText(sensor.latestUpdates)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowSelect(sensor);
                    }}
                    className={isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`px-6 py-4 border-t transition-colors ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        } flex items-center justify-between`}>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded ${
                isDark
                  ? 'border border-gray-600 disabled:opacity-50 hover:bg-gray-700'
                  : 'border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isDark
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded ${
                isDark
                  ? 'border border-gray-600 disabled:opacity-50 hover:bg-gray-700'
                  : 'border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
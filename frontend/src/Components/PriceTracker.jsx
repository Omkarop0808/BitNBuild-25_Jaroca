import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Tag, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';

// Mock historical price data for the chart
const priceHistory = [
  { date: '2024-03-01', price: 145000 },
  { date: '2024-03-08', price: 142500 },
  { date: '2024-03-15', price: 143000 },
  { date: '2024-03-22', price: 141000 },
  { date: '2024-03-29', price: 139900 },
  { date: '2024-04-05', price: 140500 },
  { date: '2024-04-12', price: 138000 },
  { date: '2024-04-19', price: 139000 },
  { date: '2024-04-26', price: 139900 },
];

const PriceTracker = ({ product }) => {
  const currentPrice = product.price || 0;
  const highestPrice = Math.max(...priceHistory.map(p => p.price));
  const lowestPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Price Tracker</h1>
        <p className="text-gray-600 mt-1">Historical price data for: <span className="font-semibold">{product.name}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price History (90 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis domain={['dataMin - 5000', 'dataMax + 5000']} tickFormatter={(val) => `${(val / 1000)}k`} />
                <Tooltip formatter={(value) => [`${product.currency} ${value.toLocaleString()}`, "Price"]} />
                <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-2xl font-bold text-gray-900">{product.currency} {currentPrice.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUp className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Highest Price</p>
              <p className="text-2xl font-bold text-gray-900">{product.currency} {highestPrice.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <ArrowDown className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lowest Price</p>
              <p className="text-2xl font-bold text-gray-900">{product.currency} {lowestPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTracker;

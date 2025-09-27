import React from 'react';

const PriceTracker = ({ product }) => {
  // Simple mock price tracker view using product.price from sample data
  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Price Tracker</h2>
        <p className="text-sm text-gray-600 mb-4">Track historical prices and set alerts for price drops.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Current price</p>
            <p className="text-2xl font-bold">{product.currency} {product.price}</p>
            <p className="text-xs text-gray-400">As of {product.scraped_at}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Price trend (mock)</p>
            <div className="h-24 bg-white border rounded flex items-center justify-center text-sm text-gray-400">Chart placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTracker;

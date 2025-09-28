import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PerformanceChart = ({ data }) => {
  const chartData = (data.attributes || []).map(a => ({ name: a.displayName, value: a.score }));

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Performance — Attribute Scores</h2>
        <p className="text-sm text-gray-500 mb-4">Normalized attribute scores (0-100)</p>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5a3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

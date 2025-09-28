import React from 'react';

const AreasImprovementCard = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Areas of improvement</h3>
      <p className="text-sm text-gray-500 mb-6">Visible only to you</p>
      
      <div className="space-y-6">
        {data.areas_improvement.map((area, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">{area.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{area.title}</h4>
              <p className="text-sm text-gray-600">{area.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreasImprovementCard;
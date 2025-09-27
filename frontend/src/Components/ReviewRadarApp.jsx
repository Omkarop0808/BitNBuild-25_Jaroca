import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Dashboard from './Dashboard.jsx';
import PriceTracker from './PriceTracker.jsx';
import PerformanceChart from './PerformanceChart.jsx';
import sampleReviewData from './sampleReviewData.jsx';

const ReviewRadarApp = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        {activeItem === 'dashboard' && <Dashboard />}
        {activeItem === 'price' && <PriceTracker product={sampleReviewData.product} />}
        {activeItem === 'performance' && <PerformanceChart data={sampleReviewData} />}
      </div>
    </div>
  );
};

export default ReviewRadarApp;
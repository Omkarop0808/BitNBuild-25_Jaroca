import React from 'react';
import { LayoutDashboard, Tag, BarChartHorizontal } from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={24} />, id: "dashboard" },
    { icon: <Tag size={24} />, id: "price" },
    { icon: <BarChartHorizontal size={24} />, id: "performance" }
  ];

  return (
    <div className="w-20 bg-black min-h-screen flex flex-col items-center py-6">
      <div className="flex flex-col items-center space-y-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              (activeItem === item.id) ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setActiveItem(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
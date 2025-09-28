import React from "react";

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-black">REVIEW</span>
              <span className="text-green-500">RADAR</span>
            </div>
          </div>

          {/* Center Links (optional, can remove if not needed) */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 text-sm font-medium transition"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 text-sm font-medium transition"
            >
              Insights
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 text-sm font-medium transition"
            >
              Reports
            </a>
          </div>

          {/* Right side: User */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-500">
              Hi, John
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold shadow">
              J
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

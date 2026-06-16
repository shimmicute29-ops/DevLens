import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            🎯 DevLens
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-purple-200">Dashboard</Link>
            <Link to="/assessments" className="hover:text-purple-200">Assessments</Link>
            <Link to="/skills" className="hover:text-purple-200">Skills</Link>
            <Link to="/compare" className="hover:text-purple-200">Compare</Link>
            <Link to="/reports" className="hover:text-purple-200">Reports</Link>
            <Link to="/profile" className="hover:text-purple-200">Profile</Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

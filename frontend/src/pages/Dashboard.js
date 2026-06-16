import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          `http://localhost:5000/api/developers/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(profileResponse.data);

        // Fetch stats
        const statsResponse = await axios.get(
          `http://localhost:5000/api/developers/${userId}/recommendations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome back! 👋</h1>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-sm font-semibold mb-2">Total Assessments</h2>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-sm font-semibold mb-2">Skills Assessed</h2>
            <p className="text-3xl font-bold">25</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-sm font-semibold mb-2">Average Score</h2>
            <p className="text-3xl font-bold">78%</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">📚 Recommended Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.length > 0 && stats.map((rec, idx) => (
            <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-bold">{rec.skill_name}</h3>
              <p className="text-sm text-gray-600">Confidence: {(rec.confidence * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-lg hover:shadow-lg transition">
          Start New Assessment →
        </button>
        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg hover:shadow-lg transition">
          View Skill Report →
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

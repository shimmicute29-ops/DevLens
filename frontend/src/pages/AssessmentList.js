import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', difficulty: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        let url = 'http://localhost:5000/api/assessments';
        const params = new URLSearchParams();
        if (filter.category) params.append('category', filter.category);
        if (filter.difficulty) params.append('difficulty', filter.difficulty);
        if (params.toString()) url += '?' + params.toString();

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssessments(response.data);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [filter, token]);

  const handleStartAssessment = async (assessmentId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/assessments/start',
        { assessmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = `/assessments/${response.data.sessionId}`;
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  };

  if (loading) return <div className="p-8">Loading assessments...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">📚 Assessments</h1>

      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="DevOps">DevOps</option>
          <option value="Cloud">Cloud</option>
          <option value="ML">Machine Learning</option>
        </select>
        <select
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
              <h3 className="text-xl font-bold">{assessment.title}</h3>
              <p className="text-sm opacity-90">{assessment.category}</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  assessment.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  assessment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assessment.difficulty}
                </span>
                <span className="text-sm text-gray-600">⏱️ {assessment.duration_minutes} min</span>
              </div>
              <button
                onClick={() => handleStartAssessment(assessment.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition font-semibold"
              >
                Start Assessment →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentList;

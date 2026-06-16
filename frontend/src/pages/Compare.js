import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Compare = () => {
  const [developers, setDevelopers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/developers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDevelopers(response.data);
      } catch (error) {
        console.error('Failed to fetch developers:', error);
      }
    };

    fetchDevelopers();
  }, [token]);

  const handleCompare = async () => {
    if (selectedIds.length === 0) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/developers/${userId}/compare`,
        { compareWithUserIds: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComparison(response.data);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">🔍 Developer Comparison</h1>

      {/* Developer Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Developers to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developers.map((dev) => (
            <label key={dev.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50">
              <input
                type="checkbox"
                checked={selectedIds.includes(dev.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, dev.id]);
                  } else {
                    setSelectedIds(selectedIds.filter(id => id !== dev.id));
                  }
                }}
                className="mr-3"
              />
              <span className="font-semibold">{dev.name}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleCompare}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition font-semibold"
        >
          Compare Selected Developers
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comparison Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comparison.map((comp, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-bold mb-4">Vs Developer {idx + 1}</h3>
                <div className="space-y-2">
                  {comp.skills1.slice(0, 5).map((skill) => {
                    const otherSkill = comp.skills2.find(s => s.skill_name === skill.skill_name);
                    return (
                      <div key={skill.id}>
                        <p className="font-semibold">{skill.skill_name}</p>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-300 rounded h-2">
                              <div className="bg-blue-500 h-2 rounded" style={{ width: `${skill.proficiency}%` }} />
                            </div>
                          </div>
                          {otherSkill && (
                            <div className="flex-1">
                              <div className="w-full bg-gray-300 rounded h-2">
                                <div className="bg-purple-500 h-2 rounded" style={{ width: `${otherSkill.proficiency}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;

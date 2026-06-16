import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkillRadar3D from '../components/SkillRadar3D';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SkillVisualization = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/developers/${userId}/skills`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSkills(response.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userId, token]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">🎯 Your Skill Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Radar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">3D Skill Radar</h2>
          <SkillRadar3D skills={skills} />
        </div>

        {/* Skills Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Proficiency Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="proficiency" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-gradient-to-br from-purple-500 to-blue-500 p-6 rounded-lg text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">{skill.skill_name}</h3>
            <p className="text-sm mb-4">Category: {skill.skill_category}</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
            <p className="text-right mt-2">{skill.proficiency}%</p>
            <p className="text-sm mt-2">Experience: {skill.years_of_experience} years</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillVisualization;

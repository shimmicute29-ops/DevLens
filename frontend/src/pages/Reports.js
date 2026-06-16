import React, { useState, useEffect } from 'axios';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reports?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchReports();
  }, [userId, token]);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reports',
        { userId, reportType: 'comprehensive' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports([...reports, response.data]);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">📊 Reports & Analytics</h1>

      <button
        onClick={handleGenerateReport}
        className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-semibold"
      >
        Generate New Report
      </button>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-lg text-white cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2 capitalize">{report.report_type} Report</h3>
            <p className="text-sm opacity-90">Generated on {new Date(report.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 capitalize">{selectedReport.report_type} Report</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Skill Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={JSON.parse(selectedReport.data).skills || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="proficiency" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Assessment Scores</h3>
              <div className="space-y-2">
                {JSON.parse(selectedReport.data).assessments?.slice(0, 5).map((assessment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                    <span className="font-semibold">Assessment {idx + 1}</span>
                    <span className="text-lg font-bold text-purple-600">{assessment.percentage?.toFixed(1) || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

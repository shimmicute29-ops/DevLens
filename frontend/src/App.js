import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AssessmentList from './pages/AssessmentList';
import AssessmentTaking from './pages/AssessmentTaking';
import ProfilePage from './pages/ProfilePage';
import SkillVisualization from './pages/SkillVisualization';
import Compare from './pages/Compare';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        {isAuthenticated && <Navigation />}
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/assessments/:id" element={<AssessmentTaking />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/skills" element={<SkillVisualization />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

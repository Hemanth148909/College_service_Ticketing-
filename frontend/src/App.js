import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManagementDashboard from './pages/ManagementDashboard';  // Import the missing page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Default page to Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/management_dashboard" element={<ManagementDashboard />} />  {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;

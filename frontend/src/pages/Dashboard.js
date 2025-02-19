import React, { useState } from "react";
import { FaBars, FaTimes, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import RaiseRequest from "./RaiseRequest";  
import MyRequests from "./MyRequests";  
import "../styles/Dashboard.css";

const Dashboard = ({ userName = "User" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard"); // Default to Dashboard
  const [notifications] = useState([
    "New update available",
    "Your request has been approved",
    "System maintenance on Sunday",
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FaUserCircle className="profile-icon" size={40} />
          {sidebarOpen && <h3>Welcome, {userName} 👋</h3>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <ul className="menu-items">
          <li onClick={() => setActivePage("requests")}>📌 My Open Requests</li>
          <li onClick={() => setActivePage("raise")}>📝 Raise Request</li>
        </ul>
        <button className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header with Notifications */}
        <div className="header">
          <h2>Dashboard</h2>
          <div className="notification-container">
            <FaBell className="bell-icon" onClick={() => setNotificationsOpen(!notificationsOpen)} />
            {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            {notificationsOpen && (
              <div className="notifications-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((note, index) => <div key={index} className="notification">{note}</div>)
                ) : (
                  <div className="notification">No new notifications</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Content: Render Selected Page */}
        <div className="dashboard-content">
          {activePage === "dashboard" && (
            <>
              <p>Welcome to the College Service Ticketing System 🎉</p>
              <p>Click on "Raise Request" to submit a new service request.</p>
            </>
          )}
          {activePage === "raise" && <RaiseRequest />}
          {activePage === "requests" && <MyRequests />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

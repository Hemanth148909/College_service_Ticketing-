import React, { useState } from 'react';
import "./MyRequests.css";

const MyRequests = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    { id: 1, title: "WiFi Issue", description: "The WiFi is not working in the library.", priority: "High", date: "2025-02-20", status: "In Progress", assignedTo: "IT Department", attachment: "https://via.placeholder.com/150" },
    { id: 2, title: "Projector not working", description: "The projector in Room 101 is not functioning.", priority: "Medium", date: "2025-02-19", status: "Completed", assignedTo: "Tech Support", attachment: "https://via.placeholder.com/150" },
  ];

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetails = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="my-requests-container">
      <h2>My Requests</h2>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Date</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.date}</td>
              <td>{ticket.status}</td>
              <td>{ticket.assignedTo}</td>
              <td>
                <button onClick={() => handleViewDetails(ticket)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedTicket && (
        <div className="ticket-details">
          <h3>Ticket Details</h3>
          <p><strong>Title:</strong> {selectedTicket.title}</p>
          <p><strong>Description:</strong> {selectedTicket.description}</p>
          <p><strong>Priority:</strong> {selectedTicket.priority}</p>
          <p><strong>Date:</strong> {selectedTicket.date}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>
          <p><strong>Assigned To:</strong> {selectedTicket.assignedTo}</p>
          {selectedTicket.attachment && (
            <div>
              <h4>Attachment:</h4>
              <a href={selectedTicket.attachment} download className="download-btn">
                Download Attachment
              </a>
            </div>
          )}
          <button onClick={handleCloseDetails} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
};

export default MyRequests;

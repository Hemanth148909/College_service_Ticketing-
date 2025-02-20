import React, { useState } from "react";

const RaiseRequest = () => {
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [dateTime, setDateTime] = useState("");

  // Simulated user data (Auto-populated)
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!serviceType || !description) {
      setSubmissionStatus("Please fill in all required fields.");
      return;
    }

    // Mock API call or backend integration
    console.log({
      serviceType,
      description,
      priority,
      selectedFile,
      dateTime,
      user: userData,
    });

    setSubmissionStatus("Ticket submitted successfully! ✅");
    setServiceType("");
    setDescription("");
    setPriority("Medium");
    setSelectedFile(null);
    setPreviewURL(null);
    setDateTime("");
  };

  return (
    <div className="raise-request-container">
      <h2>Raise a New Service Request</h2>
      <form onSubmit={handleSubmit} className="request-form">
        {/* User Information */}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={userData.name} disabled />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={userData.email} disabled />
        </div>

        {/* Service Type */}
        <div className="form-group">
          <label>Service Type:</label>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
            <option value="">Select a service</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Networking">Networking</option>
            <option value="Electrical">Electrical</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        {/* Issue Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            required
          />
        </div>

        {/* Priority Selection */}
        <div className="form-group">
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Date & Time Picker (Optional) */}
        <div className="form-group">
          <label>Preferred Date & Time (Optional):</label>
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label>Attach an Image (Optional):</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewURL && <img src={previewURL} alt="Preview" className="image-preview" />}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">Submit Request</button>

        {/* Submission Status Message */}
        {submissionStatus && <p className="status-message">{submissionStatus}</p>}
      </form>
    </div>
  );
};

export default RaiseRequest;

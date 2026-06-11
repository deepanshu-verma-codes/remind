import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/reminders";
const App = () => {
  const [reminder, setReminder] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // const fetchReminders = async () => {
  //   try {
  //     const res = await axios.get(`${API_URL}/`); // Assuming user ID is 1 for testing
  //     setReminder(res.data);
  //   } catch (error) {
  //     console.error("Error fetching reminders:", error);
  //   }
  // };



  const handleSubmit = async () => {
    try {
      const res = await axios.post(API_URL, {
        userId: 1,
        title,
        message,
        scheduledTime,
      });
      setReminder([...reminder, res.data]);
      setTitle("");
      setMessage("");
      setScheduledTime("");
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

   return (
<>
<h1>Reminders Notification App</h1>

<div>
  <label>Title:</label>
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
</div>
<div>
  <label>Message:</label>
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
</div>
<div>
  <label>Scheduled Time:</label>
  <input
    type="datetime-local"
    value={scheduledTime}
    onChange={(e) => setScheduledTime(e.target.value)}
  />
</div>
<div>
<button onClick={handleSubmit}>Create Reminder</button>
</div>
</>
  );
};

export default App;

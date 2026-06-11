const express = require("express");
const router = express.Router();
const {
  createReminder,
  getReminders,
  getUserReminders,
  updateReminder,
  deleteReminder,
  getAllReminders,
  markAsRead,
} = require("../controllers/reminderController");

// Create a new reminder
router.post("/", createReminder);

// Mark as read
router.patch("/:id/read", markAsRead);

// Get all reminders for the authenticated user
router.get("/all", getAllReminders);

// Update a reminder by ID
router.put("/:id", updateReminder);

// Delete a reminder by ID
router.delete("/:id", deleteReminder);

router.get("/user/:userId", getUserReminders);

module.exports = router;

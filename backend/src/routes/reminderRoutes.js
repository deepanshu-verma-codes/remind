const express = require("express");
const router = express.Router();
const {
  createReminder,
  getReminders,
  getUserReminders,
  updateReminder,
  deleteReminder,
  getAllReminders,
} = require("../controllers/reminderController");

// Create a new reminder
router.post("/", createReminder);

// Get all reminders for the authenticated user
router.get("/all", getAllReminders);

// Update a reminder by ID
router.put("/:id", updateReminder);

// Delete a reminder by ID
router.delete("/:id", deleteReminder);

router.get("/user/:userId", getUserReminders);

module.exports = router;

const Reminder = require("../models/Reminder");
const { reminderQueue } = require("../queues/reminderQueue");

exports.createReminder = async (req, res) => {
  try {
    const { userId, title, message, scheduledTime } = req.body;
    const reminder = new Reminder({
      userId,
      title,
      message,
      scheduledTime,
    });
    await reminder.save();

    // Schedule the reminder in the queue
    const delay = new Date(scheduledTime).getTime() - Date.now();
    if (delay > 0) {
      await reminderQueue.add(
        "sendReminder",
        { reminderId: reminder._id },
        { delay, jobId: reminder._id.toString() },
      );
    }

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Failed to create reminder" });
  }
};

exports.updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, scheduledTime } = req.body;
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { title, message, scheduledTime },
      { new: true },
    );
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json(reminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Failed to update reminder" });
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};

exports.getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ userId }).sort({
      scheduledTime: 1,
    });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};

exports.getUserReminders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reminders = await Reminder.find({ userId }).sort({
      scheduledTime: 1,
    });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching user reminders:", error);
    res.status(500).json({ error: "Failed to fetch user reminders" });
  }
};

exports.getAllReminders = async (req, res, next) => {
  console.log("here i am ")
  try {
    const reminders = await Reminder.find().sort({ scheduledTime: 1 });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching all reminders:", error);
    res.status(500).json({ error: "Failed to fetch all reminders" });
  }
};
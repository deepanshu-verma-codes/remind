const Reminder = require("../models/Reminder");
const { reminderQueue } = require("../queues/reminderQueue");

const scheduleNotifications = async (reminder) => {
  const times = [
    { label: "1d", offset: 24 * 60 * 60 * 1000 },
    { label: "30m", offset: 30 * 60 * 1000 },
    { label: "now", offset: 0 },
  ];

  for (const time of times) {
    const scheduledDate = new Date(reminder.scheduledTime).getTime() - time.offset;
    const delay = scheduledDate - Date.now();

    if (delay > 0) {
      await reminderQueue.add(
        "sendReminder",
        { reminderId: reminder._id, type: time.label },
        { 
          delay, 
          jobId: `${reminder._id}_${time.label}`,
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
        },
      );
    }
  }
};

const cancelNotifications = async (reminderId) => {
  const labels = ["1d", "30m", "now"];
  for (const label of labels) {
    const job = await reminderQueue.getJob(`${reminderId}_${label}`);
    if (job) await job.remove();
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { userId, title, message, scheduledTime } = req.body;
    const reminder = new Reminder({ userId, title, message, scheduledTime });
    await reminder.save();

    await scheduleNotifications(reminder);

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
      { title, message, scheduledTime, status: "pending", isRead: false },
      { new: true },
    );

    if (!reminder) return res.status(404).json({ error: "Reminder not found" });

    await cancelNotifications(id);
    await scheduleNotifications(reminder);

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
    if (!reminder) return res.status(404).json({ error: "Reminder not found" });

    await cancelNotifications(id);
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Reminder.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

exports.getReminders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
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
  try {
    // In a production app, this should probably still be scoped or require admin perms
    // For now, I will keep it for compatibility but encourage using scoped routes
    const reminders = await Reminder.find().sort({ scheduledTime: 1 });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching all reminders:", error);
    res.status(500).json({ error: "Failed to fetch all reminders" });
  }
};
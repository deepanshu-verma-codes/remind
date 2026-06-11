const { Worker } = require("bullmq");
const Reminder = require("../models/Reminder");
const { redisConnection } = require("../queues/reminderQueue");

const initReminderWorker = () => {
  const worker = new Worker(
    "reminderQueue",
    async (job) => {
      const { reminderId } = job.data;
      const reminder = await Reminder.findById(reminderId);
      if (!reminder || reminder.status === "triggered") {
        return;
      }

      try {
        console.log(
          `Triggering reminder: ${reminder.title} for user ${reminder.userId}`,
        );
        // Here you would implement the actual notification logic (e.g., send an email or push notification)
        // For demonstration, we will just log the reminder message
        console.log(`Reminder Message: ${reminder.message}`);
        reminder.status = "triggered";
        await reminder.save();
      } catch (error) {
        reminder.status = "failed";
        reminder.retryCount += 1;
        await reminder.save();
        throw error; // Let BullMQ handle the retry logic
        console.error("Error processing reminder:", error);
      }
    },
    { connection: redisConnection, settings: { lockDuration: 30000 } },
  );

  worker.on("completed", (job) =>
    console.log(`Reminder job completed: ${job.id}`),
  );
  worker.on("failed", (job, err) =>
    console.error(`Reminder job failed: ${job.id}`, err),
  );
};

module.exports = initReminderWorker;

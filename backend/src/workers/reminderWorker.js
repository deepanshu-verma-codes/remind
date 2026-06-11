const { Worker } = require("bullmq");
const Reminder = require("../models/Reminder");
const { redisConnection } = require("../queues/reminderQueue");

const initReminderWorker = () => {
  const worker = new Worker(
    "reminderQueue",
    async (job) => {
      const { reminderId, type } = job.data;
      const reminder = await Reminder.findById(reminderId);
      if (!reminder) return;

      try {
        const typeLabels = {
          "1d": "1 Day Before",
          "30m": "30 Minutes Before",
          "now": "FINAL REMINDER",
        };

        const currentType = typeLabels[type] || "Reminder";

        console.log(`[${currentType}] Triggering: ${reminder.title} for user ${reminder.userId}`);
        
        // MOCK EMAIL DELIVERY
        console.log(`[EMAIL MOCK] Sending to user_${reminder.userId}@example.com...`);
        console.log(`Subject: ${currentType}: ${reminder.title}`);
        console.log(`Body: ${reminder.message}`);
        console.log(`-----------------------------------`);

        if (type === "now") {
          reminder.status = "triggered";
          await reminder.save();
        }
      } catch (error) {
        console.error(`Error processing ${type} reminder:`, error);
        throw error;
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

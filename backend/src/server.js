require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const initReminderWorker = require("./workers/reminderWorker");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  // initReminderWorker();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

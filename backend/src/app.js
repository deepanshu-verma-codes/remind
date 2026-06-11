const express = require("express");
const cors = require("cors");
const reminderRoutes = require("./routes/reminderRoutes");


const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/reminders", reminderRoutes);

module.exports = app;

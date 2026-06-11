const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "triggered", "failed"],
      default: "pending",
    },
    jobId: { type: String }, // To store the Bull job ID for reference
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reminder", reminderSchema);

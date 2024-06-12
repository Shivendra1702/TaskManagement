const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed"],
    },
    assignedTo: {
      value: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      label: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };

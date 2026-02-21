const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  done: { type: Boolean, required: false },
});

module.exports = mongoose.model("Task", taskSchema);

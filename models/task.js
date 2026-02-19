const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({ title: String, done: Boolean });

module.exports = mongoose.model("Task", taskSchema);

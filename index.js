require("dotenv").config;
const express = require("express");
const morgan = require("morgan");

const app = express();
const taskRoutes = require("./routes/tasks");

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Task API is running");
});

app.use("/api/tasks", taskRoutes);

//unknown endpoint handler
app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

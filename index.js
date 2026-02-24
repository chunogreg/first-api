require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const config = require("./utils/config");
//require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(config.MONGODB_URI)
  //.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error: ", error.message);
  });

const express = require("express");
const morgan = require("morgan");

const app = express();
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Task API is running");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

//unknown endpoint handler
app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

const unknownEndpiont = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  // console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid Id format" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
  //res.status(500).json({ error: "something went wrong" });
};

app.use(unknownEndpiont);
app.use(errorHandler);

const PORT = config.PORT;
//const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

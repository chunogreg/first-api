require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error: ", error.message);
  });

require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const express = require("express");
const morgan = require("morgan");

const app = express();
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/authRoutes");

app.use(express.json({ limit: "1000kb" }));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  //   morgan(
  //     ":method :url :status :res[content-length] - :response-time ms :remote-addr",
  //   ),
  // );

  morgan(":method :url :status :response-time ms - :body"),
);

app.use((req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(" ⚠️ suspicious request detected: ", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
      });
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.on("finish", () => {
//     if (res.statusCode > 400) {
//       console.log("suspicious transaction", {
//         ip: req.ip,
//         method: req.method,
//         url:req.originalUrl,
//         staus: req.statusCode,
//       });
//     }
//   });
//   next()
// });

app.use(helmet());
app.use(cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(limiter);

//app.get("/another-test", async (req, res) => {
//throw new Error("Test error");
//res.send("Task API is running");
//});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

//unknown endpoint handler
app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // app.listen(3000, () => {
  //   console.log("Server running on port 3000");
  // });
});

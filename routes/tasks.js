const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.done !== undefined) {
      filter.done = req.query.done === "true";
    }
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "task not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, done: req.body.done },
      { returnDocument: "after" },
    );
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: "task not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({
        message: "Task deleted successfully",
      });
    } else {
      res.status(404).json({ error: "data not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const task = new Task({
      title: req.body.title,
      done: false,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const fs = require("fs");

// const dataPath = "./data/tasks.json";

// //helper function to read tasks
// const getTasks = () => {
//   const data = fs.readFileSync(dataPath);
//   return JSON.parse(data);
// };

// //helper function to save data
// const saveTasks = (tasks) => {
//   fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
// };

// router.get("/", (req, res) => {
//   const tasks = getTasks();
//   res.json(tasks);
// });

// router.post("/", (req, res) => {
//   const tasks = getTasks();

//   const newTask = {
//     id: tasks.length + 1,
//     title: req.body.title,
//     done: false,
//   };

//   tasks.push(newTask);
//   saveTasks(tasks);
//   res.json(newTask);
// });

// module.exports = router;

// // const express = require("express");
// // const router = express.Router();

// // let tasks = [
// //   { id: 1, title: "Learn Node.js", done: false },
// //   { id: 2, title: "Build first API", done: false }
// // ];

// // router.get("/", (req, res) => {
// //   res.json(tasks);
// // });

// // router.post("/", (req, res) => {
// //   const newTask = {
// //     id: tasks.length + 1,
// //     title: req.body.title,
// //     done: false
// //   };

// //   tasks.push(newTask);
// //   res.json(newTask);
// // });

// // module.exports = router;

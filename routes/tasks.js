const express = require("express");
const router = express.Router();
const fs = require("fs");

const dataPath = "./data/tasks.json";

//helper function to read tasks
const getTasks = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

//helper function to save data
const saveTasks = (tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
};

router.get("/", (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

router.post("/", (req, res) => {
  const tasks = getTasks();

  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    done: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

module.exports = router;

// const express = require("express");
// const router = express.Router();

// let tasks = [
//   { id: 1, title: "Learn Node.js", done: false },
//   { id: 2, title: "Build first API", done: false }
// ];

// router.get("/", (req, res) => {
//   res.json(tasks);
// });

// router.post("/", (req, res) => {
//   const newTask = {
//     id: tasks.length + 1,
//     title: req.body.title,
//     done: false
//   };

//   tasks.push(newTask);
//   res.json(newTask);
// });

// module.exports = router;

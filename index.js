const express = require("express");
const app = express();

const taskRoutes = require("./routes/tasks");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Task API is running");
});

app.use("/api/tasks", taskRoutes);


//let tasks = [{id : 1, title: "learn Nodejs", done:false}, {id : 2, title: "Build first API", done:false} ];

//app.get("/api/tasks", (req, res)=>{ 
 // res.end(JSON.stringify(tasks, null, 2));
//})

//app.post("/api/tasks", (req, res)=>{
  //const newTask = { id: tasks.length+1, title: req.body.title , done: false};
  
//tasks.push(newTask);
//res.json(newTask);
//});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
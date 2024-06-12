const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("./models/User");
const { Task } = require("./models/Task");

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/api/user/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, "secret", {
      expiresIn: "24h",
    });

    res
      .status(201)

      .json({
        message: "User registered successfully",
        user: user,
        ok: true,
        token: token,
      });
  } catch (error) {
    console.log("error in register");
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", ok: false });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", ok: false });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, "secret", {
      expiresIn: "24h",
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", ok: true, token });
  } catch (error) {
    console.log("error in login");
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log("error in get users");
  }
});

app.get("/api/user/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, "secret");

    const user = await User.findById(decoded.userId);

    res.status(200).json(user);
  } catch (error) {
    console.log("error in get user by id");
  }
});

app.post("/api/task/create", async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, priority } = req.body;

    if (!title || !description || !dueDate || !assignedTo || !priority) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      priority,
    });

    res
      .status(201)
      .json({ message: "Task created successfully", ok: true, task });
  } catch (error) {
    console.log("Error creating task");
  }
});

//we want to show all tasks only to the admin , and only the tasks assigned to the user to the user
app.get("/api/tasks", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, "secret");

    const user = await User.findById(decoded.userId);

    let tasks;

    if (user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ "assignedTo.value": user._id });
    }
    
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("error fetching tasks");
  }
});

app.put("/api/task/update/:id", async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, priority, status } =
      req.body;
    const taskId = req.params.id;

    if (!title || !description || !dueDate || !assignedTo || !priority) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const task = await Task.findByIdAndUpdate(taskId, {
      status: status || "pending",
      title,
      description,
      dueDate,
      assignedTo,
      priority,
    });

    res
      .status(200)
      .json({ message: "Task updated successfully", ok: true, task });
  } catch (error) {
    console.log("error updating task");
  }
});

app.delete("/api/task/delete/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(taskId);
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully", ok: true });
  } catch (error) {
    console.log("error deleting task");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

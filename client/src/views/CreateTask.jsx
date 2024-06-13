import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");

  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assignedTo || !priority) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/api/task/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          assignedTo,
          priority,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        handleReset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error in create task");
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedTo("");
    setPriority("");
  };

  useEffect(() => {
    try {
      const getUsers = async () => {
        const response = await fetch("http://127.0.0.1:5000/api/user");
        const data = await response.json();

        const userOptions = data
          .filter((user) => user.role === "user")
          .map((user) => {
            return { value: user._id, label: user.username };
          });

        setUsers(userOptions);
      };
      getUsers();
    } catch (error) {
      console.log("error in get users");
    }
  }, []);

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="main">
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <br />
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="selectContainer">
          <div>
            <label htmlFor="">Select Priority:</label>
            <br />
            <Dropdown
              options={priorityOptions}
              onChange={(e) => setPriority(e.value)}
              value={priority}
              placeholder="Select an option"
              className="dropdown"
            />
          </div>
          <div>
            <label htmlFor="">Assign to: </label>
            <br />
            <Dropdown
              options={users}
              onChange={(e) => setAssignedTo(e)}
              value={assignedTo}
              placeholder="Select an User"
              className="dropdown"
            />
          </div>
        </div>
        <div className="buttonContainer">
          <button type="submit">Create Task</button>
          <button onClick={handleReset}>Reset</button>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Back
          </button>
        </div>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default CreateTask;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import toast, { Toaster } from "react-hot-toast";

const ViewUpdateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(location.state?.task?.title || "");
  const [description, setDescription] = useState(
    location.state?.task?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    location.state?.task?.dueDate.substring(0, 10) || ""
  );
  const [priority, setPriority] = useState(
    location.state?.task?.priority || ""
  );
  const [assignedTo, setAssignedTo] = useState(
    location.state?.task?.assignedTo || ""
  );
  const [users, setUsers] = useState([]);

  const taskId = useParams().id;

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setAssignedTo("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !priority || !assignedTo) {
      toast.error("Please fill all the fields");
      return;
    }
    if (
      title === location.state?.task?.title &&
      description === location.state?.task?.description &&
      dueDate === location.state?.task?.dueDate.substring(0, 10) &&
      priority === location.state?.task?.priority &&
      assignedTo === location.state?.task?.assignedTo
    ) {
      toast.error("No changes made to the task");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/task/update/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.ok) {
        toast.success(data.message);
        handleReset();
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.log("error updating task");
    }
  };

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="main">
      <h1>Task Details</h1>
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
            placeholder="Enter Task Title"
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
          <button type="submit">Update Task</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleReset();
            }}
          >
            Reset
          </button>
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

export default ViewUpdateTask;

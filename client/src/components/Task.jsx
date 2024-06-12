import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllTasks } from "../reducers/TasksReducer";

const Task = ({ task }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [showDialog, setShowDialog] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleStatusUpdate = async (currStatus) => {
    const newStatus = currStatus == "pending" ? "completed" : "pending";
    const response = await fetch(
      `http://127.0.0.1:5000/api/task/update/${task._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          assignedTo: task.assignedTo,
        }),
      }
    );
    const data = await response.json();
    if (data.ok) {
      toast.success(data.message);
      dispatch(fetchAllTasks());
    }
  };

  const handleTaskDeletion = async (taskId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/task/delete/${taskId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.ok) {
        toast.success(data.message);
        dispatch(fetchAllTasks());
      }
    } catch (error) {
      console.log("error deleting task");
    }
  };

  return (
    <>
      <div className="task">
        <div className="taskDetail">
          <span>
            {task.title.length > 20
              ? task.title.substring(0, 20) + "..."
              : task.title}
          </span>
          <span>
            {new Date(task.dueDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
          <span>{task.status == "pending" ? "Pending" : "Completed"}</span>
        </div>
        <div className="optionButtonContainer">
          <button onClick={() => setShowOptions(!showOptions)}>options</button>
        </div>
        {showOptions && (
          <div className="options">
            <span
              onClick={() => {
                handleStatusUpdate(task.status);
                setShowOptions(false);
              }}
            >
              {task.status == "pending"
                ? "Mark as Completed"
                : "Mark as Pending"}
            </span>
            {user.role == "admin" && (
              <>
                <span
                  onClick={() =>
                    navigate(`/task/${task._id}`, {
                      state: { task },
                    })
                  }
                >
                  Details / Update
                </span>

                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDialog(true);
                    setShowOptions(false);
                  }}
                >
                  Delete
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {showDialog && (
        <div className="dailogPage">
          <div className="dialogBox">
            <h2 className="dialogHeader">
              Do You Really Want To Delete This Task ?
            </h2>
            <div className="buttonContainer">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setShowOptions(false);
                }}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  handleTaskDeletion(task._id);
                  setShowDialog(false);
                  setShowOptions(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Task;

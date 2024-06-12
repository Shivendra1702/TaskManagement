import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Task from "../components/Task";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../reducers/TasksReducer";
import { fetchUserDetails } from "../reducers/UserReducer";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state.user.user);

  const handleLogOut = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    dispatch(fetchAllTasks());
    dispatch(fetchUserDetails());
  }, []);

  return (
    <div className="home">
      <div className="header">
        <h1>Tasks</h1>
        <div className="buttonContainer">
          <div className="userNameContainer">
            <span>Welcome {user?.username} 👋</span>
          </div>
          <button onClick={handleLogOut}>LogOut</button>
          {user.role == "admin" ? (
            <button onClick={() => navigate("/create")}>Create Task</button>
          ) : null}
        </div>
      </div>
      <div className="tasks">
        <div className="hp p">
          <h1>High Priority</h1>
          <div className="taskContainer">
            {tasks.filter((task) => task.priority === "high").length > 0 ? (
              tasks
                .filter((task) => task.priority === "high")
                .map((task) => <Task task={task} key={task._id} />)
            ) : (
              <span>No Tasks in This Category !!</span>
            )}
          </div>
        </div>

        <div className="mp p">
          <h1>Medium Priority</h1>
          <div className="taskContainer">
            {tasks.filter((task) => task.priority === "medium").length > 0 ? (
              tasks
                .filter((task) => task.priority === "medium")
                .map((task) => <Task task={task} key={task._id} />)
            ) : (
              <span>No Tasks in This Category !!</span>
            )}
          </div>
        </div>

        <div className="lp p">
          <h1>Low Priority</h1>
          <div className="taskContainer">
            {tasks.filter((task) => task.priority === "low").length > 0 ? (
              tasks
                .filter((task) => task.priority === "low")
                .map((task) => <Task task={task} key={task._id} />)
            ) : (
              <span>No Tasks in This Category !!</span>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Home;

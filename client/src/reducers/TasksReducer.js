import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = tasksSlice.actions;

export const fetchAllTasks = () => async (dispatch) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    dispatch(setTasks(data));
  } catch (error) {
    console.log("error fetching tasks");
  }
};

export default tasksSlice.reducer;

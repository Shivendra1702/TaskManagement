import { configureStore, combineReducers } from "@reduxjs/toolkit";
import TasksReducer from "./reducers/TasksReducer";
import UserReducer from "./reducers/UserReducer";

const rootReducer = combineReducers({
  tasks: TasksReducer,
  user: UserReducer,
});

export default configureStore({
  reducer: rootReducer,
});

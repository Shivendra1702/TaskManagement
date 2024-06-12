import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CreateTask,
  Home,
  Login,
  Register,
  ViewUpdateTask,
} from "./views";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/task/:id" element={<ViewUpdateTask />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

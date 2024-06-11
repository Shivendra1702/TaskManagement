import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CreateTask,
  Home,
  Login,
  Register,
  SpecificTask,
  UpdateTask,
} from "./views";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/update/:id" element={<UpdateTask />} />
          <Route path="/:id" element={<SpecificTask />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

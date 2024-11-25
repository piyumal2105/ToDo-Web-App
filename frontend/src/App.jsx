// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ToDo from "./pages/todo.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<ToDo />} />
      </Routes>
    </Router>
  );
}

export default App;

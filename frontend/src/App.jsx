import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { Dashboard } from "./components/Dashboard";
import { Feed } from "./components/Feed.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
}

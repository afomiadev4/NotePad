import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

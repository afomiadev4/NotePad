import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import { Folders } from "./components/Folders";
import { Feed } from "./components/Feed";
import { AccountPage } from "./components/AccountPage";
import { CreateNote } from "./components/CreateNote";
import Dashboard from "./components/DashBoard";
import { EditNote } from "./components/EditComponent";
import { SavedNotes } from "./components/SavedNotes";
import 'react-quill-new/dist/quill.snow.css';
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Logic to apply the saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, []);

  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:folderId" element={<Folders />} />
        <Route path="/saved" element={<SavedNotes />} />

        <Route path="/create-note" element={<CreateNote />} />

        <Route path="/edit/:id" element={<EditNote />} />
        <Route path="/notes/:noteId" element={<EditNote />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
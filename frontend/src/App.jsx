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
import "react-quill-new/dist/quill.snow.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import ResetPassword from "./components/reset-password";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/folders/:folderId" element={<Folders />} />
          <Route path="/saved" element={<SavedNotes />} />

          {/* Only one route needed now for creating notes */}
          <Route path="/create-note" element={<CreateNote />} />

          <Route path="/edit/:id" element={<EditNote />} />
          <Route path="/notes/:noteId" element={<EditNote />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

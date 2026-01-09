import { Routes, Route, Navigate } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import { Folders } from "./components/Folders";
import { Feed } from "./components/Feed";
import { AccountPage } from "./components/AccountPage";
import { CreateNote } from "./components/CreateNote";
import Dashboard from "./components/Dashboard"; // match the filename
import { EditNote } from "./components/EditComponent";
import { NotificationsSettings } from "./components/NotificationsSettings";

import { SavedNotes } from "./components/SavedNotes";
import 'react-quill-new/dist/quill.snow.css';


import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/saved" element={<SavedNotes />} />
      <Route path="/edit/:id" element={<EditNote />} />

      <Route path="/settings/notifications" element={<NotificationsSettings />} />
      

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard - Main entry point after login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Folders & Specific Folder View */}
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:folderId" element={<Folders />} />

        {/* Feed - Community Posts */}
        <Route path="/feed" element={<Feed />} />

        {/* Note Management */}
        <Route
          path="/add-note"
          element={<CreateNote defaultFolder="uncategorized" hideFolderSelection={false} />}
        />
        <Route
          path="/post-note"
          element={<CreateNote defaultFolder="posted" hideFolderSelection={true} isPost={true} />}
        />
        <Route path="/notes/:noteId" element={<EditNote />} />

        {/* User Settings */}
        <Route path="/account" element={<AccountPage />} />
      </Route>

      {/* Catch-all: Redirect unknown routes to Welcome or Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
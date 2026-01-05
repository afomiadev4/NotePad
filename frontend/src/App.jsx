import { Routes, Route } from "react-router-dom";
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
import { PrivacySettings } from "./components/PrivacySettings";


import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/settings/notifications" element={<NotificationsSettings />} />
      <Route path="/settings/privacy" element={<PrivacySettings />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:folderId" element={<Folders />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/add-note"
          element={<CreateNote defaultFolder="uncategorized" hideFolder={false} />}
        />
        <Route
          path="/post-note"
          element={<CreateNote defaultFolder="posted" hideFolder={true} isPost={true} />}
        />
        <Route path="/notes/:noteId" element={<EditNote/>} />

        <Route path="/account" element={<AccountPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

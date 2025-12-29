import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { Folders } from "./components/Folders.jsx";
import { Feed } from "./components/Feed.jsx";
import { AccountPage } from "./components/AccountPage.jsx";
import { CreateNote } from "./components/CreateNote.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/folders" element={<Folders />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/add-note"
          element={
            <CreateNote defaultFolder="uncategorized" hideFolder={false} />
          }
        />
        <Route
          path="/post-note"
          element={<CreateNote defaultFolder="posted" hideFolder={true} />}
        />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

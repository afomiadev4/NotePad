import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { Folders } from "./components/Folders.jsx";
import { Feed } from "./components/Feed.jsx";
import { AccountPage } from "./components/AccountPage.jsx";
import { CreateNote } from "./components/CreateNote.jsx";
import DashBoard from "./components/DashBoard.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/dashboard" element={<DashBoard />} />
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
      </Routes>
    </div>
  );
}

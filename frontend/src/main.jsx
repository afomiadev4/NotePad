import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./Context/UserContext.jsx";
import { NoteProvider } from "./Context/NoteContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <NoteProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </NoteProvider>
    </UserProvider>
  </BrowserRouter>
);

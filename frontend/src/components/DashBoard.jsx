import React from "react";
import EmptyNote from "../pages/EmptyNote";
import ALLNotes from "../pages/AllNotes";
import MenuIcon from "./MenuIcon";
import { useContext } from "react";
import { NoteContext } from "../Context/NoteContext";
import { Navigation } from "./Navigation";

const DashBoard = () => {
  const userString = localStorage.getItem("userLoggedIn");
  const currentUser = userString ? JSON.parse(userString) : null;
  const { notes } = useContext(NoteContext);
  const userNotes = notes.filter((note) => note.userId === currentUser?.id);

  return (
    <div>
      <div className="flex flex-row  bg-(--bg-primary) items-center text-white justify-between p-4">
        <MenuIcon />
        <h2>NotePad+</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      {userNotes.length === 0 ? <EmptyNote /> : <ALLNotes />}
      <Navigation />
    </div>
  );
};

export default DashBoard;

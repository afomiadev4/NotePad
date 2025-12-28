import React from "react";
import { useContext, useState } from "react";
import { NoteContext } from "../Context/NoteContext";
import { EditNote } from "../components/EditComponent";

const NoteCard = ({ note, onEdit }) => {
  const { deleteNote } = useContext(NoteContext);
  const [showMenu, setShowMenu] = useState(false);
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
      setShowMenu(false);
    }
  };
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
      >
        <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>

          <div className="absolute bottom-10 right-0 z-20 w-32 py-2 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-400 hover:bg-white/5 transition-colors"
            >
              <i className="fa-solid fa-pen text-xs"></i> Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
            >
              <i className="fa-solid fa-trash text-xs"></i> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ALLNotes = () => {
  const userString = localStorage.getItem("userLoggedIn");
  const currentUser = userString ? JSON.parse(userString) : null;
  const { notes } = useContext(NoteContext);
  const [editingNote, setEditingNote] = useState(null);

  const userNotes = notes.filter((note) => note.userId === currentUser?.id);
  if (userNotes.length === 0) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-white bg-(--bg-primary) p-4 rounded-xl">
          You don't have any notes to display.
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-5 bg-(--bg-primary) min-h-screen ">
      {userNotes.map((note) => (
        <div
          key={note.id}
          className="w-full rounded-xl shadow-md bg-white/5 border border-white/10 hover:shadow-lg transition p-5 space-y-3 cursor-pointer h-fit"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100 truncate pr-2">
              {note.title}
            </h2>
            <li className="text-xs w-10 px-2 py-1 rounded-full bg-blue-100 text-blue-600">
              {note.category} work
            </li>
          </div>

          <p className="text-sm text-gray-300 line-clamp-3">{note.content}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
            <span>{note.time || "Recently"}</span>
            <div className="flex flex-row items-center gap-4">
              <span className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer">
                Read more
              </span>
              <NoteCard note={note} onEdit={() => setEditingNote(note)} />
            </div>
          </div>
        </div>
      ))}
      {editingNote && (
        <EditNote
          note={editingNote}
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};

export default ALLNotes;

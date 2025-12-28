import { useEffect, createContext, useState } from "react";
export const NoteContext = createContext();
export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const renderAllNotes = async () => {
    let res = await fetch("http://localhost:3000/notes");
    let data = await res.json();
    setNotes(data);
  };
  useEffect(() => {
    renderAllNotes();
  }, []);
  const createNote = async (newNote) => {
    let res = await fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    if (!res.ok) throw new Error("note not created");
    renderAllNotes();
    alert("Note created Successfully");
  };
  const editNote = async ({ noteId, editNote }) => {
    let res = await fetch(`http://localhost:3000/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editNote),
    });
    try {
      if (res.ok) {
        const updatedNote = await res.json();
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === noteId ? updatedNote : n))
        );
        renderAllNotes();
      } else {
        alert("Failed to delete the note from the server.");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  const deleteNote = async (noteId) => {
    let res = await fetch(`http://localhost:3000/notes/${noteId}`, {
      method: "DELETE",
    });
    try {
      if (res.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        renderAllNotes();
      } else {
        alert("Failed to delete the note from the server.");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, createNote, deleteNote, editNote }}>
      {children}
    </NoteContext.Provider>
  );
};

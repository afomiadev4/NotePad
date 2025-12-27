import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";

export function Feed() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  const fetchNotes = () => {
    setLoading(true);
    fetch("http://localhost:3000/notes?folderId=posted")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEdit = (note) => {
    setSelectedNote(note);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleView = (note) => {
    setSelectedNote(note);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleSave = (updatedNote) => {
    fetch(`http://localhost:3000/notes/${updatedNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => {
        if (res.ok) {
          setIsModalOpen(false);
          fetchNotes(); // Refresh list
        } else {
          alert("Failed to update note.");
        }
      })
      .catch((err) => {
        console.error("Error updating note:", err);
        alert("An error occurred.");
      });
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) font-display flex">
      <Navigation />
      <main className="flex-1 flex flex-col gap-4 p-4 lg:ml-64 justfy-center">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--btn-primary) border-t-transparent"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-8 bg-(--bg-secondary) rounded-2xl border border-dashed border-white/20">
            <i className="fa-regular fa-note-sticky text-4xl text-slate-500 mb-4"></i>
            <p className="text-xl font-medium text-slate-400">No notes found</p>
            <p className="text-sm text-slate-500 mt-2">
              Start by creating a new note!
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col rounded-xl bg-(--bg-secondary) border border-white/5 hover:border-white/10 transition"
            >
              <div className="flex flex-col p-5">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center border border-white/10"
                      style={{ backgroundImage: `url(${note.avatar})` }}
                    ></div>
                    <div>
                      <p className="text-base font-medium leading-none">
                        {note.user}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{note.time}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold leading-tight tracking-tight">
                    {note.title}
                  </h2>
                  <p className="mt-2 text-base font-normal leading-relaxed text-slate-400 line-clamp-3">
                    {note.content}
                  </p>
                </div>
              </div>

              {/* Actions bar */}
              <div className="border-t border-white/5 p-2 bg-black/10 rounded-b-xl flex items-center justify-between w-full">
                <div className="flex gap-2 w-full">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-red-400 transition text-xs cursor-pointer">
                    <i className="fa-regular fa-heart"></i>
                    Like
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-blue-400 transition text-xs cursor-pointer">
                    <i className="fa-regular fa-comment"></i>
                    Comment
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-green-400 transition text-xs cursor-pointer">
                    <i className="fa-regular fa-bookmark"></i>
                    Save
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-xs text-slate-400 ml-auto cursor-pointer">
                    <i className="fa-solid fa-share"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

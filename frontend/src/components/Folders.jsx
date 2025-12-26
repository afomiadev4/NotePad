import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";
import { FolderModal } from "./FolderModal";

export function Folders() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Modal state
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  // Folder Modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:3000/folders").then((res) => res.json()),
      fetch("http://localhost:3000/notes").then((res) => res.json()),
    ])
      .then(([foldersData, notesData]) => {
        setFolders(foldersData);
        setNotes(notesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNoteCount = (folderId) => {
    return notes.filter((note) => note.folderId === folderId).length;
  };

  const folderNotes = selectedFolder
    ? notes.filter((n) => n.folderId === selectedFolder.id)
    : [];

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
          fetchData(); // Refresh data
        } else {
          alert("Failed to update note.");
        }
      })
      .catch((err) => {
        console.error("Error updating note:", err);
        alert("An error occurred.");
      });
  };

  const handleCreateFolder = (newFolder) => {
    fetch("http://localhost:3000/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFolder),
    })
      .then((res) => {
        if (res.ok) {
          setIsFolderModalOpen(false);
          fetchData(); // Refresh list
        } else {
          alert("Failed to create folder.");
        }
      })
      .catch((err) => {
        console.error("Error creating folder:", err);
        alert("An error occurred.");
      });
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex box-border">
      <Navigation />
      <div className="flex-1 min-h-screen box-border lg:ml-64">
        <div className="min-h-screen bg-[--bg-primary] text-white p-4 md:p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedFolder && (
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="p-2 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white"
                >
                  <i className="fa-solid fa-arrow-left text-xl"></i>
                </button>
              )}
              <h1 className="text-2xl md:text-3xl font-bold">
                {selectedFolder ? selectedFolder.name : "My Folders"}
              </h1>
            </div>

            {!selectedFolder && (
              <button
                onClick={() => setIsFolderModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-(--btn-primary) px-4 py-2
                       text-sm font-semibold text-white hover:bg-blue-600 transition cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <i className="fa-solid fa-folder-plus"></i>
                Add New Folder
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--btn-primary) border-t-transparent"></div>
            </div>
          ) : !selectedFolder ? (
            /* Folders Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4
                            hover:bg-white/10 transition cursor-pointer h-32"
                >
                  <div className="flex items-center justify-between mb-4">
                    <i
                      className={`fa-solid ${folder.icon} text-3xl ${folder.color}`}
                    ></i>
                    <i className="fa-solid fa-ellipsis-vertical text-white/60 opacity-0 group-hover:opacity-100 transition"></i>
                  </div>

                  <h3 className="font-semibold truncate">{folder.name}</h3>
                  <p className="text-xs text-white/60 mt-1">
                    {getNoteCount(folder.id)} notes
                  </p>
                </div>
              ))}

              <div
                onClick={() => setIsFolderModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl
                       border border-dashed border-white/20 bg-white/5
                       hover:bg-white/10 cursor-pointer h-32 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-plus text-xl text-white/60"></i>
                <span className="text-sm text-white/60">Add Folder</span>
              </div>
            </div>
          ) : (
            /* Notes Dashboard within selected folder */
            <div className="flex flex-col gap-4">
              {folderNotes.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/20">
                  <i className="fa-regular fa-note-sticky text-4xl text-slate-500 mb-4"></i>
                  <p className="text-xl font-medium text-slate-400">
                    No notes in this folder
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folderNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-(--bg-secondary) rounded-2xl border border-white/5 p-5 hover:border-white/10 transition group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold truncate">
                          {note.title}
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleView(note)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                          >
                            <i className="fa-regular fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEdit(note)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-blue-400"
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                        {note.content}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        ID: {note.id} • {note.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

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

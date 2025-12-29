import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";
import { FolderModal } from "./FolderModal";

export function Folders() {
  const { folderId } = useParams();
  const navigate = useNavigate();
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
  const [folderToEdit, setFolderToEdit] = useState(null);

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

  useEffect(() => {
    if (folderId && folders.length > 0) {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
      }
    } else if (!folderId) {
      setSelectedFolder(null);
    }
  }, [folderId, folders]);

  const handleFolderClick = (folder) => {
    navigate(`/folders/${folder.id}`);
  };

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
    if (modalMode === "create") {
      const freshNote = {
        ...updatedNote,
        user: "John Doe", // Mock current user
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBxnMVuj5nEyLEn0WopcnfrvaGHqG9U4hVQA_LuhtYILWOqY644_1X1nAIRl43W12_D9BGhW5Et67QTPIArWvDPBtpzPvOrVtXnBdIDqZaPEo9axzID04FmubeoSu1YcRu0OfNTCl9vHEFKBNKhUmNeLoVoRak71naeZW9ZnDWV_L7cQR3H87WdeTnv_G5Etzu13RjBJrrnEsl3juANvYFAHad_Zcv9LYSWSEgGOS0mQxWgdCLF8GM9PA7QyArxgXBhtXGwmGdoO81Z",
        time: "Just now",
        createdAt: new Date().toISOString(),
      };

      fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(freshNote),
      })
        .then((res) => {
          if (res.ok) {
            setIsModalOpen(false);
            fetchData();
          } else {
            alert("Failed to create note.");
          }
        })
        .catch((err) => {
          console.error("Error creating note:", err);
          alert("An error occurred.");
        });
      return;
    }

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

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      fetch(`http://localhost:3000/notes/${noteId}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            fetchData();
          } else {
            alert("Failed to delete note.");
          }
        })
        .catch((err) => {
          console.error("Error deleting note:", err);
          alert("An error occurred.");
        });
    }
  };

  const handleAddNewNote = () => {
    setSelectedNote(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCreateFolder = (newFolder) => {
    const isUpdate = !!folderToEdit;
    const url = isUpdate
      ? `http://localhost:3000/folders/${folderToEdit.id}`
      : "http://localhost:3000/folders";
    const method = isUpdate ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFolder),
    })
      .then((res) => {
        if (res.ok) {
          setIsFolderModalOpen(false);
          setFolderToEdit(null);
          fetchData(); // Refresh list
        } else {
          alert(`Failed to ${isUpdate ? "update" : "create"} folder.`);
        }
      })
      .catch((err) => {
        console.error(
          `Error ${isUpdate ? "updating" : "creating"} folder:`,
          err
        );
        alert("An error occurred.");
      });
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setFolderToEdit(folder);
    setIsFolderModalOpen(true);
  };

  const handleDeleteFolder = (e, folderIdToDelete) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this folder and all its notes?"
      )
    ) {
      const folderNotesToDelete = notes.filter(
        (n) => n.folderId === folderIdToDelete
      );

      const deleteNotesPromises = folderNotesToDelete.map((note) =>
        fetch(`http://localhost:3000/notes/${note.id}`, { method: "DELETE" })
      );

      Promise.all(deleteNotesPromises)
        .then(() =>
          fetch(`http://localhost:3000/folders/${folderIdToDelete}`, {
            method: "DELETE",
          })
        )
        .then((res) => {
          if (res.ok) {
            fetchData();
            if (folderIdToDelete === folderId) {
              navigate("/folders");
            }
          } else {
            alert("Failed to delete folder.");
          }
        })
        .catch((err) => {
          console.error("Error deleting folder/notes:", err);
          alert("An error occurred during deletion.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex box-border">
      <Navigation />
      <div className="flex-1 min-h-screen box-border lg:ml-64 flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Sub-Sidebar for Folders (Only shown when a folder is selected) */}
          {selectedFolder && (
            <div className="w-45 flex md:w-64 border-r border-white/10 flex-col bg-white/5 overflow-y-auto pt-8">
              <div className="px-6 mb-6">
                <h2 className="text-white/40 text-xs font-bold uppercase tracking-wider">
                  Folders
                </h2>
              </div>
              <div className="flex flex-col gap-1 px-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left
                      ${
                        selectedFolder.id === folder.id
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <i
                      className={`fa-solid ${folder.icon} text-lg ${folder.color}`}
                    ></i>
                    <span className="font-medium text-sm truncate">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setFolderToEdit(null);
                  setIsFolderModalOpen(true);
                }}
                className="mt-4 mx-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 transition text-sm"
              >
                <i className="fa-solid fa-plus"></i>
                New Folder
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedFolder && (
                  <button
                    onClick={() => navigate("/folders")}
                    className="p-2 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white"
                  >
                    <i className="fa-solid fa-arrow-left text-xl"></i>
                  </button>
                )}
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedFolder ? selectedFolder.name : "My Folders"}
                </h1>
              </div>

              {!selectedFolder ? (
                <button
                  onClick={() => {
                    setFolderToEdit(null);
                    setIsFolderModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-(--btn-primary) px-4 py-2
                         text-sm font-semibold text-white hover:bg-blue-600 transition cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <i className="fa-solid fa-folder-plus"></i>
                  Add New Folder
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleEditFolder(e, selectedFolder)}
                    className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2
                           text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer active:scale-95"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit Folder
                  </button>
                  <button
                    onClick={(e) => handleDeleteFolder(e, selectedFolder.id)}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2
                           text-sm font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer active:scale-95"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    Delete Folder
                  </button>
                  <button
                    onClick={handleAddNewNote}
                    className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2
                           text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer active:scale-95"
                  >
                    <i className="fa-solid fa-plus"></i>
                    New Note
                  </button>
                </div>
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
                    onClick={() => handleFolderClick(folder)}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4
                              hover:bg-white/10 transition cursor-pointer h-32"
                  >
                    <div className="flex items-center justify-between mb-4 text-blue-400">
                      <i
                        className={`fa-solid ${folder.icon} text-3xl ${folder.color}`}
                      ></i>
                      <div className="flex gap-2 transition">
                        <button
                          onClick={(e) => handleEditFolder(e, folder)}
                          className="p-1 px-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                        >
                          <i className="fa-solid fa-pen-to-square text-sm"></i>
                        </button>
                        <button
                          onClick={(e) => handleDeleteFolder(e, folder.id)}
                          className="p-1 px-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold truncate">{folder.name}</h3>
                    <p className="text-xs text-white/60 mt-1">
                      {getNoteCount(folder.id)} notes
                    </p>
                  </div>
                ))}

                <div
                  onClick={() => {
                    setFolderToEdit(null);
                    setIsFolderModalOpen(true);
                  }}
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
                        onClick={() => handleView(note)}
                        className="bg-(--bg-secondary) rounded-2xl border border-white/5 p-5 hover:border-white/10 transition group cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold truncate">
                            {note.title}
                          </h3>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(note);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-blue-400"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={(e) => handleDeleteNote(e, note.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                            >
                              <i className="fa-regular fa-trash-can"></i>
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
      </div>

      <FolderModal
        isOpen={isFolderModalOpen}
        folder={folderToEdit}
        onClose={() => {
          setIsFolderModalOpen(false);
          setFolderToEdit(null);
        }}
        onCreate={handleCreateFolder}
      />

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        mode={modalMode}
        freezeSelection={true}
        initialFolderId={selectedFolder?.id}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

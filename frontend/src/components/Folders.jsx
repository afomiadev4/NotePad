import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";
import { FolderModal } from "./FolderModal";
import { supabase } from "../supabaseClient"; 
import { useSelector } from "react-redux";

export function Folders() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Modal states
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  // Folder Modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Folders and Notes for the logged-in user
      const [foldersRes, notesRes] = await Promise.all([
        supabase.from("folders").select("*").eq("user_id", user.id),
        supabase.from("notes").select("*").eq("user_id", user.id),
      ]);

      let foldersData = foldersRes.data || [];
      const notesData = notesRes.data || [];

      // 2. Logic for Uncategorized (SRS Requirement)
      const hasUncategorizedNotes = notesData.some(
        (note) => note.folder_id === null || note.folder_id === "uncategorized"
      );

      const hasUncategorizedFolder = foldersData.some(
        (folder) => folder.id === "uncategorized"
      );

      // If notes exist without a folder, show the system "Uncategorized" folder
      if (hasUncategorizedNotes && !hasUncategorizedFolder) {
        foldersData.push({
          id: "uncategorized",
          name: "Uncategorized",
          icon: "fa-folder-open",
          color: "text-slate-400",
          type: "system",
        });
      }

      setFolders(foldersData);
      setNotes(notesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (folderId && folders.length > 0) {
      const folder = folders.find((f) => f.id === folderId);
      setSelectedFolder(folder || null);
    } else {
      setSelectedFolder(null);
    }
  }, [folderId, folders]);

  const handleFolderClick = (folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const getNoteCount = (fId) => {
    return notes.filter((note) => 
      fId === "uncategorized" ? note.folder_id === null : note.folder_id === fId
    ).length;
  };

  const folderNotes = selectedFolder
    ? notes.filter((n) => 
        selectedFolder.id === "uncategorized" ? n.folder_id === null : n.folder_id === selectedFolder.id
      )
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode("view");
    setSelectedNote(null);
  };

  // Logic: Save Note (Create or Update)
  const handleSave = async (updatedNote) => {
    const noteData = {
      title: updatedNote.title,
      content: updatedNote.content,
      folder_id: updatedNote.folderId === "uncategorized" ? null : updatedNote.folderId,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    if (modalMode === "edit") {
      const { error } = await supabase.from("notes").update(noteData).eq("id", updatedNote.id);
      if (error) alert("Update failed");
    } else {
      const { error } = await supabase.from("notes").insert([noteData]);
      if (error) alert("Creation failed");
    }
    
    setIsModalOpen(false);
    fetchData();
  };

  // Logic: Delete Note (with confirmation)
  const handleDeleteNote = async (e, noteId) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      }
    }
  };

  // Logic: Folder Create/Update
  const handleCreateFolder = async (folderData) => {
    const isUpdate = !!folderToEdit;
    const finalData = { ...folderData, user_id: user.id };

    if (isUpdate) {
      await supabase.from("folders").update(finalData).eq("id", folderToEdit.id);
    } else {
      await supabase.from("folders").insert([finalData]);
    }
    
    setIsFolderModalOpen(false);
    setFolderToEdit(null);
    fetchData();
  };

  // Logic: Delete Folder (SRS: Delete associated notes too)
  const handleDeleteFolder = async (e, folderIdToDelete) => {
    e.stopPropagation();
    if (window.confirm("Delete folder and all notes inside?")) {
      // Supabase RLS or manual cascade
      await supabase.from("notes").delete().eq("folder_id", folderIdToDelete);
      await supabase.from("folders").delete().eq("id", folderIdToDelete);
      
      fetchData();
      if (folderId === folderIdToDelete) navigate("/folders");
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex box-border">
      <Navigation />
      <div className="flex-1 min-h-screen box-border lg:ml-64 flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sub-Sidebar for Folders List */}
          {selectedFolder && (
            <div className="w-45 flex md:w-64 border-r border-white/10 flex-col bg-white/5 overflow-y-auto pt-8">
              <div className="px-6 mb-6">
                <h2 className="text-white/40 text-xs font-bold uppercase tracking-wider">Folders</h2>
              </div>
              <div className="flex flex-col gap-1 px-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left
                      ${selectedFolder.id === folder.id 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    <i className={`fa-solid ${folder.icon} text-lg ${folder.color}`}></i>
                    <span className="font-medium text-sm truncate">{folder.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedFolder && (
                  <button onClick={() => navigate("/folders")} className="p-2 rounded-full hover:bg-white/5 transition text-slate-400">
                    <i className="fa-solid fa-arrow-left text-xl"></i>
                  </button>
                )}
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedFolder ? selectedFolder.name : "My Folders"}
                </h1>
              </div>

              {!selectedFolder ? (
                <button onClick={() => { setFolderToEdit(null); setIsFolderModalOpen(true); }}
                  className="flex items-center gap-2 rounded-xl bg-(--btn-primary) px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <i className="fa-solid fa-folder-plus"></i> Add New Folder
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setFolderToEdit(selectedFolder); setIsFolderModalOpen(true); }}
                    className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button onClick={(e) => handleDeleteFolder(e, selectedFolder.id)}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
                  >
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                  <button onClick={() => { setSelectedNote(null); setModalMode("create"); setIsModalOpen(true); }}
                    className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    <i className="fa-solid fa-plus"></i> New Note
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--btn-primary) border-t-transparent"></div>
              </div>
            ) : !selectedFolder ? (
              /* Folders Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div key={folder.id} onClick={() => handleFolderClick(folder)}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition cursor-pointer h-32"
                  >
                    <div className="flex items-center justify-between mb-4 text-blue-400">
                      <i className={`fa-solid ${folder.icon} text-3xl ${folder.color}`}></i>
                    </div>
                    <h3 className="font-semibold truncate">{folder.name}</h3>
                    <p className="text-xs text-white/60 mt-1">{getNoteCount(folder.id)} notes</p>
                  </div>
                ))}
                <div onClick={() => { setFolderToEdit(null); setIsFolderModalOpen(true); }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer h-32 transition-all"
                >
                  <i className="fa-solid fa-plus text-xl text-white/60"></i>
                  <span className="text-sm text-white/60">Add Folder</span>
                </div>
              </div>
            ) : (
              /* Notes Grid View inside Folder */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {folderNotes.length === 0 ? (
                  <div className="col-span-full flex h-64 flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/20">
                    <i className="fa-regular fa-note-sticky text-4xl text-slate-500 mb-4"></i>
                    <p className="text-xl font-medium text-slate-400">No notes here</p>
                  </div>
                ) : (
                  folderNotes.map((note) => (
                    <div key={note.id} onClick={() => handleView(note)}
                      className="bg-(--bg-secondary) rounded-2xl border border-white/5 p-5 hover:border-white/10 transition group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold truncate">{note.title}</h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(note); }} className="p-1.5 text-slate-400 hover:text-blue-400">
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button onClick={(e) => handleDeleteNote(e, note.id)} className="p-1.5 text-slate-400 hover:text-red-400">
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">{note.content}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                         {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FolderModal
        isOpen={isFolderModalOpen}
        folder={folderToEdit}
        onClose={() => { setIsFolderModalOpen(false); setFolderToEdit(null); }}
        onCreate={handleCreateFolder}
      />

      <NoteModal
        isOpen={isModalOpen}
        mode={modalMode}
        folders={folders}
        initialFolderId={selectedFolder?.id}
        onClose={handleCloseModal}
        onSave={handleSave}
        selectedNote={selectedNote}
      />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
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
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fRes, nRes] = await Promise.all([
        supabase.from("folders").select("*").eq("user_id", user.id),
        supabase.from("notes").select("*").eq("user_id", user.id),
      ]);

      let fData = fRes.data || [];
      const nData = nRes.data || [];

      if (nData.some((n) => !n.folder_id)) {
        if (!fData.find((f) => f.id === "uncategorized")) {
          fData.push({
            id: "uncategorized",
            name: "Uncategorized",
            icon: "fa-folder-open",
            color: "text-slate-400",
          });
        }
      }
      setFolders(fData);
      setNotes(nData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDeleteFolder = async (e, id) => {
    e.stopPropagation(); // Prevents navigating into the folder
    if (id === "uncategorized") return;
    if (!confirm("Delete this folder? Notes will become uncategorized."))
      return;

    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (!error) fetchData();
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setIsFolderModalOpen(true);
  };

  const activeFolder = folders.find((f) => f.id === folderId);
  const displayedNotes = notes.filter((n) =>
    folderId === "uncategorized" ? !n.folder_id : n.folder_id === folderId
  );

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex transition-colors duration-300">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6 md:p-12 pb-32 lg:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-[var(--text-main)]">
                Your Folders
              </h1>
              <p className="text-[var(--text-muted)] font-medium">
                Organize your thoughts, ideas, and projects.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedFolder(null);
                setIsFolderModalOpen(true);
              }}
              className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg"
            >
              + New Folder
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse text-[var(--text-faint)]">
              Loading your space...
            </div>
          ) : !folderId ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate(`/folders/${f.id}`)}
                  className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-[2rem] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <i className={`fa-solid ${f.icon} text-4xl ${f.color}`}></i>

                    {f.id !== "uncategorized" && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => handleEditFolder(e, f)}
                          className="p-2 bg-[var(--bg-input)] rounded-lg hover:text-[var(--accent-primary)] text-[var(--text-muted)]"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={(e) => handleDeleteFolder(e, f.id)}
                          className="p-2 bg-[var(--bg-input)] rounded-lg hover:text-red-400 text-[var(--text-muted)]"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{f.name}</h3>
                  <p className="text-[var(--text-faint)] text-sm font-bold uppercase tracking-widest">
                    {
                      notes.filter((n) =>
                        f.id === "uncategorized"
                          ? !n.folder_id
                          : n.folder_id === f.id
                      ).length
                    }{" "}
                    Notes
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => navigate("/folders")}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-tighter"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Folders
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-3xl hover:border-[var(--accent-primary)]/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{note.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => navigate(`/edit/${note.id}`)}
                          className="p-2 bg-[var(--bg-input)] rounded-lg hover:text-[var(--accent-primary)] text-[var(--text-muted)]"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this note?")) {
                              await supabase
                                .from("notes")
                                .delete()
                                .eq("id", note.id);
                              fetchData();
                            }
                          }}
                          className="p-2 bg-[var(--bg-input)] rounded-lg hover:text-red-400 text-[var(--text-muted)]"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div
                      className="text-[var(--text-muted)] line-clamp-2 text-sm leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <span className="text-[10px] font-black text-[var(--text-faint)] uppercase">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                <div
                  onClick={() => navigate("/create-note")}
                  className="border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-[var(--bg-card-hover)] cursor-pointer transition-all min-h-[160px]"
                >
                  <i className="fa-solid fa-plus text-[var(--text-faint)] text-2xl mb-2"></i>
                  <span className="text-[var(--text-faint)] font-bold text-sm">
                    Add Note
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        folder={selectedFolder}
        onRefresh={fetchData}
      />
    </div>
  );
}

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

  const [ folders, setFolders ] = useState([]);
  const [ notes, setNotes ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ isFolderModalOpen, setIsFolderModalOpen ] = useState(false);
  const [ selectedFolder, setSelectedFolder ] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ fRes, nRes ] = await Promise.all([
        supabase.from("folders").select("*").eq("user_id", user.id),
        supabase.from("notes").select("*").eq("user_id", user.id),
      ]);

      let fData = fRes.data || [];
      const nData = nRes.data || [];

      if (nData.some(n => !n.folder_id)) {
        if (!fData.find(f => f.id === "uncategorized")) {
          fData.push({
            id: "uncategorized",
            name: "Uncategorized",
            icon: "fa-folder-open",
            color: "text-slate-500"
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
  }, [ user ]);

  const handleDeleteFolder = async (e, id) => {
    e.stopPropagation();
    if (id === "uncategorized") return;
    if (!confirm("Delete this folder? Notes will become uncategorized.")) return;

    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (!error) fetchData();
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setIsFolderModalOpen(true);
  };

  const activeFolder = folders.find(f => f.id === folderId);
  const displayedNotes = notes.filter(n =>
    folderId === "uncategorized" ? !n.folder_id : n.folder_id === folderId
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex transition-colors duration-300">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
                {activeFolder ? activeFolder.name : "Your Library"}
              </h1>
              <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">
                {activeFolder ? `${displayedNotes.length} thoughts stored` : `${folders.length} active categories`}
              </p>
            </div>
            {!folderId && (
              <button
                onClick={() => { setSelectedFolder(null); setIsFolderModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                + Create Folder
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse text-[var(--text-muted)] font-black uppercase tracking-tighter italic">
              SYNCING YOUR ARCHIVE...
            </div>
          ) : !folderId ? (
            /* Folders Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map(f => (
                <div key={f.id} onClick={() => navigate(`/folders/${f.id}`)}
                  className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border-color)]`}>
                      <i className={`fa-solid ${f.icon} text-2xl ${f.color}`}></i>
                    </div>

                    {f.id !== "uncategorized" && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => handleEditFolder(e, f)} className="p-2 hover:text-blue-500 text-[var(--text-muted)] transition-colors"><i className="fa-solid fa-pen text-xs"></i></button>
                        <button onClick={(e) => handleDeleteFolder(e, f.id)} className="p-2 hover:text-red-500 text-[var(--text-muted)] transition-colors"><i className="fa-solid fa-trash text-xs"></i></button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-black mb-1 text-[var(--text-main)]">{f.name}</h3>
                  <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">
                    {notes.filter(n => f.id === "uncategorized" ? !n.folder_id : n.folder_id === f.id).length} Entries
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Individual Folder View (Notes List) */
            <div className="space-y-6">
              <button onClick={() => navigate("/folders")} className="text-[var(--text-muted)] hover:text-[var(--text-main)] mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Back to Archive
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedNotes.map(note => (
                  <div key={note.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-black text-[var(--text-main)] leading-tight">{note.title}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => navigate(`/edit/${note.id}`)} className="p-2 hover:text-blue-500 text-[var(--text-muted)]"><i className="fa-solid fa-pen text-xs"></i></button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this note?")) {
                              await supabase.from("notes").delete().eq("id", note.id);
                              fetchData();
                            }
                          }}
                          className="p-2 hover:text-red-500 text-[var(--text-muted)]"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <div
                      className="text-[var(--text-muted)] line-clamp-2 text-sm leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
                      <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">
                        {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"></i>
                    </div>
                  </div>
                ))}

                {/* Add Note Placeholder */}
                <div
                  onClick={() => navigate("/create-note")}
                  className="border-2 border-dashed border-[var(--border-color)] rounded-[2rem] p-8 flex flex-col items-center justify-center hover:bg-[var(--bg-secondary)] hover:border-blue-500/30 cursor-pointer transition-all min-h-[180px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-plus text-[var(--text-muted)]"></i>
                  </div>
                  <span className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest">Add New Thought</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => { setIsFolderModalOpen(false); setSelectedFolder(null); }}
        folder={selectedFolder}
        onRefresh={fetchData}
      />
    </div>
  );
}
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

      if (nData.some(n => !n.folder_id)) {
        if (!fData.find(f => f.id === "uncategorized")) {
          fData.push({ 
            id: "uncategorized", 
            name: "Uncategorized", 
            icon: "fa-folder-open", 
            color: "text-slate-400" 
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
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                {activeFolder ? activeFolder.name : "Folders"}
              </h1>
              <p className="text-white/40 font-medium">
                {activeFolder ? `${displayedNotes.length} notes in this folder` : `${folders.length} active folders`}
              </p>
            </div>
            <button 
              onClick={() => { setSelectedFolder(null); setIsFolderModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg"
            >
              + New Folder
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse text-white/20">Loading your space...</div>
          ) : !folderId ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map(f => (
                <div key={f.id} onClick={() => navigate(`/folders/${f.id}`)}
                  className="group bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <i className={`fa-solid ${f.icon} text-4xl ${f.color}`}></i>
                    
                    {f.id !== "uncategorized" && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => handleEditFolder(e, f)} className="p-2 bg-white/5 rounded-lg hover:text-blue-400"><i className="fa-solid fa-pen text-xs"></i></button>
                        <button onClick={(e) => handleDeleteFolder(e, f.id)} className="p-2 bg-white/5 rounded-lg hover:text-red-400"><i className="fa-solid fa-trash text-xs"></i></button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{f.name}</h3>
                  <p className="text-white/30 text-sm font-bold uppercase tracking-widest">
                    {notes.filter(n => f.id === "uncategorized" ? !n.folder_id : n.folder_id === f.id).length} Notes
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => navigate("/folders")} className="text-white/40 hover:text-white mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-tighter">
                <i className="fa-solid fa-arrow-left"></i> Back to Folders
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedNotes.map(note => (
                  <div key={note.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-blue-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{note.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => navigate(`/edit/${note.id}`)} className="p-2 bg-white/5 rounded-lg hover:text-blue-400"><i className="fa-solid fa-pen"></i></button>
                        <button 
                          onClick={async () => { 
                            if(confirm("Delete this note?")) { 
                              await supabase.from("notes").delete().eq("id", note.id); 
                              fetchData(); 
                            } 
                          }} 
                          className="p-2 bg-white/5 rounded-lg hover:text-red-400"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div 
                      className="text-white/50 line-clamp-2 text-sm leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <span className="text-[10px] font-black text-white/20 uppercase">{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
                <div onClick={() => navigate("/create-note")} className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-white/5 cursor-pointer transition-all min-h-[160px]">
                   <i className="fa-solid fa-plus text-white/20 text-2xl mb-2"></i>
                   <span className="text-white/20 font-bold text-sm">Add Note</span>
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
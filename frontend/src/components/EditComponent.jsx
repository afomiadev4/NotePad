import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 

export function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [visibility, setVisibility] = useState("Private");
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: note } = await supabase.from("notes").select("*").eq("id", id).single();
        if (note) {
          setTitle(note.title || "");
          setContent(note.content || "");
          setCategory(note.category || "General");
          setVisibility(note.visibility || "Private");
          setFolderId(note.folder_id || "uncategorized");
        }
        if (user?.id) {
          const { data: fData } = await supabase.from("folders").select("*").eq("user_id", user.id);
          setFolders(fData || []);
        }
      } finally { setLoading(false); }
    };
    loadData();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await supabase.from("notes").update({
      title, content, category, visibility,
      folder_id: folderId === "uncategorized" ? null : folderId,
      updated_at: new Date()
    }).eq("id", id);
    navigate(visibility === "Public" ? "/feed" : "/folders");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-tighter">LOADING...</div>;

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <form onSubmit={handleUpdate} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: MAIN EDITOR */}
          <div className="lg:col-span-2 space-y-6">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-3xl font-black outline-none focus:border-blue-500 transition-all" 
              placeholder="Title..." 
            />
            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden min-h-[60vh] flex flex-col shadow-2xl">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="flex-1 text-white editor-custom"
              />
            </div>
          </div>

          {/* RIGHT: SIDEBAR SETTINGS */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 sticky top-12">
              
              {/* DROPDOWN UI FIX */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Organize</label>
                <div className="relative group">
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-white/10 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>

                <div className="relative group">
                  <select 
                    value={folderId} 
                    onChange={e => setFolderId(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-white/10 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="uncategorized" className="bg-zinc-900">No Folder</option>
                    {folders.map(f => <option key={f.id} value={f.id} className="bg-zinc-900">{f.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <i className="fa-solid fa-folder text-xs"></i>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Privacy</label>
                 <button 
                  type="button" 
                  onClick={() => setVisibility(visibility === "Public" ? "Private" : "Public")}
                  className={`w-full py-4 rounded-2xl border font-black text-[10px] tracking-widest transition-all ${visibility === "Public" ? "bg-blue-600/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-white/20"}`}
                >
                  {visibility === "Public" ? "🚀 GOING PUBLIC" : "🔒 STAY PRIVATE"}
                </button>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-black text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                  SAVE CHANGES
                </button>
                <button type="button" onClick={() => navigate(-1)} className="w-full py-4 text-white/20 font-black text-[10px] tracking-widest hover:text-white transition-colors">
                  DISCARD
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <style>{`
        .editor-custom .ql-toolbar { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; padding: 1.5rem !important; }
        .editor-custom .ql-container { border: none !important; font-size: 1.1rem; font-family: inherit; }
        .editor-custom .ql-editor { padding: 2rem !important; min-height: 50vh; color: rgba(255,255,255,0.8); }
        .ql-snow .ql-stroke { stroke: rgba(255,255,255,0.4) !important; }
        .ql-snow .ql-fill { fill: rgba(255,255,255,0.4) !important; }
        .ql-snow .ql-picker { color: rgba(255,255,255,0.4) !important; }
      `}</style>
    </div>
  );
}
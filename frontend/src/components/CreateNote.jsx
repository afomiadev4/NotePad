import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';

export function CreateNote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isPublic, setIsPublic] = useState(searchParams.get("mode") === "public");
  const [folderId, setFolderId] = useState("uncategorized");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [wordCount, setWordCount] = useState(0);
  const WORD_LIMIT = 300;

  useEffect(() => {
    
    const plainText = content.replace(/<[^>]*>/g, ' ');
    
    const words = plainText.match(/\b[-?(\w+)]+\b/gi);
    setWordCount(words ? words.length : 0);
  }, [content]);

 
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "public") setIsPublic(true);
    else if (mode === "private") setIsPublic(false);
  }, [searchParams]);

  useEffect(() => {
    if (user?.id) {
      const fetchFolders = async () => {
        const { data } = await supabase.from("folders").select("*").eq("user_id", user.id);
        setFolders(data || []);
      };
      fetchFolders();
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    
    if (isPublic && wordCount > WORD_LIMIT) {
      alert(`Limit exceeded! Public posts cannot be more than ${WORD_LIMIT} words.`);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("notes").insert([{
      title,
      content,
      user_id: user.id,
      folder_id: folderId === "uncategorized" ? null : folderId,
      visibility: isPublic ? "Public" : "Private",
      category,
      updated_at: new Date()
    }]);

    if (!error) {
      navigate(isPublic ? "/feed" : "/folders");
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <form onSubmit={handleSave} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2 space-y-6">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-3xl font-black outline-none focus:border-blue-500 transition-all placeholder:text-white/10" 
              placeholder="Title" 
              required
            />
            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden min-h-[60vh] flex flex-col shadow-2xl">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="flex-1 text-white editor-custom"
                placeholder="Start writing..."
              />
            </div>
          </div>

         
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 sticky top-12">
              

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Word Count</label>
                  <span className={`text-sm font-black transition-colors ${isPublic && wordCount > WORD_LIMIT ? "text-red-500" : "text-blue-400"}`}>
                    {wordCount}{isPublic ? ` / ${WORD_LIMIT}` : ""}
                  </span>
                </div>
                {isPublic && (
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${wordCount > WORD_LIMIT ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${Math.min((wordCount / WORD_LIMIT) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Organize</label>
                <div className="relative group">
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-white/10 focus:border-blue-500 transition-all cursor-pointer">
                    {["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"].map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                </div>

                <div className="relative group">
                  <select value={folderId} onChange={e => setFolderId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-white/10 focus:border-blue-500 transition-all cursor-pointer">
                    <option value="uncategorized" className="bg-zinc-900">No Folder</option>
                    {folders.map(f => <option key={f.id} value={f.id} className="bg-zinc-900">{f.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20"><i className="fa-solid fa-folder text-xs"></i></div>
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Visibility</label>
                 <button type="button" onClick={() => setIsPublic(!isPublic)} className={`w-full py-4 rounded-2xl border font-black text-[10px] tracking-widest transition-all ${isPublic ? "bg-blue-600/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-white/20"}`}>
                  {isPublic ? "🚀 PUBLIC FEED" : "🔒 PRIVATE NOTE"}
                </button>
              </div>

              
              <div className="pt-4 space-y-3">
                <button 
                  type="submit" 
                  disabled={loading || (isPublic && wordCount > WORD_LIMIT)}
                  className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-black text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:shadow-none"
                >
                  {loading 
                    ? "CREATING..." 
                    : isPublic ? "POST TO FEED" : "CREATE NOTE"}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="w-full py-4 text-white/20 font-black text-[10px] tracking-widest hover:text-white transition-colors">CANCEL</button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <style>{`
        .editor-custom .ql-toolbar { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; padding: 1.5rem !important; }
        .editor-custom .ql-container { border: none !important; font-size: 1.1rem; font-family: inherit; }
        .editor-custom .ql-editor { padding: 2rem !important; min-height: 50vh; color: rgba(255,255,255,0.8); }
        .editor-custom .ql-editor.ql-blank::before { color: rgba(255,255,255,0.1) !important; left: 2rem !important; }
        .ql-snow .ql-stroke { stroke: rgba(255,255,255,0.4) !important; }
        .ql-snow .ql-fill { fill: rgba(255,255,255,0.4) !important; }
        .ql-snow .ql-picker { color: rgba(255,255,255,0.4) !important; }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";

export function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [folderId, setFolderId] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
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
      setLoading(false);
    };
    if (id) loadNote();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("notes").update({
      title, content, category, visibility,
      folder_id: folderId === "uncategorized" ? null : folderId,
      updated_at: new Date()
    }).eq("id", id);
    if (!error) navigate(visibility === "Public" ? "/feed" : "/folders");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <form onSubmit={handleUpdate} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-bold outline-none" placeholder="Title" />
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[60vh] bg-white/5 border border-white/10 rounded-3xl p-8 text-lg outline-none resize-none" placeholder="Content" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3">
              {["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="button" onClick={() => setVisibility(visibility === "Public" ? "Private" : "Public")} className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold">
              {visibility === "Public" ? "🚀 Public" : "🔒 Private"}
            </button>
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold">SAVE CHANGES</button>
          </div>
        </form>
      </main>
    </div>
  );
}
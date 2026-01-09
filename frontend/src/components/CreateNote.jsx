import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";

export function CreateNote() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [folders, setFolders] = useState([]);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [folderId, setFolderId] = useState("uncategorized");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];

  useEffect(() => {
    if (user?.id) {
      const getFolders = async () => {
        const { data } = await supabase.from("folders").select("*").eq("user_id", user.id);
        setFolders(data || []);
      };
      getFolders();
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("notes").insert([{
      title,
      content,
      category,
      user_id: user.id,
      visibility: isPublic ? "Public" : "Private",
      folder_id: folderId === "uncategorized" ? null : folderId,
      updated_at: new Date()
    }]);

    if (!error) navigate(isPublic ? "/feed" : "/folders");
    else alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <form onSubmit={handleSave} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-bold outline-none focus:border-blue-500" placeholder="Untitled Note" required />
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[60vh] bg-white/5 border border-white/10 rounded-3xl p-8 text-lg outline-none focus:border-blue-500 resize-none" placeholder="Start writing..." required />
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 mt-2">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setIsPublic(!isPublic)} className={`w-full py-4 rounded-xl border font-bold ${isPublic ? "bg-blue-600 border-blue-600" : "bg-white/5 border-white/10 text-white/40"}`}>
                {isPublic ? "🚀 Public Feed" : "🔒 Private Note"}
              </button>
              <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all">
                {loading ? "SAVING..." : "CREATE NOTE"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";

export function CreateNote({ defaultFolder = "uncategorized", hideFolderSelection = false, isPost = false }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Accessing the logged-in user

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState(defaultFolder);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  // SRS Logic: Word Count for Posts
  const getWordCount = (str) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(content);
  const isOverLimit = isPost && wordCount > 300;

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id);
      if (data) setFolders(data);
    };
    fetchFolders();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (isOverLimit) {
      alert("As per community guidelines, posts cannot exceed 300 words.");
      return;
    }

    setLoading(true);

    const noteData = {
      title,
      content,
      user_id: user.id,
      // If folder is 'uncategorized', we store NULL in DB
      folder_id: folderId === "uncategorized" ? null : folderId,
      // If it's a post, set visibility to Public
      visibility: isPost ? "Public" : "Private",
      word_count: wordCount,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("notes").insert([noteData]);
      if (error) throw error;
      
      // Redirect based on type
      navigate(isPost ? "/feed" : "/folders");
    } catch (err) {
      console.error("Error saving note:", err.message);
      alert("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{isPost ? "Create Public Post" : "New Private Note"}</h1>
              <p className="text-white/40 text-sm mt-1">
                {isPost ? "Sharing with the community" : "Storing in your personal folders"}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Back
            </button>
          </header>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Editor */}
              <div className="md:col-span-2 space-y-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-semibold focus:border-blue-500 outline-none transition"
                  required
                />
                
                <div className="relative">
                  <textarea
                    placeholder="Write your heart out..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[50vh] bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-lg leading-relaxed focus:border-blue-500 outline-none transition resize-none"
                    required
                  />
                  <div className={`absolute bottom-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md ${isOverLimit ? "text-red-400 border border-red-400/50" : "text-white/40"}`}>
                    {wordCount} {isPost ? "/ 300" : ""} WORDS
                  </div>
                </div>
              </div>

              {/* Right Column: Settings */}
              <div className="space-y-6">
                {!hideFolderSelection && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-4">Select Folder</label>
                    <select
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="uncategorized">Uncategorized</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <i className={`fa-solid ${isPost ? 'fa-earth-americas' : 'fa-lock'} text-blue-400`}></i>
                    {isPost ? "Public Post" : "Private Note"}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {isPost 
                      ? "This note will be visible to everyone in the Public Feed." 
                      : "This note is encrypted and only visible to you."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || isOverLimit}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : isPost ? "Post to Community" : "Save to Folders"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function SavedNotes() {
  const user = useSelector((state) => state.auth.user);
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("saves")
      .select(`
        note_id,
        notes (
          id,
          title,
          content,
          created_at,
          profiles (username, avatar_url)
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching saved notes:", error);
    } else {
      const cleanData = data.map(item => item.notes).filter(note => note !== null);
      setSavedNotes(cleanData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const removeSave = async (noteId) => {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("note_id", noteId)
      .eq("user_id", user.id);
    if (!error) fetchSaved();
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <i className="fa-solid fa-bookmark text-lg"></i>
               </div>
               <h1 className="text-3xl font-black tracking-tight">Bookmarks</h1>
            </div>
            <p className="text-white/30 text-sm font-medium ml-1">Your curated collection of thoughts and inspiration.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 italic text-white/20">
               <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-500"></div>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="text-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fa-regular fa-bookmark text-3xl text-white/10"></i>
              </div>
              <p className="text-white/40 font-bold text-lg">No bookmarks yet</p>
              <p className="text-xs text-white/20 mt-2 max-w-[200px] mx-auto uppercase tracking-widest font-black">Find inspiration on the feed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedNotes.map((note) => (
                <div key={note.id} className="group bg-white/[0.03] border border-white/10 p-6 rounded-[32px] flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                         src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username || 'U'}&background=random`}
                         className="w-8 h-8 rounded-xl object-cover border border-white/10"
                         alt="author"
                      />
                      <span className="text-sm font-black text-white/60 group-hover:text-blue-400 transition">@{note.profiles?.username}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white leading-tight">{note.title}</h3>
                    <p className="text-sm text-white/50 line-clamp-4 leading-relaxed font-medium">{note.content}</p>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-tighter">
                      Created {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => removeSave(note.id)}
                      className="h-10 px-4 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <i className="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
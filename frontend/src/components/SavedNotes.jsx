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
    
    // We fetch from 'saves', but we want the 'notes' data inside it
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
      // Clean up the data structure: remove the 'saves' wrapper
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
    
    if (!error) fetchSaved(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black tracking-tight">Bookmarks</h1>
            <p className="text-white/40 text-sm">Don't let these ideas get away</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 italic text-white/20">Loading bookmarks...</div>
          ) : savedNotes.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <i className="fa-regular fa-bookmark text-4xl text-white/10 mb-4"></i>
              <p className="text-white/40 font-medium">No bookmarks yet</p>
              <p className="text-xs text-white/20 mt-1 text-balance">Notes you save from the feed will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedNotes.map((note) => (
                <div key={note.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                        {note.profiles?.username?.[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-white/40">@{note.profiles?.username}</span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-blue-400 transition">{note.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">{note.content}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] text-white/20 font-mono uppercase">
                      Saved {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => removeSave(note.id)}
                      className="text-xs text-red-400/50 hover:text-red-400 transition p-2"
                    >
                      <i className="fa-solid fa-trash-can mr-1"></i> Remove
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
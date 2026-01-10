import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function SavedNotes() {
  const user = useSelector((state) => state.auth.user);
  const [ savedNotes, setSavedNotes ] = useState([]);
  const [ loading, setLoading ] = useState(true);

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
  }, [ user ]);

  const removeSave = async (noteId) => {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("note_id", noteId)
      .eq("user_id", user.id);
    if (!error) fetchSaved();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex text-[var(--text-main)] font-sans transition-colors duration-300">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/20">
                <i className="fa-solid fa-bookmark text-xl"></i>
              </div>
              <h1 className="text-4xl font-black tracking-tight uppercase">Bookmarks</h1>
            </div>
            <p className="text-[var(--text-muted)] text-xs font-black uppercase tracking-[0.2em] ml-1 opacity-70">Your curated collection of public thoughts.</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-amber-500"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] animate-pulse">Retrieving Archive...</span>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="text-center py-32 bg-[var(--bg-secondary)] rounded-[3rem] border-2 border-dashed border-[var(--border-color)]">
              <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i className="fa-regular fa-bookmark text-3xl text-[var(--text-muted)] opacity-30"></i>
              </div>
              <p className="text-[var(--text-main)] font-black text-xl mb-2">The shelf is empty</p>
              <p className="text-[10px] text-[var(--text-muted)] max-w-[220px] mx-auto uppercase tracking-widest font-black leading-loose">
                Browse the public feed to find notes worth saving
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedNotes.map((note) => (
                <div key={note.id} className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-[2.5rem] flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/5">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username || 'U'}&background=fbbf24&color=fff`}
                        className="w-9 h-9 rounded-[0.8rem] object-cover border border-[var(--border-color)] shadow-sm"
                        alt="author"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Saved Thought</span>
                        <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors cursor-pointer">@{note.profiles?.username}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black mb-4 text-[var(--text-main)] leading-tight">{note.title}</h3>

                    <div
                      className="text-sm text-[var(--text-muted)] line-clamp-4 leading-relaxed font-medium mb-2"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-tighter opacity-50">Original Date</span>
                      <span className="text-[11px] text-[var(--text-main)] font-bold">
                        {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <button
                      onClick={() => removeSave(note.id)}
                      className="h-11 px-5 rounded-2xl bg-[var(--bg-primary)] text-rose-500 border border-[var(--border-color)] hover:border-rose-500/50 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <i className="fa-solid fa-trash-can"></i> Unsave
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
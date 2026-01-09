import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search";
import { supabase } from "../supabaseClient";
import { CommentModal } from "./CommentModal";
import { useSelector } from "react-redux";

export function Feed() {
  const user = useSelector((state) => state.auth.user);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

  const categories = ["All", "General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];

  // 1. FETCH LOGIC (With explicit joins for Comments and Saves)
  const fetchPosts = async (cat = activeCat) => {
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select(`
          *,
          profiles!user_id (username, avatar_url, bio),
          reactions!note_id (user_id),
          saves!note_id (user_id),
          comments!note_id (id)
        `)
        .eq("visibility", "Public")
        .order("created_at", { ascending: false });

      if (cat !== "All") {
        query = query.eq("category", cat);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching feed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPosts(activeCat); 
  }, [activeCat]);

  // 2. LIKE LOGIC
  const handleToggleLike = async (noteId) => {
    if (!user) return alert("Please log in!");
    const noteIndex = notes.findIndex(n => n.id === noteId);
    const hasLiked = notes[noteIndex].reactions?.some(r => r.user_id === user.id);
    
    const updated = [...notes];
    if (hasLiked) {
      updated[noteIndex].reactions = updated[noteIndex].reactions.filter(r => r.user_id !== user.id);
      await supabase.from("reactions").delete().eq("note_id", noteId).eq("user_id", user.id);
    } else {
      updated[noteIndex].reactions = [...(updated[noteIndex].reactions || []), { user_id: user.id }];
      await supabase.from("reactions").insert([{ note_id: noteId, user_id: user.id }]);
    }
    setNotes(updated);
  };

  // 3. SAVE LOGIC
  const handleToggleSave = async (noteId) => {
    if (!user) return alert("Please log in!");
    const noteIndex = notes.findIndex(n => n.id === noteId);
    const hasSaved = notes[noteIndex].saves?.some(s => s.user_id === user.id);
    
    const updated = [...notes];
    if (hasSaved) {
      updated[noteIndex].saves = updated[noteIndex].saves.filter(s => s.user_id !== user.id);
      await supabase.from("saves").delete().eq("note_id", noteId).eq("user_id", user.id);
    } else {
      updated[noteIndex].saves = [...(updated[noteIndex].saves || []), { user_id: user.id }];
      await supabase.from("saves").insert([{ note_id: noteId, user_id: user.id }]);
    }
    setNotes(updated);
  };

  // 4. SHARE LOGIC
  const handleShare = (note) => {
    const url = `${window.location.origin}/note/${note.id}`;
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: `Check out this note by @${note.profiles?.username}`,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          <header className="sticky top-0 bg-(--bg-primary)/80 backdrop-blur-xl z-30 pb-4 border-b border-white/5 pt-4">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-black tracking-tight">Public Feed</h1>
              <SearchBar />
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setActiveCat(c)} 
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      activeCat === c ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest text-[10px]">
              Syncing Feed...
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const hasLiked = note.reactions?.some(r => r.user_id === user?.id);
                const hasSaved = note.saves?.some(s => s.user_id === user?.id);
                
                return (
                  <article key={note.id} className="bg-white/[0.03] rounded-[2rem] border border-white/10 p-6 hover:bg-white/[0.05] transition-all group">
                    <div className="flex gap-4">
                      <img 
                        src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username || 'U'}`} 
                        className="w-12 h-12 rounded-2xl object-cover cursor-pointer border border-white/5" 
                        onClick={() => setViewingProfile(note.profiles)} 
                      />
                      <div className="flex-1">
                        <span className="font-bold text-white block">@{note.profiles?.username || "anonymous"}</span>
                        <h2 className="text-xl font-bold text-white mt-4">{note.title}</h2>
                        <div 
                          className="text-white/60 text-sm my-4 line-clamp-6 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: note.content }} 
                        />
                        
                        {/* ACTION BAR */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-6">
                            {/* Like */}
                            <button onClick={() => handleToggleLike(note.id)} className={`flex items-center gap-2 transition-colors ${hasLiked ? 'text-rose-500' : 'text-white/40 hover:text-rose-400'}`}>
                              <i className={`${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                              <span className="text-xs font-bold">{note.reactions?.length || 0}</span>
                            </button>

                            {/* Comment */}
                            <button 
                              onClick={() => { setSelectedNote(note); setIsCommentModalOpen(true); }} 
                              className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors"
                            >
                              <i className="fa-regular fa-comment"></i>
                              <span className="text-xs font-bold">{note.comments?.length || 0}</span>
                            </button>

                            {/* Save */}
                            <button onClick={() => handleToggleSave(note.id)} className={`flex items-center gap-2 transition-colors ${hasSaved ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-400'}`}>
                              <i className={`${hasSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                            </button>
                          </div>

                          {/* Share */}
                          <button onClick={() => handleShare(note)} className="text-white/40 hover:text-emerald-400 transition-colors">
                            <i className="fa-solid fa-arrow-up-from-bracket"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      {isCommentModalOpen && selectedNote && (
  <CommentModal 
    noteId={selectedNote.id} 
    onClose={() => setIsCommentModalOpen(false)} 
    onCommentAdded={() => fetchPosts(activeCat)} 
  />
)}
    </div>
  );
}
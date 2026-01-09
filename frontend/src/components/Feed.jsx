import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search";
import { supabase } from "../supabaseClient";
import { CommentModal } from "./CommentModal";
import { ProfileCard } from "./ProfileCard";
import { useSelector } from "react-redux";

export function Feed() {
  const user = useSelector((state) => state.auth.user);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [filterUser, setFilterUser] = useState(null); // Filter by specific author
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

  const categories = ["All", "General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select(`
          *,
          profiles!user_id (id, username, avatar_url, bio),
          reactions!note_id (user_id),
          saves!note_id (user_id),
          comments!note_id (id)
        `)
        .eq("visibility", "Public")
        .order("created_at", { ascending: false });

      // Apply Category Filter
      if (activeCat !== "All") {
        query = query.eq("category", activeCat);
      }

      // Apply User Filter (View Thoughts)
      if (filterUser) {
        query = query.eq("user_id", filterUser.id);
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
    fetchPosts();
  }, [activeCat, filterUser]);

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

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          <header className="sticky top-0 bg-(--bg-primary)/80 backdrop-blur-xl z-30 pb-4 border-b border-white/5 pt-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  {filterUser ? (
                    <>
                      <button onClick={() => setFilterUser(null)} className="hover:text-blue-500 transition">
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                      </button>
                      {/* Showing only the handle in the title */}
                      <span>@{filterUser.username}'s Posts</span>
                    </>
                  ) : "Public Feed"}
                </h1>
                {filterUser && (
                  <button 
                    onClick={() => setFilterUser(null)}
                    className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <SearchBar />

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setActiveCat(c)} 
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      activeCat === c ? "bg-white text-black border-white" : "border-white/10 text-white/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest text-[10px]">Syncing...</div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const hasLiked = note.reactions?.some(r => r.user_id === user?.id);
                const hasSaved = note.saves?.some(s => s.user_id === user?.id);
                
                return (
                  <article key={note.id} className="bg-white/[0.03] rounded-[2rem] border border-white/10 p-6 hover:bg-white/[0.05] transition-all">
                    <div className="flex gap-4">
                      <img 
                        src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username}`} 
                        className="w-12 h-12 rounded-2xl object-cover cursor-pointer hover:scale-95 transition-transform" 
                        onClick={() => setViewingProfile(note.profiles)} 
                      />
                      <div className="flex-1">
                        <span 
                          onClick={() => setViewingProfile(note.profiles)}
                          className="font-bold text-white cursor-pointer hover:text-blue-400 hover:underline transition-all inline-block"
                        >
                          @{note.profiles?.username || "anonymous"}
                        </span>
                        
                        <h2 className="text-xl font-bold text-white mt-4">{note.title}</h2>
                        <div className="text-white/60 text-sm my-4 line-clamp-6" dangerouslySetInnerHTML={{ __html: note.content }} />
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-6">
                            <button onClick={() => handleToggleLike(note.id)} className={`flex items-center gap-2 ${hasLiked ? 'text-rose-500' : 'text-white/40'}`}>
                              <i className={`${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                              <span className="text-xs font-bold">{note.reactions?.length || 0}</span>
                            </button>
                            <button 
                               onClick={() => { setSelectedNote(note); setIsCommentModalOpen(true); }}
                               className="flex items-center gap-2 text-white/40 hover:text-blue-400"
                            >
                              <i className="fa-regular fa-comment"></i>
                              <span className="text-xs font-bold">{note.comments?.length || 0}</span>
                            </button>
                            <button onClick={() => handleToggleSave(note.id)} className={`flex items-center gap-2 ${hasSaved ? 'text-yellow-500' : 'text-white/40'}`}>
                              <i className={`${hasSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                            </button>
                          </div>
                          <button 
                            onClick={() => {
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
                            }} 
                            className="text-white/20 hover:text-emerald-400 transition-colors p-2"
                          >
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
          onCommentAdded={fetchPosts} 
        />
      )}

      {viewingProfile && (
        <ProfileCard 
          profile={viewingProfile} 
          onClose={() => setViewingProfile(null)} 
          onViewThoughts={(prof) => {
            setFilterUser(prof);
            setViewingProfile(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search";
import { supabase } from "../supabaseClient";
import { NoteModal } from "./NoteModal";
import { CommentModal } from "./CommentModal";
import { useSelector } from "react-redux";

export function Feed() {
  const user = useSelector((state) => state.auth.user);
  
  // States
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [filterUser, setFilterUser] = useState(null);

  const categories = ["All", "General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];

  const fetchPosts = async (cat = activeCat) => {
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select(`
          *,
          profiles (username, avatar_url, bio),
          reactions (user_id),
          saves (user_id),
          comments (id)
        `)
        .eq("visibility", "Public");

      if (cat !== "All") {
        query = query.eq("category", cat);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching feed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (noteId) => {
    if (!user) return alert("Please log in to react!");
    const noteIndex = notes.findIndex(n => n.id === noteId);
    const note = notes[noteIndex];
    const hasLiked = note.reactions?.some(r => r.user_id === user.id);

    // Optimistic Update
    const updatedNotes = [...notes];
    if (hasLiked) {
      updatedNotes[noteIndex].reactions = note.reactions.filter(r => r.user_id !== user.id);
    } else {
      updatedNotes[noteIndex].reactions = [...(note.reactions || []), { user_id: user.id }];
    }
    setNotes(updatedNotes);

    if (hasLiked) {
      await supabase.from("reactions").delete().eq("note_id", noteId).eq("user_id", user.id);
    } else {
      await supabase.from("reactions").insert([{ note_id: noteId, user_id: user.id }]);
    }
  };

  const handleToggleSave = async (noteId) => {
    if (!user) return alert("Login to save notes!");
    const noteIndex = notes.findIndex(n => n.id === noteId);
    const note = notes[noteIndex];
    const isSaved = note.saves?.some(s => s.user_id === user.id);

    const updatedNotes = [...notes];
    if (isSaved) {
      updatedNotes[noteIndex].saves = note.saves.filter(s => s.user_id !== user.id);
    } else {
      updatedNotes[noteIndex].saves = [...(note.saves || []), { user_id: user.id }];
    }
    setNotes(updatedNotes);

    if (isSaved) {
      await supabase.from("saves").delete().eq("note_id", noteId).eq("user_id", user.id);
    } else {
      await supabase.from("saves").insert([{ note_id: noteId, user_id: user.id }]);
    }
  };

  const handleShare = async (note) => {
    const shareUrl = `${window.location.origin}/note/${note.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `Check out @${note.profiles?.username}'s thought!`,
          url: shareUrl,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  };

  useEffect(() => {
    fetchPosts(activeCat);
  }, [activeCat]);

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          
          {/* HEADER & SEARCH */}
          <header className="sticky top-0 bg-(--bg-primary)/80 backdrop-blur-xl z-30 pb-4 border-b border-white/5 pt-4">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <i className="fa-solid fa-file-lines text-blue-500"></i> NotePad+
                </h1>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="lg:hidden p-2 bg-blue-600 rounded-xl"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              <SearchBar />
              
              {/* CATEGORY SELECTOR */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setActiveCat(c)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeCat === c ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest">
              Syncing Feed...
            </div>
          ) : (
            <div className="space-y-4">
              {/* USER FILTER NOTIFICATION */}
              {filterUser && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-4 rounded-3xl">
                  <p className="text-sm">Showing thoughts by <span className="font-bold text-blue-400">@{filterUser}</span></p>
                  <button onClick={() => setFilterUser(null)} className="text-[10px] bg-blue-600 px-3 py-1.5 rounded-xl font-black uppercase">Clear</button>
                </div>
              )}

              {notes
                .filter((note) => !filterUser || note.profiles?.username === filterUser)
                .map((note) => {
                  const hasLiked = note.reactions?.some(r => r.user_id === user?.id);
                  const hasSaved = note.saves?.some(s => s.user_id === user?.id);

                  return (
                    <article key={note.id} className="bg-white/[0.03] backdrop-blur-md rounded-[2rem] border border-white/10 p-6 hover:bg-white/[0.05] transition-all duration-300">
                      <div className="flex gap-4">
                        <img 
                          src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username || 'U'}&background=random`} 
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 cursor-pointer"
                          onClick={() => setViewingProfile(note.profiles)}
                          alt="avatar"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col cursor-pointer" onClick={() => setViewingProfile(note.profiles)}>
                              <span className="font-bold text-white flex items-center gap-2">
                                @{note.profiles?.username || "anonymous"}
                                {note.category && (
                                  <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                                    {note.category}
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-white/20 uppercase font-black">{new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <h2 className="text-xl font-bold text-white mt-4">{note.title}</h2>
                          {/* whitespace-pre-wrap makes rich text spacing visible */}
                          <p className="text-white/60 leading-relaxed my-4 whitespace-pre-wrap line-clamp-6 text-sm">{note.content}</p>
                          
                          {/* INTERACTION BAR */}
                          <div className="flex items-center justify-between max-w-sm pt-4 border-t border-white/5">
                            <button onClick={() => { setSelectedNote(note); setIsCommentModalOpen(true); }} className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition">
                              <i className="fa-regular fa-comment"></i>
                              <span className="text-xs font-bold">{note.comments?.length || 0}</span>
                            </button>

                            <button onClick={() => handleToggleLike(note.id)} className={`flex items-center gap-2 transition ${hasLiked ? 'text-rose-500' : 'text-white/40 hover:text-rose-500'}`}>
                              <i className={`${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                              <span className="text-xs font-bold">{note.reactions?.length || 0}</span>
                            </button>

                            <button onClick={() => handleToggleSave(note.id)} className={`flex items-center gap-2 transition ${hasSaved ? 'text-amber-400' : 'text-white/40 hover:text-amber-400'}`}>
                              <i className={`${hasSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                            </button>

                            <button onClick={() => handleShare(note)} className="text-white/40 hover:text-green-400 transition">
                              <i className="fa-solid fa-arrow-up-from-bracket text-sm"></i>
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

      {/* Modals */}
      <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isPost={true} onSave={() => fetchPosts(activeCat)} />
      <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} note={selectedNote} onCommentAdded={() => fetchPosts(activeCat)} />
      
      {/* Profile Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
            <div className="px-8 pb-8 text-center">
              <div className="flex justify-center -mt-12 mb-4">
                <img src={viewingProfile.avatar_url || `https://ui-avatars.com/api/?name=${viewingProfile.username}`} className="w-24 h-24 rounded-3xl border-4 border-zinc-900 object-cover bg-zinc-800" alt="profile" />
              </div>
              <h2 className="text-2xl font-black">@{viewingProfile.username}</h2>
              <p className="text-white/40 text-sm mt-2">{viewingProfile.bio || "No bio yet."}</p>
              <div className="mt-8 space-y-3">
                <button onClick={() => { setFilterUser(viewingProfile.username); setViewingProfile(null); }} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest transition">View Thoughts</button>
                <button onClick={() => setViewingProfile(null)} className="w-full bg-white/5 text-white/40 font-bold py-4 rounded-2xl text-xs uppercase tracking-widest transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
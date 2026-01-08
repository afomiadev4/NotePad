import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search";
import { supabase } from "../supabaseClient";
import { NoteModal } from "./NoteModal";
import { CommentModal } from "./CommentModal";
import { useSelector } from "react-redux";

export function Feed() {
  const user = useSelector((state) => state.auth.user);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [filterUser, setFilterUser] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          profiles (username, avatar_url, bio),
          reactions (user_id),
          saves (user_id),
          comments (id)
        `)
        .eq("visibility", "Public")
        .order("created_at", { ascending: false });

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

    // Optimistic UI Update
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
          text: `Check out @${note.profiles?.username}'s thought on NotePad+!`,
          url: shareUrl,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-0">
          
          <header className="sticky top-0 bg-(--bg-primary)/80 backdrop-blur-md z-30 pb-4 border-b border-white/5">
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <i className="fa-solid fa-file-lines text-blue-500"></i> NotePad+
                </h1>
              </div>
              <div className="w-full flex justify-center">
                <SearchBar />
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-white/40">No posts yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filterUser && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6">
                  <p className="text-sm">
                    Showing thoughts by <span className="font-bold text-blue-400">@{filterUser}</span>
                  </p>
                  <button 
                    onClick={() => setFilterUser(null)}
                    className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg font-bold transition"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {notes
                .filter((note) => !filterUser || note.profiles?.username === filterUser)
                .map((note) => {
                  const hasLiked = note.reactions?.some(r => r.user_id === user?.id);
                  const hasSaved = note.saves?.some(s => s.user_id === user?.id);

                  return (
                    <article 
                      key={note.id} 
                      className="group bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <img 
                          src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${note.profiles?.username || 'U'}&background=random`} 
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 cursor-pointer hover:scale-105 transition"
                          onClick={() => setViewingProfile(note.profiles)}
                          alt="avatar"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div 
                              className="flex flex-col cursor-pointer"
                              onClick={() => setViewingProfile(note.profiles)}
                            >
                              <span className="font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                                @{note.profiles?.username || "anonymous"}
                                {note.category && (
                                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                                    {note.category}
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-white/30 uppercase font-medium">
                                {new Date(note.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <h2 className="text-lg font-bold text-white mb-2 mt-2">{note.title}</h2>
                          <p className="text-white/70 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-5">{note.content}</p>
                          
                          <div className="flex items-center justify-between max-w-sm pt-2">
                            <button 
                              onClick={() => { setSelectedNote(note); setIsCommentModalOpen(true); }} 
                              className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition"
                            >
                              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition">
                                <i className="fa-regular fa-comment"></i>
                              </div>
                              <span className="text-xs font-bold">{note.comments?.length || 0}</span>
                            </button>

                            <button 
                              onClick={() => handleToggleLike(note.id)} 
                              className={`flex items-center gap-2 transition ${hasLiked ? 'text-red-500' : 'text-white/40 hover:text-red-500'}`}
                            >
                              <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition ${hasLiked ? 'bg-red-500/10' : 'bg-white/5'}`}>
                                <i className={`${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                              </div>
                              <span className="text-xs font-bold">{note.reactions?.length || 0}</span>
                            </button>

                            <button 
                              onClick={() => handleToggleSave(note.id)} 
                              className={`flex items-center gap-2 transition ${hasSaved ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-500'}`}
                            >
                              <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition ${hasSaved ? 'bg-yellow-500/10' : 'bg-white/5'}`}>
                                <i className={`${hasSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                              </div>
                            </button>

                            <button 
                              onClick={() => handleShare(note)} 
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-green-400 transition"
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

      <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isPost={true} onSave={fetchPosts} />
      <CommentModal 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)} 
        note={selectedNote} 
        onCommentAdded={fetchPosts}
      />
      
      {/* Profile Preview Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="h-24 bg-gradient-to-br from-blue-600/40 to-indigo-600/40 border-b border-white/5" />
            <div className="px-6 pb-6 text-center">
              <div className="flex justify-center -mt-12 mb-4">
                <img 
                  src={viewingProfile.avatar_url || `https://ui-avatars.com/api/?name=${viewingProfile.username}`}
                  className="w-24 h-24 rounded-3xl border-4 border-zinc-900 object-cover bg-zinc-800 shadow-2xl"
                  alt="profile"
                />
              </div>
              <h2 className="text-2xl font-black text-white">@{viewingProfile.username}</h2>
              <p className="text-white/50 text-sm mt-3 leading-relaxed px-2">
                {viewingProfile.bio || "This creator hasn't added a bio yet."}
              </p>
              <div className="mt-8 space-y-3">
                <button 
                  onClick={() => {
                    setFilterUser(viewingProfile.username);
                    setViewingProfile(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl text-sm transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-eye"></i> View All Thoughts
                </button>
                <button onClick={() => setViewingProfile(null)} className="w-full bg-white/5 hover:bg-white/10 text-white/60 font-bold py-3 rounded-2xl text-sm transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search"; // <--- Make sure this is imported!
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          profiles (username, avatar_url),
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
    const { data: existingSave } = await supabase
      .from("saves")
      .select("id")
      .eq("note_id", noteId)
      .eq("user_id", user.id)
      .single();

    if (existingSave) {
      await supabase.from("saves").delete().eq("id", existingSave.id);
    } else {
      await supabase.from("saves").insert([{ note_id: noteId, user_id: user.id }]);
    }
    fetchPosts();
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
    <div className="min-h-screen bg-(--bg-primary) flex text-white">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-0">
          
          {/* SINGLE CLEAN HEADER */}
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
            notes.map((note) => (
              <article key={note.id} className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:bg-white/[0.05] transition-all">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-inner">
                    {note.profiles?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate hover:underline cursor-pointer text-white/90">
                        @{note.profiles?.username || "anonymous"}
                      </span>
                      <span className="text-xs text-white/30 lowercase">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">{note.title}</h2>
                    <p className="text-white/70 leading-relaxed mb-4 whitespace-pre-wrap">{note.content}</p>
                    
                    <div className="flex items-center justify-between max-w-md text-white/40">
                      <button onClick={() => { setSelectedNote(note); setIsCommentModalOpen(true); }} className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                        <i className="fa-regular fa-comment group-hover:bg-blue-400/10 p-2 rounded-full"></i>
                        <span className="text-xs">{note.comments?.length || 0}</span>
                      </button>

                      <button onClick={() => handleToggleLike(note.id)} className={`flex items-center gap-2 transition-colors group ${note.reactions?.some(r => r.user_id === user?.id) ? 'text-red-500' : 'hover:text-red-500'}`}>
                        <i className={`${note.reactions?.some(r => r.user_id === user?.id) ? 'fa-solid' : 'fa-regular'} fa-heart group-hover:bg-red-500/10 p-2 rounded-full`}></i>
                        <span className="text-xs">{note.reactions?.length || 0}</span>
                      </button>

                      <button onClick={() => handleToggleSave(note.id)} className={`transition-colors group ${note.saves?.some(s => s.user_id === user?.id) ? 'text-yellow-500' : 'hover:text-yellow-500'}`}>
                        <i className={`${note.saves?.some(s => s.user_id === user?.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark group-hover:bg-yellow-500/10 p-2 rounded-full`}></i>
                      </button>

                      <button onClick={() => handleShare(note)} className="hover:text-green-400 transition-colors group">
                        <i className="fa-solid fa-arrow-up-from-bracket group-hover:bg-green-400/10 p-2 rounded-full"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isPost={true} onSave={fetchPosts} />
      <CommentModal 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)} 
        note={selectedNote} 
        onCommentAdded={(noteId) => {
          setNotes(prev => prev.map(n => 
            n.id === noteId 
              ? { ...n, comments: [...(n.comments || []), { id: Date.now() }] } 
              : n
          ));
        }}
      />
    </div>
  );
}
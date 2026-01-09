import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function CommentModal({ isOpen, onClose, note, onCommentAdded }) {
  const user = useSelector((state) => state.auth.user);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch comments for this specific note
  useEffect(() => {
    if (isOpen && note) {
      fetchComments();
    }
  }, [isOpen, note]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(username, avatar_url)")
      .eq("note_id", note.id)
      .order("created_at", { ascending: true });
    setComments(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("comments").insert([
      {
        note_id: note.id,
        user_id: user.id,
        content: commentText,
      },
    ]);

    if (!error) {
      setCommentText("");
      fetchComments();
      onCommentAdded(); // Refresh count on feed
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border-t sm:border border-white/10 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="font-black text-xl tracking-tight">Discussion</h3>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">on {note?.title}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/20 text-sm font-bold italic">No voices here yet. Start the conversation.</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-4 group">
                <img 
                  src={c.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${c.profiles?.username}`} 
                  className="w-10 h-10 rounded-xl object-cover" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black">@{c.profiles?.username}</span>
                    <span className="text-[9px] text-white/20 font-bold uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSubmit} className="p-6 bg-white/5 border-t border-white/5">
          <div className="relative flex items-center">
            <input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a thought..."
              className="w-full bg-zinc-800 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm outline-none focus:border-blue-500 transition-all"
            />
            <button 
              disabled={loading || !commentText.trim()}
              className="absolute right-2 p-3 text-blue-500 hover:text-blue-400 disabled:text-white/10 transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-lg"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
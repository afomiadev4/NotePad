import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function CommentModal({ noteId, onClose, onCommentAdded }) {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 1. Fetch Comments for this note
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          profiles!user_id (username, avatar_url)
        `)
        .eq("note_id", noteId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [noteId]);

  // 2. Submit a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from("comments").insert([
        {
          note_id: noteId,
          user_id: user.id,
          content: newComment.trim(),
        },
      ]);

      if (error) throw error;
      
      setNewComment("");
      await fetchComments(); // Refresh list
      onCommentAdded(); // Refresh count on main Feed
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-zinc-950 border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[90vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-black tracking-tight">Comments</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <i className="fa-solid fa-xmark text-white/40"></i>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-10 animate-pulse text-[10px] font-black uppercase tracking-widest text-blue-500">Loading Discussion...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <img 
                  src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.username}`} 
                  className="w-10 h-10 rounded-xl object-cover border border-white/5" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">@{comment.profiles?.username}</span>
                    <span className="text-[10px] text-white/20 font-medium">
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <i className="fa-regular fa-comments text-3xl text-white/5 mb-4 block"></i>
              <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-zinc-900/50">
          <div className="relative flex items-center gap-3">
            <input 
              type="text"
              placeholder={user ? "Write a comment..." : "Login to comment"}
              disabled={!user || sending}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-blue-500 transition-all text-sm"
            />
            <button 
              disabled={!newComment.trim() || sending}
              className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 disabled:bg-white/5 transition-all shadow-lg shadow-blue-600/20"
            >
              {sending ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
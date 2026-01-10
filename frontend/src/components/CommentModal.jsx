import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function CommentModal({ noteId, onClose, onCommentAdded }) {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          user_id,
          created_at,
          profiles!user_id (username, avatar_url)
        `
        )
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          { note_id: noteId, user_id: user.id, content: newComment.trim() },
        ]);
      if (error) throw error;
      setNewComment("");
      await fetchComments();
      onCommentAdded();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const previousComments = [...comments];
    setComments(comments.filter((c) => c.id !== commentId));

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
      onCommentAdded();
    } catch (err) {
      setComments(previousComments);
      alert("Delete failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xl">
      <div
        className="w-full max-w-lg bg-[var(--bg-card)] border-t sm:border border-[var(--border-subtle)] sm:rounded-[2rem] flex flex-col h-[80vh] overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Discussion
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-input)] flex items-center justify-center hover:bg-[var(--bg-card-hover)] transition text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        {/* Thread Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {loading ? (
            <div className="flex justify-center py-10 text-[var(--accent-primary)] animate-pulse text-[10px] font-black uppercase tracking-widest">
              Loading...
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map((comment, index) => (
                <div key={comment.id} className="relative flex gap-4 pb-6">
                  {/* Vertical Thread Line */}
                  {index !== comments.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-px bg-[var(--border-subtle)]"></div>
                  )}

                  <img
                    src={
                      comment.profiles?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${comment.profiles?.username}`
                    }
                    className="w-10 h-10 rounded-full object-cover relative z-10 border border-[var(--bg-card)]"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-main)]">
                          @{comment.profiles?.username}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                          {new Date(comment.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {user?.id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      )}
                    </div>
                    <p className="text-[var(--text-main)] text-sm mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {!loading && comments.length === 0 && (
                <div className="text-center py-20 text-[var(--text-muted)] opacity-50 uppercase font-black text-[10px] tracking-widest">
                  No replies yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clean Reply Input (No Avatar) */}
        <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-input)]">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Post your reply..."
              className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl py-3.5 px-5 outline-none focus:border-[var(--accent-primary)]/50 transition-all text-sm text-[var(--text-main)] placeholder-[var(--text-faint)]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={sending}
            />
            <button
              disabled={!newComment.trim() || sending}
              className="bg-[var(--accent-primary)] text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--accent-hover)] disabled:opacity-20 transition-all shadow-lg shadow-blue-500/10"
            >
              {sending ? "..." : "Reply"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function CommentModal({ isOpen, onClose, note, onCommentAdded }) {
  const user = useSelector((state) => state.auth.user);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      fetchComments();
    }
  }, [isOpen, note]);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        profiles (username, avatar_url)
      `)
      .eq("note_id", note.id)
      .order("created_at", { ascending: true });

    if (!error) setComments(data || []);
    setLoading(false);
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{
        note_id: note.id,
        user_id: user.id,
        content: commentText.trim(),
      }])
      .select(`id, content, created_at, profiles (username, avatar_url)`)
      .single();

    if (!error) {
      setComments([...comments, data]);
      setCommentText("");
      if (onCommentAdded) onCommentAdded(note.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <i className="fa-solid fa-comments text-blue-500"></i>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Discussion</h3>
              <p className="text-white/40 text-[11px] uppercase tracking-wider font-bold">Replying to @{note?.profiles?.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Comments List with Threading UI */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <i className="fa-regular fa-comment-dots text-4xl mb-3"></i>
              <p className="text-sm italic font-medium">Be the first to share a thought.</p>
            </div>
          ) : (
            comments.map((c, idx) => (
              <div key={c.id} className="group flex gap-4 relative">
                {/* The Thread Line */}
                {idx !== comments.length - 1 && (
                  <div className="absolute left-[15px] top-10 bottom-0 w-[2px] bg-white/5 group-hover:bg-blue-500/20 transition-colors" />
                )}
                
                {/* Avatar */}
                <div className="relative z-10">
                  <img 
                    src={c.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${c.profiles?.username || 'U'}&background=random`}
                    className="h-8 w-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                    alt="avatar"
                  />
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white">@{c.profiles?.username}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase">
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/70 text-[14px] leading-relaxed bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 group-hover:border-white/10 transition-colors">
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendComment} className="p-4 bg-zinc-800/50 border-t border-white/5 backdrop-blur-md">
          <div className="relative flex items-center gap-3">
             <img 
                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata?.username || 'Me'}`}
                className="h-8 w-8 rounded-full opacity-50 border border-white/10 hidden sm:block"
                alt="my avatar"
             />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Post your reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 outline-none focus:border-blue-500/50 focus:bg-white/10 transition text-sm text-white"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 text-white disabled:bg-white/5 disabled:text-white/10 transition-all shadow-lg shadow-blue-600/20"
              >
                <i className="fa-solid fa-paper-plane text-[10px]"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
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

    const newComment = {
      note_id: note.id,
      user_id: user.id,
      content: commentText.trim(),
    };

    // 1. Save to Database
    const { data, error } = await supabase
      .from("comments")
      .insert([newComment])
      .select(`
        id,
        content,
        created_at,
        profiles (username, avatar_url)
      `)
      .single();

    if (!error) {
      // 2. Update local list of comments in the modal
      setComments([...comments, data]);
      setCommentText("");

      // 3. OPTIMISTIC UPDATE: Update the count on the Feed instantly
      if (onCommentAdded) {
        onCommentAdded(note.id);
      }
    } else {
      console.error("Error sending comment:", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl flex flex-col max-h-[80vh] shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black">Comments</h3>
            <p className="text-white/40 text-xs">Replying to @{note?.profiles?.username}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/20 text-sm italic">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-white/5">
                  {c.profiles?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white/90">@{c.profiles?.username}</span>
                    <span className="text-[10px] text-white/20">
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendComment} className="p-4 bg-white/[0.02] border-t border-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 outline-none focus:border-blue-500/50 transition text-sm"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-2 p-2 text-blue-500 hover:text-blue-400 disabled:text-white/10 transition-colors"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
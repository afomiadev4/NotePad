import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function CommentModal({ isOpen, onClose, note }) {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      fetchComments();
    }
  }, [isOpen, note]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`*, profiles(username, avatar_url)`)
      .eq("note_id", note.id)
      .order("created_at", { ascending: true });

    if (!error) setComments(data);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("comments").insert([
      {
        note_id: note.id,
        user_id: user.id,
        content: newComment,
      },
    ]);

    if (!error) {
      setNewComment("");
      fetchComments(); // Refresh the list
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-(--bg-secondary) w-full max-w-xl rounded-t-3xl sm:rounded-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-bold">Post Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-6">
          {/* Original Post (Twitter Style) */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 shrink-0 flex items-center justify-center font-bold">
              {note.profiles?.username?.[0]}
            </div>
            <div>
              <p className="font-bold text-sm">@{note.profiles?.username}</p>
              <p className="text-white/80 mt-1">{note.content}</p>
            </div>
          </div>

          <div className="border-l-2 border-white/5 ml-5 pl-8 space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 shrink-0 flex items-center justify-center text-xs font-bold">
                  {comment.profiles?.username?.[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <p className="text-blue-400 text-xs font-bold mb-1">@{comment.profiles?.username}</p>
                    <p className="text-sm text-white/90">{comment.content}</p>
                  </div>
                  <p className="text-[10px] text-white/20 mt-1 ml-1 uppercase">
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Bar */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-blue-500/50 transition">
            <input
              type="text"
              placeholder="Post your reply..."
              className="bg-transparent flex-1 px-2 outline-none text-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <button 
              onClick={handlePostComment}
              disabled={loading || !newComment.trim()}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
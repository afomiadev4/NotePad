import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Navigation } from "./Navigation";

export function EditNote() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPost, setIsPost] = useState(false);

  // 1. Fetch the note data from Supabase on load
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) {
        console.error("Error fetching note:", error);
        navigate("/dashboard"); // Redirect if note not found
      } else {
        setTitle(data.title);
        setContent(data.content);
        setIsPost(data.visibility === "Public");
      }
      setLoading(false);
    };

    fetchNote();
  }, [noteId, navigate]);

  // 2. Logic for word count (SRS 300-word limit)
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isOverLimit = isPost && wordCount > 300;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isOverLimit) {
      alert("Public posts cannot exceed 300 words.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      navigate(-1); // Return to previous screen
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-(--bg-primary) flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Edit {isPost ? "Post" : "Note"}</h1>
              <p className="text-white/40 text-sm">Last modified: Just now</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving || isOverLimit}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold disabled:opacity-50 transition shadow-lg shadow-blue-500/20"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </header>

          <div className="space-y-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold outline-none border-b border-white/10 pb-4 focus:border-blue-500 transition"
              placeholder="Note Title"
            />

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[60vh] bg-white/5 border border-white/10 rounded-2xl p-6 text-lg leading-relaxed outline-none focus:border-blue-500/50 transition resize-none"
                placeholder="Start writing..."
              />
              
              <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${isOverLimit ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-black/40 text-white/40"}`}>
                {wordCount} {isPost ? "/ 300" : ""} WORDS
              </div>
            </div>

            {isPost && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                <i className="fa-solid fa-circle-info text-blue-400"></i>
                <p className="text-xs text-blue-200/70">
                  This is a <strong>Public Post</strong>. Changes will be reflected immediately in the Community Feed.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
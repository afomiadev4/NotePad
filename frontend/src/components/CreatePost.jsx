import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      content,
      user_id: user.id,
    });

    if (insertError) {
      console.error(insertError);
      alert(insertError.message);
    } else {
      setContent("");
      onPostCreated?.();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        required
      />

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-500 rounded-lg text-white"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

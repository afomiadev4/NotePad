import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import CreatePost from "./CreatePost";

export function Feed() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setNotes(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-(--text-primary)">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 space-y-4">
        <CreatePost onPostCreated={fetchPosts} />

        {loading && <p>Loading...</p>}

        {!loading && notes.length === 0 && (
          <p className="text-slate-400">No posts yet</p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-(--bg-secondary) rounded-xl border border-white/10 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden text-sm font-bold">
                {note.profiles?.avatar_url ? (
                  <img
                    src={note.profiles.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  note.profiles?.username?.slice(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <p className="font-semibold">
                  {note.profiles?.username}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mt-4 text-slate-400">{note.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { NoteModal } from "./NoteModal"; // Using the same modal for consistency

export function Feed() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetching from 'notes' table where visibility is 'Public'
      // Joining with 'profiles' to get user details
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-primary) flex text-white">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Feed Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Community Feed</h1>
              <p className="text-white/40 text-sm">See what others are thinking</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-500/20"
            >
              <i className="fa-solid fa-pen-nib mr-2"></i> Share a Thought
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <i className="fa-solid fa-ghost text-4xl text-white/10 mb-4"></i>
              <p className="text-white/40">The feed is empty. Be the first to post!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/10">
                      {note.profiles?.avatar_url ? (
                        <img
                          src={note.profiles.avatar_url}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-white uppercase text-lg">
                          {note.profiles?.username?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-white group-hover:text-blue-400 transition">
                        @{note.profiles?.username || "anonymous"}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                        {new Date(note.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* SRS logic: Post limit badge if you want to show it was a valid post */}
                  <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/20 border border-white/10">
                    Public
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white/90">{note.title}</h3>
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Reusing NoteModal for posting from the feed */}
      <NoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPost={true} // Triggers the 300-word limit and Public visibility
        mode="create"
        onSave={async (formData) => {
          const { error } = await supabase.from("notes").insert([{
            ...formData,
            user_id: (await supabase.auth.getUser()).data.user.id,
            visibility: "Public",
            folder_id: null // Posts usually don't need a folder
          }]);
          
          if (!error) {
            setIsModalOpen(false);
            fetchPosts();
          }
        }}
      />
    </div>
  );
}
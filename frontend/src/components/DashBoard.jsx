import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalNotes: 0, totalFolders: 0, publicPosts: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const [notesRes, foldersRes, postsRes] = await Promise.all([
        supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("folders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("visibility", "Public"),
      ]);

      setStats({
        totalNotes: notesRes.count || 0,
        totalFolders: foldersRes.count || 0,
        publicPosts: postsRes.count || 0,
      });

      // 2. Fetch Recent Notes
      const { data: recent } = await supabase
        .from("notes")
        .select("id, title, updated_at, visibility")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);

      setRecentNotes(recent || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.name || "User"}!</h1>
            <p className="text-white/40 mt-1">Here is what's happening with your notes today.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-blue-500/50 transition cursor-pointer" onClick={() => navigate("/folders")}>
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <i className="fa-solid fa-note-sticky"></i>
              </div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Total Notes</p>
              <h2 className="text-4xl font-bold mt-1">{stats.totalNotes}</h2>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-purple-500/50 transition cursor-pointer" onClick={() => navigate("/folders")}>
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                <i className="fa-solid fa-folder"></i>
              </div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Folders</p>
              <h2 className="text-4xl font-bold mt-1">{stats.totalFolders}</h2>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-green-500/50 transition cursor-pointer" onClick={() => navigate("/feed")}>
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-4">
                <i className="fa-solid fa-earth-americas"></i>
              </div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Public Posts</p>
              <h2 className="text-4xl font-bold mt-1">{stats.publicPosts}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentNotes.length === 0 ? (
                  <p className="text-white/20 text-sm">No notes found.</p>
                ) : (
                  recentNotes.map((note) => (
                    <div 
                      key={note.id} 
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className="flex items-center justify-between p-4 bg-black/20 rounded-2xl hover:bg-white/5 transition cursor-pointer border border-transparent hover:border-white/10"
                    >
                      <div>
                        <p className="font-semibold">{note.title || "Untitled"}</p>
                        <p className="text-[10px] text-white/30 uppercase mt-1">
                          {new Date(note.updated_at).toLocaleDateString()} • {note.visibility}
                        </p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-white/10"></i>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-xl shadow-blue-500/10">
                <h3 className="text-xl font-bold mb-2">Create something new</h3>
                <p className="text-blue-100/70 mb-6 text-sm">Capture your thoughts or share them with the community.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate("/add-note")}
                    className="flex-1 bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition"
                  >
                    Private Note
                  </button>
                  <button 
                    onClick={() => navigate("/post-note")}
                    className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 transition border border-white/20"
                  >
                    Public Post
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <p className="text-white/40 text-sm italic">"Writing is the geometry of the soul."</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
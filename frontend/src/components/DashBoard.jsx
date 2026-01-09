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
      // 1. Fetch Stats (using .head:true for efficiency)
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
            <h1 className="text-4xl font-black tracking-tight">
              Welcome back, {user?.username || "Writer"}!
            </h1>
            <p className="text-white/40 mt-1 font-medium">
              Here is what's happening with your space today.
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              label="Total Notes" 
              value={stats.totalNotes} 
              icon="fa-note-sticky" 
              color="text-blue-400" 
              onClick={() => navigate("/folders")} 
            />
            <StatCard 
              label="Folders" 
              value={stats.totalFolders} 
              icon="fa-folder" 
              color="text-purple-400" 
              onClick={() => navigate("/folders")} 
            />
            <StatCard 
              label="Public Posts" 
              value={stats.publicPosts} 
              icon="fa-earth-americas" 
              color="text-emerald-400" 
              onClick={() => navigate("/feed")} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
                  </div>
                ) : recentNotes.length === 0 ? (
                  <p className="text-white/20 text-sm italic">No notes created yet...</p>
                ) : (
                  recentNotes.map((note) => (
                    <div 
                      key={note.id} 
                      onClick={() => navigate(`/edit/${note.id}`)}
                      className="flex items-center justify-between p-4 bg-black/20 rounded-2xl hover:bg-white/5 transition cursor-pointer border border-transparent hover:border-white/10 group"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {note.title || "Untitled Thought"}
                        </p>
                        <p className="text-[10px] text-white/30 uppercase mt-1 font-black tracking-widest">
                          {new Date(note.updated_at).toLocaleDateString()} • {note.visibility}
                        </p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-white/10 group-hover:text-white/40 transition-all"></i>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/10">
                <h3 className="text-2xl font-black mb-2">Create something new</h3>
                <p className="text-blue-100/70 mb-8 text-sm leading-relaxed">
                  Capture a fleeting thought or craft a story for the world to see.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => navigate("/add-note")}
                    className="flex-1 bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-50 transition active:scale-95 text-xs tracking-widest uppercase"
                  >
                    New Note
                  </button>
                  <button 
                    onClick={() => navigate("/add-note")} // Adjusted to your route logic
                    className="flex-1 bg-blue-500 text-white font-black py-4 rounded-2xl hover:bg-blue-400 transition border border-white/20 active:scale-95 text-xs tracking-widest uppercase"
                  >
                    Public Feed
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center flex items-center justify-center">
                <p className="text-white/40 text-sm italic font-medium leading-relaxed">
                  "Writing is the geometry of the soul."
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for scannable cards
function StatCard({ label, value, icon, color, onClick }) {
  return (
    <div 
      className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group" 
      onClick={onClick}
    >
      <div className={`w-12 h-12 ${color.replace('text', 'bg')}/10 rounded-2xl flex items-center justify-center ${color} mb-6 text-xl group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <h2 className="text-5xl font-black mt-2 tracking-tighter">{value}</h2>
    </div>
  );
}
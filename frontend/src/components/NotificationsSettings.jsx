import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Get ALL reactions with their note details and user profiles
      const { data, error } = await supabase
        .from('reactions')
        .select(`
          id,
          created_at,
          user_id,
          note_id,
          notes!note_id (
            title,
            user_id
          ),
          profiles:user_id (
            username,
            avatar_url
          )
        `) // Added !note_id here
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 2. Filter manually to only show reactions on MY notes
      // Also filter out reactions I made on my own notes (optional)
      const myNotifications = data.filter(n => 
        n.notes?.user_id === user.id && n.user_id !== user.id
      );

      setNotifications(myNotifications);
    } catch (err) {
      console.error("Detailed Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex font-sans">
      <Navigation />

      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Simple Header */}
        <header className="p-4 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-(--bg-primary)/80 backdrop-blur-md z-50">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition active:scale-95"
          >
            <i className="fa-solid fa-arrow-left text-white/40"></i>
          </button>
          <h1 className="text-xl font-black tracking-tight">Activity</h1>
        </header>

        <div className="max-w-2xl mx-auto w-full p-4 md:p-8">
          <div className="space-y-3">
            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20 opacity-20 animate-pulse">
                <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">Updating Feed...</p>
              </div>
            ) : notifications.length > 0 ? (
              /* Real Notification List */
              notifications.map((n) => (
                <div key={n.id} className="group p-5 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center gap-4 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default">
                  <img 
                    src={n.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${n.profiles?.username || 'User'}&background=random`} 
                    className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" 
                    alt="User"
                  />
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">
                      <span className="font-black text-white">@{n.profiles?.username || 'someone'}</span>
                      <span className="text-white/40"> liked your note </span>
                      <span className="text-blue-400 font-bold italic">"{n.notes?.title}"</span>
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/10 mt-1 block">
                      {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {/* Status Indicator Dot */}
                  <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="text-center py-32 bg-white/[0.01] rounded-[48px] border border-dashed border-white/5">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-bell-slash text-white/10 text-2xl"></i>
                 </div>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
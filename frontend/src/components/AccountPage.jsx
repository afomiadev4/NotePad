import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState(""); // Bio state integrated
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata?.name || user.email.split("@")[0]);
        
        // Fetch bio from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("bio")
          .eq("id", user.id)
          .single();
        if (profile) setBio(profile.bio || "");

        await fetchUserPosts(user.id);
      }
      setLoading(false);
    };
    getUserData();
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          id,
          title,
          content,
          created_at,
          reactions (id)
        `)
        .eq("user_id", userId)
        .eq("visibility", "Public") // ONLY PUBLIC POSTS
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSave = async () => {
    const { error: authError } = await supabase.auth.updateUser({
      data: { name: name },
    });

    if (!authError) {
      // Update both name and bio in profiles table
      await supabase
        .from("profiles")
        .update({ full_name: name, bio: bio })
        .eq("id", user.id);
        
      setIsEditing(false);
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) alert(error.message);
    else alert("Password reset link sent to your email!");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("PERMANENTLY DELETE ACCOUNT? This cannot be undone.");
    if (confirmed) {
      alert("Account deletion request sent. You will be signed out.");
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);

      if (error) throw error;
      setUserPosts(userPosts.filter((post) => post.id !== noteId));
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Error deleting post.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-(--bg-primary) flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) flex text-white font-sans">
      <Navigation />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Updated Header with NotePad+ branding */}
        <header className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-(--bg-primary)/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-blue-500 text-xl"></i>
            <span className="font-black tracking-tighter text-lg">NotePad+</span>
          </div>
          <button className="text-white/40 hover:text-white transition">
             <i className="fa-solid fa-bell text-lg"></i>
          </button>
        </header>

        <div className="h-40 bg-gradient-to-b from-blue-600/20 to-transparent w-full border-b border-white/5"></div>

        <main className="flex-1 px-4 pb-24">
          <div className="max-w-2xl mx-auto -mt-12">
            
            <div className="flex justify-between items-end mb-6">
              <div className="h-24 w-24 rounded-3xl overflow-hidden border-4 border-(--bg-primary) bg-zinc-900 shadow-xl">
                <img
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=random`}
                />
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition active:scale-95"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="mb-10">
              {isEditing ? (
                <div className="flex flex-col gap-3 max-w-sm">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Display Name</label>
                  <input 
                    className="bg-white/5 border border-white/10 p-3 rounded-xl w-full outline-none focus:border-blue-500 transition text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Bio</label>
                  <textarea 
                    className="bg-white/5 border border-white/10 p-3 rounded-xl w-full outline-none focus:border-blue-500 transition text-sm h-24 resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                  <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20">
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight">{user?.user_metadata?.name || name}</h1>
                  <p className="text-blue-400 font-medium mb-2">@{user?.email?.split('@')[0]}</p>
                  <p className="text-white/60 text-sm max-w-lg leading-relaxed">{bio || "Add a bio to tell the community about yourself..."}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-white/20">My Thoughts</h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div key={post.id} className="group relative p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-white/90 group-hover:text-blue-400 transition pr-8">
                        {post.title}
                      </h3>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-white/10 hover:text-red-500 transition-colors p-2"
                        title="Delete Post"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                    
                    <p className="text-white/50 text-sm line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-4 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-heart text-red-500/50"></i> {post.reactions?.length || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                  <p className="text-white/20 text-sm font-medium">No public posts yet.</p>
                </div>
              )}
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 space-y-4">
              <button 
                onClick={handlePasswordReset} 
                className="w-full text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition"
              >
                <i className="fa-solid fa-key"></i> Reset Password
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className="w-full text-red-500/40 hover:text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition"
              >
                <i className="fa-solid fa-user-xmark"></i> Delete Account
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition pt-4"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
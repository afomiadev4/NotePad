import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); 
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setUsername(profile.username || "");
          setName(profile.full_name || "");
          setBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url || "");
        } else {
          setUsername(user.email.split('@')[0]);
          setName(user.email.split('@')[0]);
        }

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
          *,
          profiles!user_id (username, avatar_url),
          reactions!note_id (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setUserPosts([]);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
        alert("Username cannot be empty");
        return;
    }
    
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ 
          id: authUser.id, 
          username: username.trim().toLowerCase(),
          full_name: name.trim(),
          bio: bio || "",
        }, { onConflict: 'id' });

      if (profileError) throw profileError;
      
      setIsEditing(false);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) alert(error.message);
    else alert("Reset link sent!");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("PERMANENTLY DELETE ACCOUNT? This cannot be undone.");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm("Are you sure?");
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

        <div className="h-40 bg-gradient-to-b from-blue-600/20 to-transparent w-full border-b border-white/5"></div>

        <main className="flex-1 px-4 pb-24">
          <div className="max-w-2xl mx-auto -mt-12">
            
            <div className="flex justify-between items-end mb-6">
              <div className="group relative h-28 w-28 rounded-[32px] overflow-hidden border-4 border-(--bg-primary) bg-zinc-900 shadow-2xl">
                <img
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=random`}
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <i className="fa-solid fa-camera text-white text-xl mb-1"></i>
                    <span className="text-[10px] text-white font-black uppercase tracking-tighter">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} />
                  </label>
                )}
              </div>

              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl border font-bold text-sm transition active:scale-95 ${
                    isEditing ? "border-red-500/50 text-red-500 bg-red-500/5" : "border-white/10 hover:bg-white/5"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="mb-12">
              {isEditing ? (
                <div className="flex flex-col gap-4 max-w-md bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1.5 block ml-1">Display Name</label>
                    <input 
                        className="bg-white/5 border border-white/10 p-3 rounded-xl w-full outline-none focus:border-blue-500 transition text-sm text-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1.5 block ml-1">Username</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">@</span>
                        <input 
                            className="bg-white/5 border border-white/10 p-3 pl-8 rounded-xl w-full outline-none focus:border-blue-500 transition text-sm text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1.5 block ml-1">Bio</label>
                    <textarea 
                        className="bg-white/5 border border-white/10 p-3 rounded-xl w-full outline-none focus:border-blue-500 transition text-sm h-24 resize-none text-white"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Add a bio..."
                    />
                  </div>
                  <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-black transition shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                    Save Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white">{name || "User"}</h1>
                  <p className="text-blue-400/80 text-sm font-medium">@{username}</p>
                  <p className="text-white/60 text-base max-w-lg leading-relaxed pt-4 border-l-2 border-blue-500/30 pl-4">
                    {bio || "No bio yet."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/20">My Thoughts</h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              {userPosts.length > 0 ? (
                <div className="grid gap-4">
                  {userPosts.map(post => (
                    <div key={post.id} className="group relative p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-white/90 group-hover:text-blue-400 transition pr-8">
                          {post.title}
                        </h3>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                      
                      <div 
                        className="text-white/50 text-sm line-clamp-3 leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-heart text-red-500/40"></i> {post.reactions?.length || 0}
                            </span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-white/5 group-hover:text-blue-500/50 transition-colors"></i>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-feather-pointed text-white/10 text-2xl"></i>
                  </div>
                  <p className="text-white/20 text-sm font-bold uppercase tracking-widest">No posts yet</p>
                </div>
              )}
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handlePasswordReset} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition">
                <i className="fa-solid fa-key text-blue-500/50"></i> Reset Password
              </button>
              <button onClick={handleLogout} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition">
                <i className="fa-solid fa-right-from-bracket text-yellow-500/50"></i> Sign Out
              </button>
              <button onClick={handleDeleteAccount} className="sm:col-span-2 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition">
                <i className="fa-solid fa-user-xmark"></i> Permanent Account Deletion
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
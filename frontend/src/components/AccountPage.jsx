import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setName(
          data.user.user_metadata?.name ||
          data.user.email.split("@")[0]
        );
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else navigate("/login");
  };

  const handleSave = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { name },
    });

    if (!error) {
      // Sync with the profiles table so the Feed shows the new name
      await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id);

      setUser(data.user);
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`; // Added unique path

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 3. Update Auth Metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (authError) throw authError;

      // 4. Update Profiles Table (Crucial for the Feed)
      await supabase
        .from("profiles")
        .upsert({ 
            id: user.id, 
            avatar_url: publicUrl,
            username: user.user_metadata?.username || user.email.split("@")[0] 
        });

      setUser(authData.user);
      alert("Avatar updated!");
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("Error uploading image");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) font-display flex text-white">
      <Navigation />
      
      <div className="flex-1 flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center bg-black/40 p-4 backdrop-blur-md border-b border-white/10">
          <h1 className="flex-1 text-center text-lg font-bold tracking-tight">Account</h1>
        </header>

        <main className="flex-1 px-4 pb-24 pt-10">
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center gap-6">
              
              {/* Avatar Section */}
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-white/10 bg-white/5">
                  <img
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                    src={
                      user?.user_metadata?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${name}&background=random`
                    }
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  hidden
                  onChange={handleAvatarUpload}
                />
                <button
                  onClick={() => document.getElementById("avatar-upload").click()}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 border-4 border-(--bg-primary) text-white hover:scale-110 transition shadow-xl cursor-pointer"
                >
                  <i className="fa-solid fa-camera text-sm"></i>
                </button>
              </div>

              {/* Name Section */}
              <div className="text-center space-y-1">
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl bg-white/5 px-4 py-2 text-center text-xl font-bold outline-none border border-blue-500/50"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-center">
                      <button onClick={handleSave} className="text-xs font-bold text-green-400 uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-lg">Save</button>
                      <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-bold">{user?.user_metadata?.name || name}</p>
                      <button onClick={() => setIsEditing(true)} className="text-white/20 hover:text-blue-400 transition">
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>
                    </div>
                    <p className="text-blue-400/60 font-medium tracking-tight">
                      @{user?.user_metadata?.username}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* General Settings */}
            <div className="mt-12 space-y-4">
              <h2 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Preferences</h2>
              <div className="overflow-hidden rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5">
                <button
                  onClick={() => navigate("/settings/notifications")}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <i className="fa-solid fa-bell"></i>
                    </div>
                    <span className="font-medium">Notifications</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-white/20 text-xs"></i>
                </button>
                <button
                  onClick={() => navigate("/settings/privacy")}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <span className="font-medium">Privacy & Security</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-white/20 text-xs"></i>
                </button>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="mt-10 w-full rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-red-500 font-bold transition hover:bg-red-500 hover:text-white flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
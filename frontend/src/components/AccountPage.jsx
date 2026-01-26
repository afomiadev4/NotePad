import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";

export function AccountPage() {
  const { theme, toggleTheme } = useTheme();
  const [ isEditing, setIsEditing ] = useState(false);
  const [ name, setName ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ bio, setBio ] = useState("");
  const [ avatarUrl, setAvatarUrl ] = useState("");
  const [ user, setUser ] = useState(null);
  const [ userPosts, setUserPosts ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);


  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
          setUsername(user.email.split("@")[ 0 ]);
          setName(user.email.split("@")[ 0 ]);
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
        .select(
          `
        *,
        reactions!note_id (*),
        profiles:user_id (username, avatar_url)
      `
        )
        .eq("user_id", userId)
        .eq("visibility", "Public")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUserPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[ 0 ];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      alert("Error uploading avatar: " + error.message);
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
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: authUser.id,
          username: username.trim().toLowerCase(),
          full_name: name.trim(),
          bio: bio || "",
        },
        { onConflict: "id" }
      );

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
      redirectTo: `http://localhost:5173/reset-password`,
    });
    if (error) alert(error.message);
    else alert("Reset link sent!");
  };

  const handleDeleteAccount = async () => {

    if (!currentUser?.id) {
      alert("No user found. Try logging out and back in.");
      return;
    }

    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      setLoading(true);

      await supabase.from("notes").delete().eq("user_id", currentUser.id);

      await supabase.from("profiles").delete().eq("id", currentUser.id);

      await supabase.auth.signOut();
      alert("Account succesfully delete.");
      navigate("/");
    }
    catch (error) {
      alert("Error: " + error.message);
    }
    finally {
      setLoading(false);
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

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg-page)] flex text-[var(--text-main)] font-sans transition-colors duration-300">
      <Navigation />

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="h-40 bg-gradient-to-b from-[var(--accent-primary)]/20 to-transparent w-full border-b border-[var(--border-subtle)]"></div>

        <main className="flex-1 px-4 pb-32 lg:pb-24">
          <div className="max-w-2xl mx-auto -mt-12">
            <div className="flex justify-between items-end mb-6">
              <div className="group relative h-28 w-28 rounded-[32px] overflow-hidden border-4 border-[var(--bg-page)] bg-[var(--bg-card)] shadow-2xl transition-all">
                <img
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  src={
                    avatarUrl ||
                    `https://ui-avatars.com/api/?name=${username}&background=random`
                  }
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <i className="fa-solid fa-camera text-white text-xl mb-1"></i>
                    <span className="text-[10px] text-white font-black uppercase tracking-tighter">
                      Change
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={uploadAvatar}
                    />
                  </label>
                )}
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl border font-bold text-sm transition active:scale-95 ${isEditing
                  ? "border-red-500/50 text-red-500 bg-red-500/5"
                  : "border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]"
                  }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="mb-12">
              {isEditing ? (
                <div className="flex flex-col gap-4 max-w-md bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)]">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1.5 block ml-1">
                      Display Name
                    </label>
                    <input
                      className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-3 rounded-xl w-full outline-none focus:border-[var(--accent-primary)] transition text-sm text-[var(--text-main)]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1.5 block ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">
                        @
                      </span>
                      <input
                        className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-3 pl-8 rounded-xl w-full outline-none focus:border-[var(--accent-primary)] transition text-sm text-[var(--text-main)]"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\s/g, ""))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1.5 block ml-1">
                      Bio
                    </label>
                    <textarea
                      className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-3 rounded-xl w-full outline-none focus:border-[var(--accent-primary)] transition text-sm h-24 resize-none text-[var(--text-main)]"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Add a bio..."
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] py-3 rounded-xl text-sm font-black transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-white"
                  >
                    Save Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
                    {name || "User"}
                  </h1>
                  <p className="text-[var(--accent-primary)] text-sm font-medium">
                    @{username}
                  </p>
                  <p className="text-[var(--text-muted)] text-base max-w-lg leading-relaxed pt-4 border-l-2 border-[var(--accent-primary)]/30 pl-4">
                    {bio || "No bio yet."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)]">
                  My Thoughts
                </h2>
                <div className="h-px flex-1 bg-[var(--border-subtle)]"></div>
              </div>

              {userPosts.length > 0 ? (
                <div className="grid gap-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition pr-8">
                          {post.title}
                        </h3>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-faint)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>

                      <div
                        className="text-[var(--text-muted)] text-sm line-clamp-3 leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-4 text-[var(--text-faint)] text-[10px] font-black uppercase tracking-widest">
                          <span>
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="fa-solid fa-heart text-red-500/40"></i>{" "}
                            {post.reactions?.length || 0}
                          </span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[var(--text-faint)] group-hover:text-[var(--accent-primary)] transition-colors"></i>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-[var(--bg-card)] rounded-[40px] border border-dashed border-[var(--border-subtle)]">
                  <div className="w-16 h-16 bg-[var(--bg-input)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-feather-pointed text-[var(--text-faint)] text-2xl"></i>
                  </div>
                  <p className="text-[var(--text-faint)] text-sm font-bold uppercase tracking-widest">
                    No posts yet
                  </p>
                </div>
              )}
            </div>

            <div className="mt-20 pt-10 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={toggleTheme}
                className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition"
              >
                <i
                  className={`fa-solid ${theme === "dark" ? "fa-moon" : "fa-sun"
                    } ${theme === "dark" ? "text-indigo-400" : "text-amber-500"}`}
                ></i>
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </button>
              <button
                onClick={handlePasswordReset}
                className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition"
              >
                <i className="fa-solid fa-key text-[var(--accent-primary)]/50"></i>{" "}
                Reset Password
              </button>
              <button
                onClick={handleLogout}
                className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition"
              >
                <i className="fa-solid fa-right-from-bracket text-yellow-500/50"></i>{" "}
                Sign Out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="sm:col-span-2 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition"
              >
                <i className="fa-solid fa-user-xmark"></i> Permanent Account
                Deletion
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

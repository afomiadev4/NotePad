import { Navigation } from "./Navigation";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export function AccountPage() {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");


  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      navigate("/login");
    }
  };

  const [user, setUser] = useState(null);


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

const handleSave = async () => {
  const { data, error } = await supabase.auth.updateUser({
    data: { name },
  });

  if (!error) {
    setUser(data.user);
    setIsEditing(false);
  }
};

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    return;
  }

  const { data } = supabase.storage
  .from("avatars")
  .getPublicUrl(filePath);

const publicUrl = data.publicUrl;

// then save THIS
await supabase
  .from("profiles")
  .update({ avatar_url: publicUrl })
  .eq("id", user.id);

  setUser((prev) => ({
    ...prev,
    user_metadata: {
      ...prev.user_metadata,
      avatar_url: avatarUrl,
    },
  }));
};




  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) font-display flex text-(--text-primary)">
      <Navigation />
      {/* main content */}
      <div className="flex-1 flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 p-4 backdrop-blur-sm shrink-0 border-b border-slate-200/10">
          <label
            htmlFor="nav-toggle"
            className="flex size-12 cursor-pointer items-center justify-start -ml-2"
          >
            <button className="flex h-10 w-10 items-center justify-center rounded-full">
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </label>
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">
            Account
          </h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent">
              <i className="fa-solid fa-ellipsis-vertical text-2xl"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 bg-background-dark">
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  alt="User Avatar"
                  className="h-28 w-28 rounded-full object-cover"
                  src={
                    user?.user_metadata?.avatar_url ||
                    "https://ui-avatars.com/api/?name=" + name
                  }
                />
                          <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            hidden
                            onChange={handleAvatarUpload}
                          />

                          <button
                            onClick={() => document.getElementById("avatar-upload").click()}
                            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-(--bg-secondary)"
                          >
                            <i className="fa-solid fa-pen text-sm"></i>
                          </button>

                          </div>
                          <div className="text-center">
                            {isEditing ? (
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-lg bg-white/10 px-4 py-2 text-center text-xl font-bold outline-none border border-white/20"
                          />
                        ) : (
                            <p className="text-2xl font-bold">
                              {user?.user_metadata?.name || name}</p>
                            )}
                            <p className="text-base tex-slate-400"> 
                              @{user?.user_metadata?.username}</p>
                          </div>

                          {isEditing ? (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleSave}
                  className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(
                      user?.user_metadata?.name ||
                      user?.email.split("@")[0]
                    );
                  }}
                  className="rounded-full bg-slate-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 rounded-full bg-blue-400 px-6 py-2.5 text-sm font-semibold"
              >
                Edit Profile
              </button>
            )}

            </div>

            {/* General settings */}
            <div className="mt-10 space-y-2">
              <h2 className="px-4 text-xs font-bold uppercase">General</h2>
              <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-bell text-slate-400"></i>
                    <span className="font-medium">Notifications</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-lock text-slate-400"></i>
                    <span className="font-medium">Privacy & Security</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
              </div>
            </div>

            <button onClick={handleLogout} className="mt-12 w-full rounded-xl border border-red-500 bg-red-500/10 px-6 py-3 text-red-500 font-semibold transition hover:bg-red-500 hover:text-white"
>Logout</button>

          </div>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

export function PrivacySettings() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [settings, setSettings] = useState({ private_account: false, show_profile: true });

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  async function fetchSettings() {
    const { data } = await supabase.from("profiles").select("private_account, show_profile").eq("id", user.id).single();
    if (data) setSettings(data);
  }

  async function handleToggle(field) {
    const newValue = !settings[field];
    setSettings({ ...settings, [field]: newValue });
    await supabase.from("profiles").update({ [field]: newValue }).eq("id", user.id);
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6">
        <button onClick={() => navigate(-1)} className="text-white/40 mb-4 hover:text-white transition">← Back</button>
        <h1 className="text-2xl font-bold mb-6">Privacy & Security</h1>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Private Account</p>
              <p className="text-xs text-white/40">Only you can see your statistics</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.private_account} 
              onChange={() => handleToggle("private_account")}
              className="w-5 h-5 accent-blue-500" 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show profile publicly</p>
              <p className="text-xs text-white/40">Allow others to find your username</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.show_profile} 
              onChange={() => handleToggle("show_profile")}
              className="w-5 h-5 accent-blue-500" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
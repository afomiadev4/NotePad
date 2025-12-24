import { supabase } from "./supabaseClient.js";

const checkSession = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user → kick them out
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  console.log("Logged in user:", user.email);
};

checkSession();

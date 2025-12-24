import { supabase } from "./supabaseClient.js";

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login successful 🎉");

  
   window.location.href = "dashboard.html";
});

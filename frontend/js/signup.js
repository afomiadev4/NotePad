import { supabase } from "./supabaseClient.js";

const signupBtn = document.getElementById("signup-btn");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");

signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:5500/login.html"
      // later replace with your real domain
    }
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Signup successful 🎉 Please check your email to verify your account.");
});

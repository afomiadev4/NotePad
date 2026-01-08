console.log("Login component loaded!");
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    // This is the crucial part:
    // We ignore the metadata (which is often empty or just email) 
    // and grab the REAL username you stored in your 'profiles' table.
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", authData.user.id)
      .single();

    dispatch(
      login({
        user: { 
          ...authData.user, 
          // We FORCE the username to be the one from your DB profile
          username: profileData?.username || "User", 
          avatar_url: profileData?.avatar_url 
        },
        token: authData.session.access_token,
      })
    );

    navigate("/folders");
  };


  return (
    <div className="w-full h-screen bg-(--bg-primary) flex items-center justify-center p-5 text-(--text-primary)">
      <title>Login</title>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h1 className="text-center font-extrabold text-5xl text-white drop-shadow-lg">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-white font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="absolute top-1/2 translate-y-0.5 right-2 cursor-pointer"
              type="button"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="bg-(--btn-primary) transition font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            Login
          </button>
          <div className="flex mt-4 justify-between">
            Don't have an account?
            <Link
              to="/register"
              className="text-(--text-secondary) hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

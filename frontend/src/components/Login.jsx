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

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      alert(authError.message);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", authData.user.id)
      .single();

    dispatch(
      login({
        user: {
          ...authData.user,
          username: profileData?.username || "User",
          avatar_url: profileData?.avatar_url,
        },
        token: authData.session.access_token,
      })
    );

    navigate("/folders");
  };

  return (
    <div className="w-full h-screen bg-[var(--bg-page)] flex items-center justify-center p-5 text-[var(--text-main)] transition-colors duration-300">
      <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-[var(--border-subtle)]">
        <h1 className="text-center font-extrabold text-5xl text-[var(--text-main)] drop-shadow-sm">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-[var(--text-main)] font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 text-[var(--text-main)] placeholder-[var(--text-faint)] outline-none transition"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="text-[var(--text-main)] font-semibold mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password..."
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 text-[var(--text-main)] placeholder-[var(--text-faint)] outline-none transition"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 translate-y-0.5 right-2 cursor-pointer text-[var(--text-faint)] hover:text-[var(--heading-main)]"
              type="button"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white transition font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            Login
          </button>
          <div className="flex mt-4 justify-between text-[var(--text-muted)]">
            Don't have an account?
            <Link
              to="/register"
              className="text-[var(--accent-primary)] hover:underline font-bold"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

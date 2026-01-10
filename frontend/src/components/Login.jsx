import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);

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
          avatar_url: profileData?.avatar_url
        },
        token: authData.session.access_token,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 text-[var(--text-main)] transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Logo/Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-600/20 mb-6">
            <i className="fa-solid fa-file-lines text-white text-2xl"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">NotePad+</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Archive your digital consciousness</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl p-8 md:p-10 transition-all">
          <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-tight">Login</h2>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                className="px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500/50 text-sm font-bold outline-none transition-all placeholder:[var(--text-muted)] opacity-80 focus:opacity-100"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500/50 text-sm font-bold outline-none transition-all placeholder:[var(--text-muted)] opacity-80 focus:opacity-100"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                  type="button"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[var(--text-main)] text-[var(--bg-primary)] font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-[0.98] mt-4"
            >
              Sign In to Archive
            </button>

            <div className="flex flex-col items-center gap-4 mt-4 pt-6 border-t border-[var(--border-color)]">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="text-blue-500 font-black text-xs uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                Create New Archive
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
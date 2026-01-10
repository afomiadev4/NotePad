import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const [ formData, setFormData ] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [ showPassword, setShowPassword ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { username: formData.username }
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful! Please check your email for verification.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 text-[var(--text-main)] transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-600/20 mb-6">
            <i className="fa-solid fa-user-plus text-white text-2xl"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Join NotePad+</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Initialize your personal node</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl p-8 md:p-10 transition-all">
          <form className="flex flex-col gap-5" onSubmit={handleRegister}>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Username</label>
              <input
                type="text"
                placeholder="@thinker_01"
                className="px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500/50 text-sm font-bold outline-none transition-all placeholder:[var(--text-muted)]"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Email</label>
              <input
                type="email"
                placeholder="hello@world.com"
                className="px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500/50 text-sm font-bold outline-none transition-all placeholder:[var(--text-muted)]"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Security Key</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500/50 text-sm font-bold outline-none transition-all placeholder:[var(--text-muted)]"
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                  type="button"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--text-main)] text-[var(--bg-primary)] font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Create Archive"}
            </button>

            <div className="flex flex-col items-center gap-4 mt-4 pt-6 border-t border-[var(--border-color)]">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                Already a member?
              </p>
              <Link
                to="/login"
                className="text-blue-500 font-black text-xs uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                Access Existing Node
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="h-screen bg-[var(--bg-primary)] overflow-hidden text-[var(--text-main)] transition-colors duration-500 relative flex items-center justify-center">

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center w-[90%] max-w-sm">

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
            <i className="fa-solid fa-feather-pointed text-white text-3xl"></i>
          </div>

          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
            Note<span className="text-blue-600">Pad+</span>
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px w-8 bg-[var(--border-color)]"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-80">
              Digital Consciousness
            </p>
            <div className="h-px w-8 bg-[var(--border-color)]"></div>
          </div>

          <p className="mt-8 text-sm font-medium leading-relaxed text-[var(--text-muted)] max-w-[280px]">
            The premium archive for your thoughts, ideas, and creative breakthroughs.
          </p>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Link
            to="/register"
            className="group relative flex h-16 w-full items-center justify-center rounded-3xl bg-[var(--text-main)] text-[var(--bg-primary)] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
          >
            <span className="relative z-10">Initialize Archive</span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>

          <Link
            to="/login"
            className="flex h-16 w-full items-center justify-center rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-black uppercase tracking-[0.2em] text-[var(--text-main)] hover:bg-[var(--bg-primary)] hover:border-[var(--text-main)] transition-all active:scale-[0.98]"
          >
            Access Node
          </Link>

          <div className="pt-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">
              v2.0.26 — Encrypted & Syncronized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
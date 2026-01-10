import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function NavLink({ icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"
        }`}
    >
      <i className={`fa-solid ${icon} ${isActive ? "text-white" : "group-hover:text-blue-500"}`}></i>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}

export function Navigation() {
  const location = useLocation();
  const [ isLight, setIsLight ] = useState(document.body.classList.contains("light"));

  // Sync state with localStorage/body class on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light");
      setIsLight(true);
    } else {
      document.body.classList.remove("light");
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    const newStatus = !isLight;
    setIsLight(newStatus);
    if (newStatus) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  const isTabActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] hidden lg:flex flex-col p-6 z-50 transition-colors">
        <div className="mb-10 px-4">
          <Link to="/dashboard" className="text-xl font-black tracking-tighter flex items-center gap-2 text-[var(--text-main)]">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <i className="fa-solid fa-file-lines text-white text-sm"></i>
            </div>
            NotePad+
          </Link>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink icon="fa-grip" label="Dashboard" to="/dashboard" />
          <NavLink icon="fa-rss" label="Feed" to="/feed" />

          <div className="my-6 border-t border-[var(--border-color)] pt-6">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Workspace</p>
            <NavLink icon="fa-folder" label="Folders" to="/folders" />
            <NavLink icon="fa-bookmark" label="Saved Notes" to="/saved" />
          </div>

          <div className="my-6 border-t border-[var(--border-color)] pt-6">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Activity</p>
            <NavLink icon="fa-plus-circle" label="Add Note" to="/create-note?mode=private" />
            <NavLink icon="fa-user" label="Profile" to="/account" />
          </div>
        </nav>

        <button
          onClick={toggleTheme}
          className="mt-4 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all border border-[var(--border-color)] group"
        >
          <i className={`fa-solid ${isLight ? "fa-moon" : "fa-sun"} text-blue-500 transition-transform group-hover:rotate-12`}></i>
          <span className="font-black text-[10px] uppercase tracking-widest">{isLight ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-t border-[var(--border-color)] flex justify-around items-center p-4 z-50 pb-safe">
        <Link to="/dashboard" className={`p-3 rounded-xl transition-colors ${isTabActive('/dashboard') ? 'text-blue-500 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
          <i className="fa-solid fa-grip text-xl"></i>
        </Link>
        <Link to="/folders" className={`p-3 rounded-xl transition-colors ${isTabActive('/folders') ? 'text-blue-500 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
          <i className="fa-solid fa-folder text-xl"></i>
        </Link>

        {/* Centered Action Button */}
        <Link to="/create-note?mode=private" className="text-white bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 -translate-y-4 active:scale-90 transition-transform">
          <i className="fa-solid fa-plus text-2xl"></i>
        </Link>

        <Link to="/feed" className={`p-3 rounded-xl transition-colors ${isTabActive('/feed') ? 'text-blue-500 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
          <i className="fa-solid fa-rss text-xl"></i>
        </Link>
        <button onClick={toggleTheme} className="p-3 text-[var(--text-muted)] rounded-xl">
          <i className={`fa-solid ${isLight ? "fa-moon" : "fa-sun"} text-xl`}></i>
        </button>
      </nav>
    </>
  );
}
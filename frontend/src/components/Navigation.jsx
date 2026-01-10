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
          : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)]"
        }`}
    >
      <i className={`fa-solid ${icon} ${isActive ? "text-white" : "group-hover:text-blue-400"}`}></i>
      {/* Changed text-white to var text-main */}
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}

export function Navigation() {
  const location = useLocation();
  const [ isLight, setIsLight ] = useState(document.body.classList.contains("light"));

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

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] hidden lg:flex flex-col p-6 z-50 transition-colors">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-[var(--text-main)]">
            <i className="fa-solid fa-file-lines text-blue-500"></i>
            NotePad+
          </h1>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink icon="fa-grip" label="Dashboard" to="/dashboard" />
          <NavLink icon="fa-solid fa-rss" label="Feed" to="/feed" />

          <div className="my-4 border-t border-[var(--border-color)] pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Workspace</p>
            <NavLink icon="fa-folder" label="Folders" to="/folders" />
            <NavLink icon="fa-bookmark" label="Saved Notes" to="/saved" />
          </div>

          <div className="my-4 border-t border-[var(--border-color)] pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Activity</p>
            <NavLink icon="fa-plus-circle" label="Add Note" to="/create-note?mode=private" />
            <NavLink icon="fa-user" label="Profile" to="/account" />
          </div>
        </nav>

        <button
          onClick={toggleTheme}
          className="mt-4 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all border border-[var(--border-color)]"
        >
          <i className={`fa-solid ${isLight ? "fa-moon" : "fa-sun"} text-blue-500`}></i>
          <span className="font-bold text-xs uppercase tracking-widest">{isLight ? "Dark" : "Light"}</span>
        </button>
      </aside>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex justify-around items-center p-4 z-50">
        <Link to="/dashboard" className="p-2 text-[var(--text-muted)]"><i className="fa-solid fa-grip text-xl"></i></Link>
        <Link to="/saved" className="p-2 text-[var(--text-muted)]"><i className="fa-solid fa-bookmark text-xl"></i></Link>
        <Link to="/create-note?mode=private" className="text-white bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-plus text-xl"></i></Link>
        <Link to="/feed" className="p-2 text-[var(--text-muted)]"><i className="fa-solid fa-rss text-xl"></i></Link>
        <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)]">
          <i className={`fa-solid ${isLight ? "fa-moon" : "fa-sun"} text-xl`}></i>
        </button>
      </nav>
    </>
  );
}
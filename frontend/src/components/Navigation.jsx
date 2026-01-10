import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function NavLink({ icon, label, to }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        isActive
          ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-blue-900/20"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]"
      }`}
    >
      <i
        className={`fa-solid ${icon} ${
          isActive ? "text-white" : "group-hover:text-[var(--accent-primary)]"
        }`}
      ></i>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}

export function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Helper function to check if a mobile link is active
  const isMobileActive = (path) =>
    location.pathname === path
      ? "text-[var(--accent-primary)]"
      : "text-[var(--text-muted)]";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] hidden lg:flex flex-col p-6 z-50 transition-colors duration-300">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-[var(--text-main)]">
            <i className="fa-solid fa-file-lines text-[var(--accent-primary)]"></i>
            NotePad+
          </h1>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink icon="fa-grip" label="Dashboard" to="/dashboard" />
          <NavLink icon="fa-solid fa-rss" label="Feed" to="/feed" />

          <div className="my-4 border-t border-[var(--border-subtle)] pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-faint)] mb-2">
              Workspace
            </p>
            <NavLink icon="fa-folder" label="Folders" to="/folders" />
            <NavLink icon="fa-bookmark" label="Saved Notes" to="/saved" />
          </div>

          <div className="my-4 border-t border-[var(--border-subtle)] pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-faint)] mb-2">
              Activity
            </p>
            <NavLink
              icon="fa-plus-circle"
              label="Add Note"
              to="/create-note?mode=private"
            />
            <NavLink icon="fa-user" label="Profile" to="/account" />
          </div>
        </nav>

        {/* Desktop Theme Toggle at Bottom */}
        <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-300 group cursor-pointer"
            aria-label="Toggle theme"
          >
            <i
              className={`fa-solid ${
                theme === "dark" ? "fa-moon" : "fa-sun"
              } text-xl group-hover:text-[var(--accent-primary)] transition-colors`}
            ></i>
            <span className="font-bold text-sm tracking-tight">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-sidebar)]/90 backdrop-blur-xl border-t border-[var(--border-subtle)] flex justify-around items-center p-4 z-50 transition-colors duration-300">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`p-2 transition-colors ${isMobileActive("/dashboard")}`}
        >
          <i className="fa-solid fa-grip text-xl"></i>
        </Link>

        {/* Saved */}
        <Link
          to="/saved"
          className={`p-2 transition-colors ${isMobileActive("/saved")}`}
        >
          <i className="fa-solid fa-bookmark text-xl"></i>
        </Link>

        {/* Feed */}
        <Link
          to="/feed"
          className={`p-2 transition-colors ${isMobileActive("/feed")}`}
        >
          <i className="fa-solid fa-rss text-xl"></i>
        </Link>

        {/* Add Note */}
        <Link
          to="/create-note?mode=private"
          className={`p-2 transition-colors ${isMobileActive("/create-note")}`}
        >
          <i className="fa-solid fa-plus-circle text-xl"></i>
        </Link>

        {/* Profile */}
        <Link
          to="/account"
          className={`p-2 transition-colors ${isMobileActive("/account")}`}
        >
          <i className="fa-solid fa-user text-xl"></i>
        </Link>
      </nav>
    </>
  );
}

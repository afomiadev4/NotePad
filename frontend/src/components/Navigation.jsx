import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-bold bg-white/10"
      : "text-slate-400 hover:text-primary hover:bg-white/5";

  const baseItem = "flex items-center gap-3 rounded-xl px-4 py-2 transition";

  return (
    <footer
      className="
        fixed bottom-0 left-0 right-0 z-20
        border-t border-slate-200/10
        bg-background-dark/80 backdrop-blur-sm

        lg:fixed lg:top-0 lg:left-0 lg:z-30
        lg:w-64 lg:h-screen
        lg:border-t-0 lg:border-r lg:border-slate-200/10
      "
    >
      <nav
        className="
          mx-auto flex max-w-lg items-center justify-around
          px-2 pb-2 pt-1.5

          lg:mx-0 lg:max-w-none
          lg:flex-col lg:items-stretch lg:justify-center
          lg:gap-2 lg:px-4 lg:pt-10
          h-full
        "
      >
        <Link
          to="/dashboard"
          className={`${baseItem} ${isActive("/dashboard")}`}
        >
          <i className="fa-solid fa-gauge-high text-lg text-white"></i>
          <span className="text-xs lg:text-sm font-medium ">Dashboard</span>
        </Link>
        <Link to="/folders" className={`${baseItem} ${isActive("/folders")}`}>
          <i className="fa-solid fa-folder-open text-lg"></i>
          <span className="text-xs lg:text-sm font-medium">Folders</span>
        </Link>

        <Link to="/add-note" className={`${baseItem} ${isActive("/add-note")}`}>
          <i className="fa-solid fa-circle-plus text-lg"></i>
          <span className="text-xs lg:text-sm font-medium">Add Note</span>
        </Link>

        <Link
          to="/post-note"
          className={`${baseItem} ${isActive("/post-note")}`}
        >
          <i className="fa-solid fa-paper-plane text-lg"></i>
          <span className="text-xs lg:text-sm font-medium">Post Note</span>
        </Link>

        <Link to="/feed" className={`${baseItem} ${isActive("/feed")}`}>
          <i className="fa-solid fa-rss text-lg"></i>
          <span className="text-xs lg:text-sm font-medium">Feed</span>
        </Link>

        <Link to="/account" className={`${baseItem} ${isActive("/account")}`}>
          <i className="fa-solid fa-user text-lg"></i>
          <span className="text-xs lg:text-sm font-medium">Account</span>
        </Link>
      </nav>
    </footer>
  );
}

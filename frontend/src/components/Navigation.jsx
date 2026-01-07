import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-500 font-bold bg-white/10"
      : "text-slate-400 hover:text-blue-400 hover:bg-white/5";

  // Added 'justify-center lg:justify-start' to center icons on mobile
  const baseItem = "flex items-center gap-3 rounded-xl px-4 py-3 lg:py-2 transition active:scale-90 lg:active:scale-100";

  return (
    <footer
      className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-white/10
        bg-black/80 backdrop-blur-md

        lg:fixed lg:top-0 lg:left-0 lg:z-30
        lg:w-64 lg:h-screen
        lg:border-t-0 lg:border-r lg:border-white/10
      "
    >
      <nav
        className="
          mx-auto flex max-w-full items-center justify-around
          px-2 pb-safe pt-1

          lg:mx-0 lg:max-w-none
          lg:flex-col lg:items-stretch lg:justify-start
          lg:gap-2 lg:px-4 lg:pt-10
          h-full
        "
      >
        {/* DASHBOARD */}
        <Link to="/dashboard" className={`${baseItem} ${isActive("/dashboard")}`}>
          <i className="fa-solid fa-gauge-high text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Dashboard</span>
        </Link>

        {/* FOLDERS */}
        <Link to="/folders" className={`${baseItem} ${isActive("/folders")}`}>
          <i className="fa-solid fa-folder-open text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Folders</span>
        </Link>

        {/* ADD NOTE (PRIVATE) */}
        <Link to="/add-note" className={`${baseItem} ${isActive("/add-note")}`}>
          <i className="fa-solid fa-circle-plus text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Add Note</span>
        </Link>

        {/* POST NOTE (PUBLIC) */}
        <Link to="/post-note" className={`${baseItem} ${isActive("/post-note")}`}>
          <i className="fa-solid fa-paper-plane text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Post Note</span>
        </Link>

        {/* FEED */}
        <Link to="/feed" className={`${baseItem} ${isActive("/feed")}`}>
          <i className="fa-solid fa-rss text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Feed</span>
        </Link>

        {/* BOOKMARKS */}
        <Link to="/saved" className={`${baseItem} ${isActive("/saved")}`}>
          <i className="fa-solid fa-bookmark text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Bookmarks</span>
        </Link>

        {/* ACCOUNT */}
        <Link to="/account" className={`${baseItem} ${isActive("/account")}`}>
          <i className="fa-solid fa-user text-xl lg:text-lg"></i>
          <span className="hidden lg:block text-sm font-medium">Account</span>
        </Link>
      </nav>
    </footer>
  );
}
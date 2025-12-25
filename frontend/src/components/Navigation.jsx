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

        md:static md:w-64 md:h-screen
        md:border-t-0 md:border-r md:border-slate-200/10
      "
    >
      <nav
        className="
          mx-auto flex max-w-md items-center justify-around
          px-2 pb-2 pt-1.5

          md:mx-0 md:max-w-none
          md:flex-col md:items-stretch md:justify-center
          md:gap-2 md:px-4 md:pt-10
          h-full
        "
      >
        <Link to="/notes" className={`${baseItem} ${isActive("/notes")}`}>
          <i className="fa-solid fa-pen-to-square text-lg"></i>
          <span className="text-xs md:text-sm font-medium">Notes</span>
        </Link>

        <Link to="/upload" className={`${baseItem} ${isActive("/upload")}`}>
          <i className="fa-solid fa-upload text-lg"></i>
          <span className="text-xs md:text-sm font-medium">Upload</span>
        </Link>

        <Link to="/feed" className={`${baseItem} ${isActive("/feed")}`}>
          <i className="fa-solid fa-rss text-lg"></i>
          <span className="text-xs md:text-sm font-medium">Feed</span>
        </Link>

        <Link to="/account" className={`${baseItem} ${isActive("/account")}`}>
          <i className="fa-solid fa-user text-lg"></i>
          <span className="text-xs md:text-sm font-medium">Account</span>
        </Link>
      </nav>
    </footer>
  );
}

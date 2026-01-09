import { Link, useLocation } from "react-router-dom";

function NavLink({ icon, label, to }) {
  const location = useLocation();
  // We use startsWith to keep the link active if we are on a sub-route (like /folders/123)
  const isActive = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      <i className={`fa-solid ${icon} ${isActive ? "text-white" : "group-hover:text-blue-400"}`}></i>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}

export function Navigation() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-white/5 hidden lg:flex flex-col p-6 z-50">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-white">
            <i className="fa-solid fa-file-lines text-blue-500"></i>
            NotePad+
          </h1>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink icon="fa-grip" label="Dashboard" to="/dashboard" />
          <NavLink icon="fa-solid fa-rss" label="Feed" to="/feed" />
          
          <div className="my-4 border-t border-white/5 pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Workspace</p>
            <NavLink icon="fa-folder" label="Folders" to="/folders" />
            <NavLink icon="fa-bookmark" label="Saved Notes" to="/saved" />
          </div>

          <div className="my-4 border-t border-white/5 pt-4">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Activity</p>
            <NavLink icon="fa-bell" label="Notifications" to="/notifications" />
            {/* Defaults to private when clicked from the sidebar */}
            <NavLink icon="fa-plus-circle" label="Add Note" to="/create-note?mode=private" />
            <NavLink icon="fa-user" label="Profile" to="/account" />
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center p-4 z-50">
        <Link to="/dashboard" className="p-2 text-white/40 hover:text-white transition-colors">
          <i className="fa-solid fa-grip text-xl"></i>
        </Link>
        <Link to="/notifications" className="p-2 text-white/40 hover:text-white transition-colors">
          <i className="fa-solid fa-bell text-xl"></i>
        </Link>
        <Link 
          to="/create-note?mode=private" 
          className="text-white hover:scale-110 transition flex items-center justify-center bg-blue-600 w-12 h-12 rounded-2xl shadow-lg shadow-blue-600/40"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </Link>
        <Link to="/feed" className="p-2 text-white/40 hover:text-white transition-colors">
          <i className="fa-solid fa-rss text-xl"></i>
        </Link>
        <Link to="/account" className="p-2 text-white/40 hover:text-white transition-colors">
          <i className="fa-solid fa-user text-xl"></i>
        </Link>
      </nav>
    </>
  );
}
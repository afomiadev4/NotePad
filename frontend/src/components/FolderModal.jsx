import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

const ICONS = [ "fa-folder", "fa-heart", "fa-star", "fa-book", "fa-lightbulb", "fa-code", "fa-briefcase", "fa-graduation-cap" ];
const COLORS = [
  { name: "Blue", class: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Rose", class: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Amber", class: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Emerald", class: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Indigo", class: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Purple", class: "text-purple-500", bg: "bg-purple-500/10" },
];

export function FolderModal({ isOpen, onClose, onRefresh, folder }) {
  const user = useSelector((state) => state.auth.user);
  const [ name, setName ] = useState("");
  const folderRef = useRef();
  const [ selectedIcon, setSelectedIcon ] = useState(ICONS[ 0 ]);
  const [ selectedColor, setSelectedColor ] = useState(COLORS[ 0 ]);

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setSelectedIcon(folder.icon || ICONS[ 0 ]);
      const colorMatch = COLORS.find((c) => c.class === folder.color) || COLORS[ 0 ];
      setSelectedColor(colorMatch);
    } else {
      setName("");
      setSelectedIcon(ICONS[ 0 ]);
      setSelectedColor(COLORS[ 0 ]);
    }
  }, [ folder, isOpen ]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    const folderData = {
      name,
      icon: selectedIcon,
      color: selectedColor.class,
      user_id: user.id
    };

    if (folder) {
      await supabase.from("folders").update(folderData).eq("id", folder.id);
    } else {
      await supabase.from("folders").insert([ folderData ]);
    }

    onRefresh();
    onClose();
  };

  const validateClick = (e) => {
    if (folderRef.current && !folderRef.current.contains(e.target)) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={validateClick}>
      <div
        className="w-full max-w-md bg-[var(--bg-secondary)] backdrop-blur-2xl rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        ref={folderRef}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">
            {folder ? "Edit Folder" : "New Folder"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Folder Preview Circle */}
          <div className="flex flex-col items-center justify-center p-6 bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-color)] mx-auto w-32 h-32 mb-2 shadow-inner">
            <i className={`fa-solid ${selectedIcon} text-5xl ${selectedColor.class} drop-shadow-sm`}></i>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Folder Name</label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-blue-500 outline-none text-[var(--text-main)] font-bold transition-all placeholder:[var(--text-muted)]"
              value={name}
              placeholder="e.g. Daily Journals"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Select Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon} type="button" onClick={() => setSelectedIcon(icon)}
                  className={`p-4 rounded-2xl border transition-all ${selectedIcon === icon ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-95" : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-main)]"}`}
                >
                  <i className={`fa-solid ${icon}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Select Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name} type="button" onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor.name === color.name ? "border-[var(--text-main)] scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"} ${color.bg}`}
                >
                  <div className={`w-3 h-3 rounded-full mx-auto ${color.class}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-black text-xs uppercase tracking-widest hover:bg-[var(--bg-secondary)] transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {folder ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
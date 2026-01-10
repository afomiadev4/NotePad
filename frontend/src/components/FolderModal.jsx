import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

const ICONS = [
  "fa-folder",
  "fa-heart",
  "fa-star",
  "fa-book",
  "fa-lightbulb",
  "fa-code",
  "fa-briefcase",
  "fa-graduation-cap",
];
const COLORS = [
  { name: "Blue", class: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Rose", class: "text-rose-400", bg: "bg-rose-400/10" },
  { name: "Amber", class: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Emerald", class: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Indigo", class: "text-indigo-400", bg: "bg-indigo-400/10" },
  { name: "Purple", class: "text-purple-400", bg: "bg-purple-400/10" },
];

export function FolderModal({ isOpen, onClose, onRefresh, folder }) {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const folderRef = useRef();
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setSelectedIcon(folder.icon || ICONS[0]);
      const colorMatch =
        COLORS.find((c) => c.class === folder.color) || COLORS[0];
      setSelectedColor(colorMatch);
    } else {
      setName("");
      setSelectedIcon(ICONS[0]);
      setSelectedColor(COLORS[0]);
    }
  }, [folder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    const folderData = {
      name,
      icon: selectedIcon,
      color: selectedColor.class,
      user_id: user.id,
    };

    if (folder) {
      // Update existing
      await supabase.from("folders").update(folderData).eq("id", folder.id);
    } else {
      // Create new
      await supabase.from("folders").insert([folderData]);
    }

    onRefresh();
    onClose();
  };

  const validateClick = (e) => {
    if (folderRef.current && !folderRef.current.contains(e.target)) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={validateClick}
    >
      <div
        className="w-full max-w-md bg-[var(--bg-card)] backdrop-blur-2xl rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden transition-colors"
        ref={folderRef}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--heading-main)] tracking-tight">
              {folder ? "Edit Folder" : "New Folder"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-[var(--bg-input)] rounded-3xl border border-[var(--border-subtle)] mx-auto w-32 h-32 mb-2">
            <i
              className={`fa-solid ${selectedIcon} text-5xl ${selectedColor.class}`}
            ></i>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
              Folder Name
            </label>
            <input
              type="text"
              className="w-full px-5 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-main)] placeholder-[var(--text-faint)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
              Select Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedIcon === icon
                      ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white"
                      : "bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <i className={`fa-solid ${icon}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? "border-[var(--text-main)] scale-110"
                      : "border-transparent"
                  } ${color.bg}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mx-auto ${color.class}`}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] font-bold transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              {folder ? "Save Changes" : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";

const ICONS = [
  "fa-folder", "fa-heart", "fa-star", "fa-book",
  "fa-lightbulb", "fa-code", "fa-briefcase", "fa-graduation-cap",
];

const COLORS = [
  { name: "Blue", class: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Rose", class: "text-rose-400", bg: "bg-rose-400/10" },
  { name: "Amber", class: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Emerald", class: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Indigo", class: "text-indigo-400", bg: "bg-indigo-400/10" },
  { name: "Purple", class: "text-purple-400", bg: "bg-purple-400/10" },
];

export function FolderModal({ isOpen, onClose, onCreate, folder }) {
  const [name, setName] = useState("");
  const folderRef = useRef();
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setSelectedIcon(folder.icon || ICONS[0]);
      const colorMatch = COLORS.find((c) => c.class === folder.color) || COLORS[0];
      setSelectedColor(colorMatch);
    } else {
      setName("");
      setSelectedIcon(ICONS[0]);
      setSelectedColor(COLORS[0]);
    }
  }, [folder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name,
      icon: selectedIcon,
      color: selectedColor.class,
    });

    if (!folder) {
      setName("");
      setSelectedIcon(ICONS[0]);
      setSelectedColor(COLORS[0]);
    }
  };

  const validateClick = (e) => {
    if (folderRef.current && !folderRef.current.contains(e.target)) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300 font-display" 
      onClick={validateClick}
    >
      <div 
        className="w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" 
        ref={folderRef}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {folder ? "Edit Folder" : "New Folder"}
            </h2>
            <p className="text-[11px] text-white/40 mt-0.5 font-medium tracking-wide uppercase">
              Organize your thoughts
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all group"
          >
            <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/5 mx-auto w-32 h-32 mb-2">
            <i className={`fa-solid ${selectedIcon} text-5xl ${selectedColor.class}`}></i>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
              Folder Name
            </label>
            <input
              type="text"
              autoFocus
              disabled={folder?.id === 'uncategorized'}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-lg font-semibold text-white disabled:opacity-50"
              placeholder="e.g. Daily Ideas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
              Select Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map((icon) => (
                <button 
                  key={icon} 
                  type="button" 
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 rounded-xl border transition-all ${selectedIcon === icon ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                >
                  <i className={`fa-solid ${icon} text-lg`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button 
                  key={color.name} 
                  type="button" 
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor.name === color.name ? "border-white scale-110 shadow-lg" : "border-transparent"} ${color.bg}`}
                >
                  <div className={`w-3 h-3 rounded-full mx-auto ${color.class}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all text-white text-sm font-bold shadow-lg"
            >
              {folder ? "Save Changes" : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
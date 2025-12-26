import { useState, useEffect } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  mode = "view",
  initialFolderId = "posted",
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: "posted",
  });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        folderId: note.folderId,
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        content: "",
        folderId: initialFolderId || "posted",
      });
    }
  }, [note, mode, initialFolderId]);

  useEffect(() => {
    fetch("http://localhost:3000/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  if (!isOpen) return null;

  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isReadOnly = mode === "view";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, ...formData });
  };

  const getHeaderTitle = () => {
    if (isCreate) return "New Note";
    if (isEdit) return "Refine Note";
    return "Note Details";
  };

  const getHeaderSub = () => {
    if (isCreate) return "Capture your latest inspiration";
    if (isEdit) return "Update your thoughts";
    return "Reviewing your idea";
  };

  const getSubmitLabel = () => {
    if (isCreate) return "Create Note";
    return "Save Changes";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-2xl rounded-4xl border border-white/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {getHeaderTitle()}
            </h2>
            <p className="text-[11px] text-white/40 mt-0.5 font-medium tracking-wide uppercase">
              {getHeaderSub()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 group"
          >
            <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Title Input */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
              Title
            </label>
            <input
              type="text"
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition-all duration-300 text-lg font-semibold placeholder:text-white/20 ${
                isReadOnly
                  ? "bg-transparent border-transparent px-1 py-0 cursor-default"
                  : ""
              }`}
              placeholder="Title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              readOnly={isReadOnly}
              required
            />
          </div>

          {/* Folder Selection - Hidden in Create Mode per user request */}
          {!isCreate && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <div className="relative group">
                <select
                  value={formData.folderId}
                  onChange={(e) =>
                    setFormData({ ...formData, folderId: e.target.value })
                  }
                  className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition-all duration-300 cursor-pointer appearance-none text-white/80 font-medium text-sm ${
                    isReadOnly
                      ? "bg-transparent border-transparent px-1 py-0 cursor-default pointer-events-none"
                      : ""
                  }`}
                  disabled={isReadOnly}
                >
                  {folders.map((f) => (
                    <option
                      key={f.id}
                      value={f.id}
                      className="bg-[#0f172a] text-white"
                    >
                      {f.name}
                    </option>
                  ))}
                </select>
                {!isReadOnly && (
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within:text-blue-500/50 transition-colors text-xs"></i>
                )}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
              Body Content
            </label>
            <textarea
              rows="6"
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition-all duration-300 leading-relaxed resize-none text-sm text-white/70 placeholder:text-white/20 ${
                isReadOnly
                  ? "bg-transparent border-transparent px-1 py-0 cursor-default scrollbar-hide"
                  : ""
              }`}
              placeholder="Your thoughts..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              readOnly={isReadOnly}
              required
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isReadOnly ? "Done" : "Discard"}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r bg-(--btn-primary) transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white text-sm font-bold"
              >
                {getSubmitLabel()}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

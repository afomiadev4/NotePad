import { useState, useEffect } from "react";

export function NoteModal({ note, isOpen, onClose, onSave, mode = "view" }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: "",
  });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        folderId: note.folderId,
      });
    }
  }, [note]);

  useEffect(() => {
    fetch("http://localhost:3000/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, ...formData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-(--bg-secondary) rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Note" : "View Note"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-500 ml-1">
              Title
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition text-lg font-medium ${
                !isEdit ? "pointer-events-none opacity-80" : ""
              }`}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              readOnly={!isEdit}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-500 ml-1">
              Folder
            </label>
            <select
              value={formData.folderId}
              onChange={(e) =>
                setFormData({ ...formData, folderId: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition ${
                !isEdit
                  ? "pointer-events-none opacity-80 appearance-none"
                  : "cursor-pointer"
              }`}
              disabled={!isEdit}
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#1a2232]">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-500 ml-1">
              Content
            </label>
            <textarea
              rows="10"
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition leading-relaxed resize-none ${
                !isEdit ? "pointer-events-none opacity-80" : ""
              }`}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              readOnly={!isEdit}
              required
            ></textarea>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition font-medium"
            >
              {isEdit ? "Cancel" : "Close"}
            </button>
            {isEdit && (
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-(--btn-primary) hover:bg-blue-600 transition font-bold shadow-lg"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

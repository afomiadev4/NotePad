import { useState, useEffect, useRef } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  mode = "create",
  folders = [],
  hideFolderSelection = false,
  initialFolderId,
  isPost = false, // ✅ ADD THIS
}) {
  const noteRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: initialFolderId || "",
    category: "",
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
        folderId: note.folderId || "",
        category: note.category || "",
      });
    }
  }, [note]);

  useEffect(() => {
    if (!hideFolderSelection && folders.length && !formData.folderId) {
      setFormData((prev) => ({
        ...prev,
        folderId: folders[0].id,
      }));
    }
  }, [folders, hideFolderSelection, formData.folderId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={noteRef}
      className="flex flex-col gap-6 p-6 bg-white/5 rounded-2xl border border-white/10"
    >
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/40 uppercase">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Note title..."
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-lg font-semibold text-white/80"
          required
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/40 uppercase">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          placeholder="Category..."
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-lg font-semibold text-white/80"
        />
      </div>

      {/* Folder */}
      {!hideFolderSelection && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-white/40 uppercase">
            Folder
          </label>
          <select
            value={formData.folderId}
            onChange={(e) =>
              setFormData({ ...formData, folderId: e.target.value })
            }
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-white/80 font-medium"
            required
          >
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/40 uppercase">
          Content
        </label>
        <textarea
          rows="15"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your note here..."
          className="w-full px-5 py-5 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-white/80 leading-relaxed resize-none"
          required
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
        >
          Cancel
        </button>

        {/* ✅ BUTTON TEXT SWITCH */}
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-(--btn-primary) text-white font-bold hover:brightness-105"
        >
          {isPost ? "Post" : "Save Note"}
        </button>
      </div>
    </form>
  );
}

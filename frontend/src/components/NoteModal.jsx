import { useState, useEffect, useRef } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  mode = "create",
  folders = [],
  hideFolderSelection = false,
  initialFolderId = "",
  isPost = false,
}) {
  const noteRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: "",
    category: "",
  });

  /* Load note (edit mode) */
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

  /* Default folder when folders arrive */
  useEffect(() => {
    if (!hideFolderSelection && folders.length > 0 && !formData.folderId) {
      setFormData((prev) => ({
        ...prev,
        folderId: initialFolderId || folders[0].id,
      }));
    }
  }, [folders, hideFolderSelection, initialFolderId, formData.folderId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      ref={noteRef}
      onSubmit={handleSubmit}
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
            setFormData((p) => ({ ...p, title: e.target.value }))
          }
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
            setFormData((p) => ({ ...p, category: e.target.value }))
          }
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-lg font-semibold text-white/80"
        />
      </div>

      {/* Folder dropdown */}
      {!hideFolderSelection && (
        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-bold text-white/40 uppercase">
            Folder
          </label>

          <select
            value={formData.folderId}
            onChange={(e) =>
              setFormData((p) => ({ ...p, folderId: e.target.value }))
            }
            required
            className="
              appearance-none
              px-5 py-3 pr-10
              rounded-xl
              bg-black/40
              border border-white/15
              text-white/90
              font-medium
              focus:outline-none
              focus:border-(--btn-primary)
              cursor-pointer
            "
          >
            {folders.map((folder) => (
              <option
                key={folder.id}
                value={folder.id}
                className="bg-[#0f172a] text-white"
              >
                {folder.name}
              </option>
            ))}
          </select>

          {/* Custom arrow */}
          <span className="pointer-events-none absolute right-4 top-9 text-white/50">
            ▼
          </span>
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
            setFormData((p) => ({ ...p, content: e.target.value }))
          }
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

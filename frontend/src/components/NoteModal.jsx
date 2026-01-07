import { useState, useEffect, useRef } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  onEdit,
  onDelete,
  mode = "create",
  folders = [],
  hideFolderSelection = false,
  initialFolderId,
  isPost = false,
}) {
  const noteRef = useRef(null);

  const isViewMode = mode === "view";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    folderId: "",
  });

  useEffect(() => {
    if (note) {
      setFormData({
        id: note.id,
        title: note.title || "",
        content: note.content || "",
        category: note.category || "",
        folderId: note.folderId || "uncategorized",
      });
    }
  }, [note]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      folderId: formData.folderId || "uncategorized",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={noteRef}
      className="flex min-h-[100dvh] bg-(--bg-primary) text-white"
    >
      {/* MAIN CONTENT */}
      <section className="flex-1 px-10 py-8 overflow-y-auto">
        {isViewMode ? (
          <div className="max-w-3xl">
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {formData.content}
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Start writing..."
              className="
                w-full h-[70vh]
                bg-transparent
                resize-none
                outline-none
                text-lg
                leading-relaxed
                border border-white/20
                rounded-xl
                p-6
                focus:border-(--btn-primary)
              "
            />
          </div>
        )}
      </section>
  
      {/* RIGHT PANEL */}
      <aside className="hidden lg:flex w-80 flex-col px-6 py-8 border-l border-white/10 bg-black/30 justify-between">
        <div className="flex flex-col gap-6">
        {/* TITLE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-white/40 uppercase">Title</label>
          {mode === "view" ? (
            <p className="text-white/90">
              {formData.title || "Untitled"}
            </p>
          ) : (
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
              required
            />
          )}
        </div>

        {/* CATEGORY */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-white/40">Category</label>
          {isViewMode ? (
            <p className="text-white/70">{formData.category || "—"}</p>
          ) : (
            <input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            />
          )}
        </div>

        {/* FOLDER */}
        {!hideFolderSelection && (
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase text-white/40">Folder</label>

            {isViewMode ? (
              <p className="text-white/70">
                {folders.find((f) => f.id === formData.folderId)?.name ||
                  "Uncategorized"}
              </p>
            ) : (
              <select
                value={formData.folderId}
                onChange={(e) =>
                  setFormData({ ...formData, folderId: e.target.value })
                }
                className="w-full
                  px-4 py-2.5
                  rounded-xl
                  bg-white/5
                  text-white
                  border border-white/10
                  focus:outline-none
                  focus:ring-2
                  focus:ring-(--btn-primary)/40
                  focus:border-(--btn-primary)
                  transition
                  apperance-none"
              >
                {folders.map((f) => (
                  <option 
                    key={f.id} 
                    value={f.id}
                    className="bg-[#0b1220] text-white"
                    >
                    {f.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        </div>
        {/* FOOTER BUTTONS */}
        <div className="flex gap-3">
          {isViewMode ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-(--btn-primary)"
              >
                {isPost ? "Post" : "Save"}
              </button>
            </>
          )}
        </div>
      </aside>
    </form>
  );
}

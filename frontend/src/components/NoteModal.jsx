import { useState, useEffect, useRef } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  folders = [],
}) {
  const formRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const categories = [
    "General",
    "Life",
    "Questions",
    "Fun/Random",
    "Creative",
    "Thoughts",
  ];

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    folderId: "uncategorized",
    visibility: "Private",
  });

  // This effect runs every time a note is clicked/opened
  useEffect(() => {
    if (isOpen && note) {
      setFormData({
        id: note.id,
        title: note.title || "Untitled",
        content: note.content || "",
        category: note.category || "General",
        folderId: note.folder_id || "uncategorized", // Changed to folder_id to match Supabase snake_case
        visibility: note.visibility || "Private",
      });
      setIsEditing(false);
    }
  }, [note, isOpen]);

  if (!isOpen || !note) return null; // Safety check: if no note, don't render anything

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      folder_id:
        formData.folderId === "uncategorized" ? null : formData.folderId,
    });
    setIsEditing(false);
  };

  const handleClick = (e) => {
    if (!formRef.current.contains(e.target)) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-12 bg-black/80 backdrop-blur-sm"
      onClick={handleClick}
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col lg:flex-row w-full max-w-6xl h-full lg:h-[85vh] bg-[var(--bg-page)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300"
        ref={formRef}
      >
        {/* LEFT SIDE: CONTENT */}
        <section className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto custom-scrollbar">
          {!isEditing ? (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black mb-8 tracking-tighter border-b border-white/5 pb-4">
                {formData.title}
              </h2>
              {/* Displaying content safely */}
              <div
                className="text-white/70 leading-relaxed text-lg ql-editor !p-0 prose-invert"
                dangerouslySetInnerHTML={{
                  __html:
                    formData.content ||
                    "<p className='italic text-white/20'>No content...</p>",
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-6 animate-in zoom-in-95 duration-200">
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Note Title"
                className="bg-transparent text-3xl font-bold outline-none border-b border-[var(--border-subtle)] pb-4 focus:border-[var(--accent-primary)] transition text-[var(--text-main)] placeholder-[var(--text-faint)]"
                required
              />
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Start writing..."
                className="flex-1 bg-[var(--bg-input)] resize-none outline-none text-lg leading-relaxed rounded-2xl p-6 focus:border-[var(--accent-primary)]/50 border border-transparent transition text-[var(--text-main)] placeholder-[var(--text-faint)]"
              />
            </div>
          )}
        </section>

        {/* RIGHT SIDE: SETTINGS */}
        <aside className="w-full lg:w-80 flex flex-col px-6 py-8 border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-900/50 justify-between">
          <div className="flex flex-col gap-8">
            {/* TOGGLE BUTTON */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                Mode
              </label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <i className="fa-solid fa-eye text-blue-400"></i> Read Mode
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-pen-to-square text-blue-400"></i>{" "}
                    Edit Note
                  </>
                )}
              </button>
            </div>

            {isEditing && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                    Folder
                  </label>
                  <select
                    value={formData.folderId}
                    onChange={(e) =>
                      setFormData({ ...formData, folderId: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold outline-none"
                  >
                    <option value="uncategorized" className="bg-zinc-900">
                      No Folder
                    </option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id} className="bg-zinc-900">
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            {isEditing ? (
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-blue-600/20"
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={onDelete}
                className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition"
              >
                Delete Note
              </button>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}

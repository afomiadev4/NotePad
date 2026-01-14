import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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

  const [wordCount, setWordCount] = useState(0);
  const WORD_LIMIT = 300;

  useEffect(() => {
    const plainText = (formData.content || "").replace(/<[^>]*>/g, " ");
    const words = plainText.match(/\b[-?(\w+)]+\b/gi);
    setWordCount(words ? words.length : 0);
  }, [formData.content]);

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
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-1 right-2 z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-input) hover:bg-(--bg-card-hover) border border-(--border-subtle) text-(--text-muted) hover:text-(--text-main) transition-all transform hover:rotate-90 group"
        >
          <i className="fa-solid fa-xmark text-xl group-hover:scale-110 transition-transform"></i>
        </button>

        {/* LEFT SIDE: CONTENT */}
        <section className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto custom-scrollbar">
          {!isEditing ? (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black mb-8 tracking-tighter border-b border-(--border-subtle) pb-4">
                {formData.title}
              </h2>
              {/* Displaying content safely */}
              <div
                className="text-(--text-main) opacity-80 leading-relaxed text-lg ql-editor !p-0 prose-invert"
                dangerouslySetInnerHTML={{
                  __html:
                    formData.content ||
                    "<p class='italic opacity-40'>No content...</p>",
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
              {/* WORD COUNTER */}
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-(--text-faint)">
                <span>
                  Words:{" "}
                  <span
                    className={
                      formData.visibility === "Public" && wordCount > WORD_LIMIT
                        ? "text-red-500"
                        : "text-blue-400"
                    }
                  >
                    {wordCount}
                    {formData.visibility === "Public" ? ` / ${WORD_LIMIT}` : ""}
                  </span>
                </span>
                {formData.visibility === "Public" && (
                  <div className="flex-1 h-1 bg-(--bg-card) rounded-full overflow-hidden max-w-[100px]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        wordCount > WORD_LIMIT ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (wordCount / WORD_LIMIT) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 bg-[var(--bg-input)] rounded-2xl overflow-hidden border border-transparent focus-within:border-[var(--accent-primary)]/50 transition">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Start writing..."
                  className="h-full text-[var(--text-main)] editor-custom"
                />
              </div>
            </div>
          )}
        </section>

        {/* RIGHT SIDE: SETTINGS */}
        <aside className="w-full lg:w-80 flex flex-col px-6 py-8 border-t lg:border-t-0 lg:border-l border-(--border-subtle) bg-(--bg-sidebar) justify-between">
          <div className="flex flex-col gap-8">
            {/* TOGGLE BUTTON */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-(--text-faint) ml-1">
                Mode
              </label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-4 rounded-2xl bg-(--bg-input) border border-(--border-subtle) text-[10px] font-black uppercase tracking-widest hover:bg-(--bg-card-hover) transition-all flex items-center justify-center gap-2"
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-(--text-faint) ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-(--bg-input) border border-(--border-subtle) text-sm font-bold outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-(--bg-page)">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-(--text-faint) ml-1">
                    Folder
                  </label>
                  <select
                    value={formData.folderId}
                    onChange={(e) =>
                      setFormData({ ...formData, folderId: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-(--bg-input) border border-(--border-subtle) text-sm font-bold outline-none"
                  >
                    <option value="uncategorized" className="bg-(--bg-page)">
                      No Folder
                    </option>
                    {folders.map((f) => (
                      <option
                        key={f.id}
                        value={f.id}
                        className="bg-(--bg-page)"
                      >
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
      <style>{`
        .editor-custom .ql-toolbar { border: none !important; border-bottom: 1px solid var(--border-subtle) !important; padding: 1rem !important; }
        .editor-custom .ql-container { border: none !important; font-size: 1.1rem; font-family: inherit; }
        .editor-custom .ql-editor { padding: 1.5rem !important; min-height: 40vh; color: var(--text-main); }
        .editor-custom .ql-editor.ql-blank::before { color: var(--text-faint) !important; left: 1.5rem !important; }
        .ql-snow .ql-stroke { stroke: var(--text-main) !important; }
        .ql-snow .ql-fill { fill: var(--text-main) !important; }
        .ql-snow .ql-picker { color: var(--text-main) !important; }
        .ql-snow .ql-picker-options { background-color: var(--bg-page) !important; border-color: var(--border-subtle) !important; }
      `}</style>
    </div>
  );
}

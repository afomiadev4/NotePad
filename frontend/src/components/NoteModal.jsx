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
  isPost = false,
}) {
  const noteRef = useRef(null);
  const isViewMode = mode === "view";
  const categories = [ "General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts" ];

  const [ formData, setFormData ] = useState({
    title: "",
    content: "",
    category: "General",
    folderId: "uncategorized",
    visibility: "Private",
  });

  useEffect(() => {
    if (note) {
      setFormData({
        id: note.id,
        title: note.title || "",
        content: note.content || "",
        category: note.category || "General",
        folderId: note.folder_id || note.folderId || "uncategorized",
        visibility: note.visibility || "Private",
      });
    }
  }, [ note, isOpen ]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      folderId: formData.folderId || "uncategorized",
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 lg:p-12 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col lg:flex-row w-full max-w-6xl h-full lg:h-[85vh] bg-[var(--bg-primary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Main Writing/Viewing Area */}
        <section className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto no-scrollbar">
          {isViewMode ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight text-[var(--text-main)]">
                {formData.title}
              </h2>
              <div
                className="text-[var(--text-muted)] leading-relaxed text-lg prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-6">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Name your thought..."
                className="bg-transparent text-3xl md:text-4xl font-black outline-none border-b border-[var(--border-color)] pb-6 focus:border-blue-500 transition-colors placeholder:[var(--text-muted)] opacity-80 focus:opacity-100"
                required
              />
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Start writing without limits..."
                className="flex-1 bg-[var(--bg-secondary)] resize-none outline-none text-lg leading-relaxed rounded-[2rem] p-8 focus:ring-1 focus:ring-blue-500/30 border border-[var(--border-color)] transition-all text-[var(--text-main)]"
              />
            </div>
          )}
        </section>

        {/* Sidebar Settings Area */}
        <aside className="w-full lg:w-80 flex flex-col px-6 py-8 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] bg-[var(--bg-secondary)] justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Post Settings</span>
              <button type="button" onClick={onClose} className="p-2 text-[var(--text-muted)]"><i className="fa-solid fa-xmark"></i></button>
            </div>

            {!isViewMode && (
              <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Visibility</label>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${formData.visibility === 'Public' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                    {formData.visibility}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: formData.visibility === 'Public' ? 'Private' : 'Public' })}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  {formData.visibility === 'Public' ? 'Switch to Private' : 'Go Public'}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Category</label>
              {isViewMode ? (
                <span className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl text-xs w-fit font-black uppercase tracking-widest">{formData.category}</span>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-bold outline-none focus:border-blue-500 transition-all text-[var(--text-main)] appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            {!hideFolderSelection && !isViewMode && (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Archive Location</label>
                <select
                  value={formData.folderId}
                  onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-bold outline-none focus:border-blue-500 transition-all text-[var(--text-main)] cursor-pointer"
                >
                  <option value="uncategorized">No Folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 mt-10 lg:mt-0">
            {isViewMode ? (
              <>
                <button type="button" onClick={onEdit} className="flex-1 px-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-black text-[10px] uppercase tracking-widest hover:text-blue-500 transition-colors">Edit</button>
                <button type="button" onClick={onDelete} className="flex-1 px-4 py-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Delete</button>
              </>
            ) : (
              <>
                <button type="button" onClick={onClose} className="flex-1 px-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-black text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">Cancel</button>
                <button type="submit" className="flex-[2] px-4 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-primary)] font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">
                  {formData.visibility === "Public" ? "Broadcast Thought" : "Save to Archive"}
                </button>
              </>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
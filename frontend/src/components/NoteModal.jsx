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
  const categories = ["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"];
  
  const [formData, setFormData] = useState({
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
        folderId: note.folderId || "uncategorized",
        visibility: note.visibility || "Private",
      });
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      folderId: formData.folderId || "uncategorized",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-12 bg-black/80 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col lg:flex-row w-full max-w-6xl h-full lg:h-[85vh] bg-(--bg-primary) text-white border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <section className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
          {isViewMode ? (
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">{formData.title}</h2>
              <div 
                className="text-white/80 leading-relaxed text-lg ql-editor"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-4">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note Title"
                className="bg-transparent text-3xl font-bold outline-none border-b border-white/5 pb-4 focus:border-blue-500 transition"
                required
              />
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Start writing..."
                className="flex-1 bg-white/5 resize-none outline-none text-lg leading-relaxed rounded-2xl p-6 focus:border-blue-500/50 border border-transparent transition"
              />
            </div>
          )}
        </section>

        <aside className="w-full lg:w-80 flex flex-col px-6 py-8 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/[0.02] justify-between">
          <div className="flex flex-col gap-6">
            {!isViewMode && (
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Visibility</label>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${formData.visibility === 'Public' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {formData.visibility}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, visibility: formData.visibility === 'Public' ? 'Private' : 'Public'})}
                  className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition"
                >
                  {formData.visibility === 'Public' ? 'Make Private' : 'Post to Feed'}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Category</label>
              {isViewMode ? (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs w-fit font-bold uppercase">{formData.category}</span>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-blue-500 transition"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            {!hideFolderSelection && !isViewMode && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Folder</label>
                <select
                  value={formData.folderId}
                  onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-blue-500 transition"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8 lg:mt-0">
            {isViewMode ? (
              <>
                <button type="button" onClick={onEdit} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm">Edit</button>
                <button type="button" onClick={onDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-sm">Delete</button>
              </>
            ) : (
              <>
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition shadow-lg shadow-blue-600/20">
                  {formData.visibility === "Public" ? "Post" : "Save"}
                </button>
              </>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
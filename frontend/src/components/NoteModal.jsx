import { useState, useEffect } from "react";

export function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  folders = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    folderId: "uncategorized",
    visibility: "Private",
  });

  // Update form data when note opens
  useEffect(() => {
    if (isOpen && note) {
      setFormData({
        id: note.id,
        title: note.title || "Untitled",
        content: note.content || "",
        category: note.category || "General",
        folderId: note.folder_id || "uncategorized",
        visibility: note.visibility || "Private",
      });
      setIsEditing(false); // start in read-only
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  if (!note) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 text-white font-black italic">
      LOADING NOTE...
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      folder_id: formData.folderId === "uncategorized" ? null : formData.folderId,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-12 bg-black/90 backdrop-blur-md transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col lg:flex-row w-full max-w-6xl h-full lg:h-[85vh] bg-black text-white border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
      >
        {/* MAIN VIEWING/EDITING AREA */}
        <section className="flex-1 px-8 lg:px-12 py-10 overflow-y-auto">
          {!isEditing ? (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-5xl font-black mb-8 tracking-tighter text-white">
                {formData.title}
              </h2>
              <div
                className="text-white/70 leading-relaxed text-xl ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: formData.content || "<p>No content in this note.</p>" }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-200">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-transparent text-4xl font-black outline-none border-b border-white/10 pb-4 focus:border-blue-500 transition"
                autoFocus
              />
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Start writing..."
                className="flex-1 bg-white/5 resize-none outline-none text-xl leading-relaxed rounded-2xl p-8 border border-white/5 focus:border-white/10 transition"
              />
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 flex flex-col px-8 py-10 border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-900/40 justify-between">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Mode</label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-4 rounded-2xl bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-blue-400"
              >
                {isEditing ? "✨ Viewing Note" : "📝 Edit Content"}
              </button>
            </div>

            {isEditing && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold outline-none"
                  >
                    {["General", "Life", "Questions", "Fun/Random", "Creative", "Thoughts"].map(cat => (
                      <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Folder (optional) */}
                {folders.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Folder</label>
                    <select
                      value={formData.folderId}
                      onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold outline-none"
                    >
                      <option value="uncategorized" className="bg-zinc-900">No Folder</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id} className="bg-zinc-900">{f.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col gap-3">
            {isEditing ? (
              <button type="submit" className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-[10px] uppercase tracking-widest transition shadow-xl shadow-blue-600/30">
                Update Note
              </button>
            ) : (
              <button type="button" onClick={onDelete} className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition">
                Delete Note
              </button>
            )}
            <button type="button" onClick={onClose} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition">
              Close
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

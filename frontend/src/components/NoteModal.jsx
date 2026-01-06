import { useState, useEffect, useRef } from "react";

export function NoteModal({
  selectedNote, // Renamed from 'note' to match Folders.jsx
  isOpen,
  onClose,
  onSave,
  mode = "create",
  folders = [],
  isPost = false,
}) {
  const noteRef = useRef(null);
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: "uncategorized",
  });

  // SRS Logic: Word Count
  const getWordCount = (str) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(formData.content);

  useEffect(() => {
    if (selectedNote) {
      setFormData({
        id: selectedNote.id,
        title: selectedNote.title || "",
        content: selectedNote.content || "",
        folderId: selectedNote.folder_id || "uncategorized",
      });
    } else {
      setFormData({ title: "", content: "", folderId: "uncategorized" });
    }
  }, [selectedNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // SRS Validation: Limit Posts to 300 words
    if (isPost && wordCount > 300) {
      alert("Posts cannot exceed 300 words!");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        ref={noteRef}
        className="flex w-full max-w-6xl h-[85vh] bg-(--bg-primary) rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* MAIN CONTENT Area */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
             <span className="text-xs font-mono text-white/40 uppercase">Editor</span>
             <button onClick={onClose} type="button" className="text-white/40 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto">
            {isViewMode ? (
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg">
                  {formData.content}
                </p>
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Start writing your thoughts..."
                className="w-full h-full bg-transparent resize-none outline-none text-lg leading-relaxed text-white placeholder:text-white/10"
                autoFocus
              />
            )}
          </div>

          {/* Word Count Footer */}
          {!isViewMode && (
            <div className="px-8 py-3 border-t border-white/5 bg-black/20 flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
              <span>{formData.content.length} Characters</span>
              <span className={isPost && wordCount > 300 ? "text-red-400" : ""}>
                {wordCount} / {isPost ? "300 Words" : "Unlimited"}
              </span>
            </div>
          )}
        </section>

        {/* RIGHT PANEL (Settings) */}
        <aside className="w-80 flex flex-col px-6 py-8 border-l border-white/10 bg-black/30">
          <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Title</label>
              {isViewMode ? (
                <p className="text-white font-medium">{formData.title || "Untitled"}</p>
              ) : (
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition"
                  placeholder="Enter title..."
                  required
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Folder</label>
              {isViewMode ? (
                <p className="text-white/70">
                  {folders.find((f) => f.id === formData.folderId)?.name || "Uncategorized"}
                </p>
              ) : (
                <select
                  value={formData.folderId}
                  onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500"
                >
                  <option value="uncategorized" className="bg-slate-900">Uncategorized</option>
                  {folders.filter(f => f.id !== 'uncategorized').map((f) => (
                    <option key={f.id} value={f.id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            {isViewMode ? (
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition">
                Close
              </button>
            ) : (
              <>
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition">
                  {isPost ? "Post Note" : "Save Note"}
                </button>
              </>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
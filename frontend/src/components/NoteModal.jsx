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

  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
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
    const finalData = {
    ...formData,
    folderId: formData.folderId || "uncategorized",
    };
    onSave(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={noteRef}
      className="flex min-h-[100dvh] bg-(--bg-primary) text-white"
    >
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14
        flex items-center justify-between px-4
        bg-(--bg-primary) border-b border-white/10">

        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="text-xl text-white"
          >
          ☰
        </button>

        <span className="text-white font-medium truncate">
          {formData.title || "New Note"}
        </span>

        <button
          type="submit"
          className="text-(--btn-primary) font-semibold"
        >
          Save
        </button>
      </div>

    <section className="flex-1 px-6 pt-20 pb:24 lg:px-16 lg:py-12 flex flex-col overflow-y-auto">

        <div className="hidden lg:block pb-4 mb-4 border-b border-white/10">
        <h1 className="text-2xl font-semibold text-white/90">
          {formData.title || "New Note"}
        </h1>
      </div>

      {/* CONTENT EDITOR */}
      <textarea
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
        placeholder="Start writing..."
        className="
          flex-1 w-full
          min-h-[200px]
          bg-transparent
          outline-none resize-none
          text-lg leading-relaxed
          text-white/90
          placeholder:text-white/30
        "
        required
      />
    </section>
    <aside className="
      hidden lg:flex w-80
      flex-col gap-6
      px-6 py-8
      border-l border-white/10
      bg-black/30
    ">

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
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none text-white/80"
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
          className="px-4 py-2 rounded-lg
           bg-white/5 border border-white/10 
           focus:border-(--btn-primary) 
           outline-none text-white/80"
        />
      </div>

      {/* Folder */}
      {!hideFolderSelection && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-white/40 uppercase">
            Folder
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFolderDropdown(v => !v)}
              className="
                w-full px-4 py-2 rounded-lg
                bg-white/5 border border-white/10
                text-left text-white/80
              "
            >
              <span>
              {folders.find(f => f.id === formData.folderId)?.name || "Select folder"}
              </span>
              <span className="text-sm">▾</span>
            </button>

            {showFolderDropdown && (
              <div
                className="
                  mt-2 rounded-xl
                  bg-(--bg-primary)
                  border border-white/10
                  shadow-2xl
                  overflow-hidden
                "
              >
                {folders.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, folderId: f.id });
                      setShowFolderDropdown(false);
                    }}
                    className="
                      w-full px-4 py-2 text-left
                      hover:bg-white/10
                      text-white/80
                    "
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex gap-3">

        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded-lg 
          bg-white/5 border border-white/10 
          text-white/80 hover:bg-white/10"
        >
          Cancel
        </button>

        {/* ✅ BUTTON TEXT SWITCH */}
        <button
          type="submit"
          className="flex-1 px-4 py-2 rounded-lg 
          bg-(--btn-primary) 
          text-white font-bold hover:brightness-105"
        >
          {isPost ? "Post" : "Save Note"}
        </button>
      </div>
      </aside>
      {/* MOBILE SETTINGS PANEL */}
      {showSettings && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
          <div
            className="
              absolute right-0 top-0 h-full w-80
              bg-(--bg-primary)
              p-6 flex flex-col gap-4
              border-l border-white/10
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Note Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-white/40 uppercase">
                Title
              </label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Note title..."
                className="px-4 py-2 rounded-lg
                  bg-white/5 border border-white/10
                  outline-none text-white/80"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-white/40 uppercase">
                Category
              </label>
              <input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Category..."
                className="px-4 py-2 rounded-lg
                  bg-white/5 border border-white/10
                  outline-none text-white/80"
              />
            </div>
            
            {/* Folder (custom dropdown) */}
            {!hideFolderSelection && (
              <div className="relative flex flex-col gap-1">
                <label className="text-xs font-bold text-white/40 uppercase">
                  Folder
                </label>

                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setShowFolderDropdown(v => !v)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10
                            text-left text-white/80 flex justify-between items-center"
                >
                  <span>
                    {folders.find(f => f.id === formData.folderId)?.name || "Uncategorized"}
                  </span>
                  <span>▾</span>
                </button>

                {/* Dropdown */}
                {showFolderDropdown && (
                  <div className="absolute top-full mt-2 w-full rounded-xl
                                  bg-(--bg-primary) border border-white/10
                                  shadow-xl z-50">
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, folderId: f.id });
                          setShowFolderDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left
                                  hover:bg-white/10 text-white/80"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Spacer */}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg
                bg-(--btn-primary)
                text-white font-bold"
              >
              Save
            </button>


            {/* Cancel (mobile only) */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg
                bg-white/5 border border-white/10
                text-white/80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

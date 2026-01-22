import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { Navigation } from "./Navigation";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ category, setCategory ] = useState("General");
  const [ visibility, setVisibility ] = useState("Private");
  const [ folderId, setFolderId ] = useState("");
  const [ folders, setFolders ] = useState([]);
  const [ loading, setLoading ] = useState(true);


  const [ isEditing, setIsEditing ] = useState(false);

  const categories = [
    "General",
    "Life",
    "Questions",
    "Fun/Random",
    "Creative",
    "Thoughts",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: note } = await supabase
          .from("notes")
          .select("*")
          .eq("id", id)
          .single();
        if (note) {
          setTitle(note.title || "");
          setContent(note.content || "");
          setCategory(note.category || "General");
          setVisibility(note.visibility || "Private");
          setFolderId(note.folder_id || "uncategorized");
        }
        if (user?.id) {
          const { data: fData } = await supabase
            .from("folders")
            .select("*")
            .eq("user_id", user.id);
          setFolders(fData || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [ id, user ]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await supabase
      .from("notes")
      .update({
        title,
        content,
        category,
        visibility,
        folder_id: folderId === "uncategorized" ? null : folderId,
        updated_at: new Date(),
      })
      .eq("id", id);

    setIsEditing(false);
    if (visibility === "Public") navigate("/feed");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-(--bg-page) flex items-center justify-center text-(--text-main) font-black tracking-tighter italic">
        LOADING YOUR THOUGHTS...
      </div>
    );

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <form
          onSubmit={handleUpdate}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-6">
            {!isEditing ? (

              <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-5xl font-black tracking-tighter text-(--text-main) leading-tight">
                  {title}
                </h1>
                <div
                  className="text-(--text-muted) text-xl leading-relaxed ql-editor !p-0"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (

              <div className="space-y-6 animate-in zoom-in-95 duration-200">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-2xl px-8 py-6 text-3xl font-black outline-none focus:border-(--accent-primary) transition-all placeholder:text-(--text-faint)"
                  placeholder="Title..."
                />
                <div className="bg-(--bg-input) border border-(--border-subtle) rounded-[2rem] overflow-hidden min-h-[60vh] flex flex-col shadow-2xl">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    className="flex-1 text-(--text-main) editor-custom"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR SETTINGS */}
          <div className="space-y-4">
            <div className="bg-(--bg-card) border border-(--border-subtle) rounded-[2.5rem] p-8 space-y-8 sticky top-12">

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-4 rounded-2xl bg-(--bg-input) border border-(--border-subtle) text-[10px] font-black uppercase tracking-widest hover:bg-(--bg-card-hover) transition-all text-(--accent-primary)"
              >
                {isEditing ? "✨ View Mode" : "📝 Edit Note"}
              </button>

              {isEditing && (
                <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-(--text-faint) uppercase tracking-[0.2em] ml-1">
                      Organize
                    </label>
                    <div className="relative group">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-(--bg-card-hover) focus:border-(--accent-primary) transition-all cursor-pointer text-(--text-main)"
                      >
                        {categories.map((cat) => (
                          <option
                            key={cat}
                            value={cat}
                            className="bg-(--bg-page)"
                          >
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>

                    <div className="relative group">
                      <select
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-2xl p-4 text-sm font-bold outline-none appearance-none hover:bg-(--bg-card-hover) focus:border-(--accent-primary) transition-all cursor-pointer text-(--text-main)"
                      >
                        <option
                          value="uncategorized"
                          className="bg-(--bg-page)"
                        >
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
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-faint)">
                        <i className="fa-solid fa-folder text-xs"></i>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-(--text-faint) uppercase tracking-[0.2em] ml-1">
                      Privacy
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibility(
                          visibility === "Public" ? "Private" : "Public"
                        )
                      }
                      className={`w-full py-4 rounded-2xl border font-black text-[10px] tracking-widest transition-all ${visibility === "Public"
                          ? "bg-(--accent-surface) border-(--accent-primary) text-(--accent-primary)"
                          : "bg-(--bg-input) border-(--border-subtle) text-(--text-faint)"
                        }`}
                    >
                      {visibility === "Public"
                        ? "🚀 GOING PUBLIC"
                        : "🔒 STAY PRIVATE"}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                {isEditing && (
                  <button
                    type="submit"
                    className="w-full py-5 bg-(--accent-primary) rounded-[1.5rem] font-black text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    SAVE CHANGES
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full py-4 text-(--text-faint) font-black text-[10px] tracking-widest hover:text-(--text-main) transition-colors"
                >
                  {isEditing ? "DISCARD" : "BACK TO LIST"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <style>{`
        .editor-custom .ql-toolbar { border: none !important; border-bottom: 1px solid var(--border-subtle) !important; padding: 1.5rem !important; }
        .editor-custom .ql-container { border: none !important; font-size: 1.1rem; font-family: inherit; }
        .editor-custom .ql-editor { padding: 2rem !important; min-height: 50vh; color: var(--text-main); }
        .ql-snow .ql-stroke { stroke: var(--text-muted) !important; }
        .ql-snow .ql-fill { fill: var(--text-muted) !important; }
        .ql-snow .ql-picker { color: var(--text-muted) !important; }
      `}</style>
    </div>
  );
}

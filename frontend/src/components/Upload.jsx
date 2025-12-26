import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";

export function Upload() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/folders")
      .then((res) => res.json())
      .then((data) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching folders:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = {
      title,
      content,
      folderId: category,
      user: "John Doe", // Mock current user
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxnMVuj5nEyLEn0WopcnfrvaGHqG9U4hVQA_LuhtYILWOqY644_1X1nAIRl43W12_D9BGhW5Et67QTPIArWvDPBtpzPvOrVtXnBdIDqZaPEo9axzID04FmubeoSu1YcRu0OfNTCl9vHEFKBNKhUmNeLoVoRak71naeZW9ZnDWV_L7cQR3H87WdeTnv_G5Etzu13RjBJrrnEsl3juANvYFAHad_Zcv9LYSWSEgGOS0mQxWgdCLF8GM9PA7QyArxgXBhtXGwmGdoO81Z",
      time: "Just now",
      createdAt: new Date().toISOString(),
    };

    fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (res.ok) {
          alert("Note created successfully!");
          setTitle("");
          setContent("");
          setCategory("uncategorized");
        } else {
          alert("Failed to create note.");
        }
      })
      .catch((err) => {
        console.error("Error creating note:", err);
        alert("An error occurred.");
      });
  };

  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) font-display flex text-(--text-primary)">
      <Navigation />

      <div className="flex-1 flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 p-4 backdrop-blur-sm shrink-0 border-b border-slate-200/10">
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">
            Create New Note
          </h1>
        </header>

        <main className="flex-1 px-4 pb-24 pt-8 bg-background-dark">
          <div className="mx-auto max-w-2xl bg-(--bg-secondary) rounded-3xl p-8 border border-white/10 shadow-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-slate-400 px-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Give your note a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) focus:ring-1 focus:ring-(--btn-primary) outline-none transition text-lg font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-sm font-semibold text-slate-400 px-1"
                >
                  Category / folder
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) outline-none transition cursor-pointer appearance-none"
                  disabled={loading}
                >
                  {folders.map((folder) => (
                    <option
                      key={folder.id}
                      value={folder.id}
                      className="bg-[#1a2232]"
                    >
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="text-sm font-semibold text-slate-400 px-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  placeholder="Start writing your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-(--btn-primary) focus:ring-1 focus:ring-(--btn-primary) outline-none transition resize-none leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-(--btn-primary) hover:bg-blue-600 transition font-bold py-3 rounded-xl shadow-lg cursor-pointer"
                >
                  Create Note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setCategory("uncategorized");
                  }}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

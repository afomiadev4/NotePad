import { useState } from "react";
import { Navigation } from "./Navigation";

export function Upload() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Uncategorized");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploading note:", { title, content, category });
    // Reset form
    setTitle("");
    setContent("");
    setCategory("Uncategorized");
    alert("Note created successfully! (Mock)");
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
                >
                  <option value="Uncategorized" className="bg-[#1a2232]">
                    Uncategorized
                  </option>
                  <option value="Posted" className="bg-[#1a2232]">
                    Posted
                  </option>
                  <option value="Saved" className="bg-[#1a2232]">
                    Saved
                  </option>
                  <option value="Ideas" className="bg-[#1a2232]">
                    Ideas
                  </option>
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
                    setCategory("Uncategorized");
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

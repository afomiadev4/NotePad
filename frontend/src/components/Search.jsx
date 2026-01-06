import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Navigation } from "./Navigation";

export function Search() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce search to prevent too many API calls
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Searching for notes where title or content matches the query
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, updated_at, visibility")
        .eq("user_id", user.id)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-white flex">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold">Search Notes</h1>
            <p className="text-white/40 mt-2 text-sm italic">"Seek and ye shall find."</p>
          </header>

          {/* Search Input */}
          <div className="relative mb-12">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-white/20"></i>
            <input
              type="text"
              placeholder="Search by title or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xl outline-none focus:border-blue-500/50 transition shadow-2xl"
              autoFocus
            />
          </div>

          {/* Results Area */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : query && results.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-white/30">No notes match "{query}"</p>
              </div>
            ) : (
              results.map((note) => (
                <div
                  key={note.id}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition">{note.title || "Untitled Note"}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${note.visibility === 'Public' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {note.visibility}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-white/20 font-semibold uppercase tracking-widest">
                    <i className="fa-regular fa-calendar"></i>
                    {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
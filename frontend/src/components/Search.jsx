import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) handleSearch();
      else setResults([]);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    const { data } = await supabase
      .from("notes")
      .select("id, title, visibility")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(6);
    setResults(data || []);
    setIsOpen(true);
  };

  return (
    <div className="relative w-full max-w-md group" ref={searchRef}>
      <div className="relative flex items-center">
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-white/20 group-focus-within:text-blue-500 transition-colors"></i>
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-11 pr-4 text-sm outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
        />
      </div>

      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                navigate(`/note/${note.id}`);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-file-lines text-white/20 text-xs"></i>
                <span className="text-sm font-medium truncate">{note.title || "Untitled"}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${note.visibility === 'Public' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {note.visibility}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
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
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsOpen(false);
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
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors"></i>
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-full py-2 pl-11 pr-4 text-sm outline-none focus:bg-[var(--bg-card-hover)] focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-main)] placeholder-[var(--text-faint)]"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                navigate(`/note/${note.id}`);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-card-hover)] text-left border-b border-[var(--border-subtle)] last:border-0 group/item"
            >
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-file-lines text-[var(--text-muted)] text-xs"></i>
                <span className="text-sm font-medium truncate text-[var(--text-main)]">
                  {note.title || "Untitled"}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  note.visibility === "Public"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                }`}
              >
                {note.visibility}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

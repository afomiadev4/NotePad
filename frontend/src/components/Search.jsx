import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [ query, setQuery ] = useState("");
  const [ results, setResults ] = useState([]);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ searching, setSearching ] = useState(false);
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
      else {
        setResults([]);
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [ query ]);

  const handleSearch = async () => {
    setSearching(true);
    const { data } = await supabase
      .from("notes")
      .select("id, title, visibility")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(6);
    setResults(data || []);
    setIsOpen(true);
    setSearching(false);
  };

  return (
    <div className="relative w-full max-w-md group" ref={searchRef}>
      <div className="relative flex items-center">
        <i className={`fa-solid ${searching ? 'fa-circle-notch animate-spin' : 'fa-magnifying-glass'} absolute left-4 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors`}></i>
        <input
          type="text"
          placeholder="Search your archive..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:[var(--text-muted)] font-medium"
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[1.5rem] shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">Best Matches</p>
              {results.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    navigate(`/note/${note.id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-[var(--bg-primary)] text-left transition-colors group/item"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-color)] group-hover/item:border-blue-500/30">
                      <i className="fa-solid fa-file-lines text-[var(--text-muted)] text-xs group-hover/item:text-blue-500"></i>
                    </div>
                    <span className="text-sm font-bold truncate text-[var(--text-main)]">{note.title || "Untitled Thought"}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-md ${note.visibility === 'Public'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-blue-500/10 text-blue-500'
                    }`}>
                    {note.visibility}
                  </span>
                </button>
              ))}
            </div>
          ) : !searching && (
            <div className="p-8 text-center">
              <i className="fa-solid fa-wind text-[var(--text-muted)] mb-2 opacity-20 text-xl"></i>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">No matches found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
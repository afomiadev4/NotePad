import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export function SearchBar({ setNotes }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const handleSearch = async () => {
    const { data } = await supabase
      .from("notes")
      .select(
        `
        *,
        profiles!user_id (id, username, avatar_url, bio),
        reactions!note_id (user_id),
        saves!note_id (user_id),
        comments!note_id (id)
      `
      )
      .order("created_at", { ascending: false });

    // Client-side filtering to remove false positives from HTML tags and entities
    const filteredData = (data || []).filter((note) => {
      const lowerQuery = query.toLowerCase();
      const titleMatch = note.title?.toLowerCase().includes(lowerQuery);

      // Use DOM parser to get actual text content (handles tags and entities like &nbsp;)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = note.content || "";
      const plainContent = (
        tempDiv.textContent ||
        tempDiv.innerText ||
        ""
      ).toLowerCase();

      const contentMatch = plainContent.includes(lowerQuery);
      return titleMatch || contentMatch;
    });

    setNotes(filteredData);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-md group" ref={searchRef}>
      <div className="relative flex items-center">
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors"></i>
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-full py-2 pl-11 pr-4 text-sm outline-none focus:bg-[var(--bg-card-hover)] focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-main)] placeholder-[var(--text-faint)]"
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { SearchBar } from "./Search";
import { supabase } from "../supabaseClient";
import { CommentModal } from "./CommentModal";
import { ProfileCard } from "./ProfileCard";
import { useSelector } from "react-redux";

export function Feed() {
  const user = useSelector((state) => state.auth.user);
  const [ notes, setNotes ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ activeCat, setActiveCat ] = useState("All");
  const [ filterUser, setFilterUser ] = useState(null);
  const [ selectedNote, setSelectedNote ] = useState(null);
  const [ isCommentModalOpen, setIsCommentModalOpen ] = useState(false);
  const [ viewingProfile, setViewingProfile ] = useState(null);

  const categories = [
    "All",
    "General",
    "Life",
    "Questions",
    "Fun/Random",
    "Creative",
    "Thoughts",
  ];

  const fetchPosts = async () => {
    setNotes([]);
    setLoading(true);
    try {
      let query = supabase
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
        .eq("visibility", "Public")
        .order("created_at", { ascending: false });

      if (activeCat !== "All") {
        query = query.eq("category", activeCat);
      }

      if (filterUser) {
        query = query.eq("user_id", filterUser.id);
      }

      query = query.eq("visibility", "Public");

      const { data, error } = await query.order("created_at", { ascending: false });

      console.log("FEED DATA RETURNED:", data.map(n => ({ title: n.title, vis: n.visibility })));

      if (error) throw error;

      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching feed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

  }, [ activeCat, filterUser ]);

  const handleToggleLike = async (noteId) => {
    if (!user) return alert("Please log in!");
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    const hasLiked = notes[ noteIndex ].reactions?.some(
      (r) => r.user_id === user.id
    );
    const updated = [ ...notes ];
    if (hasLiked) {
      updated[ noteIndex ].reactions = updated[ noteIndex ].reactions.filter(
        (r) => r.user_id !== user.id
      );
      await supabase
        .from("reactions")
        .delete()
        .eq("note_id", noteId)
        .eq("user_id", user.id);
    } else {
      updated[ noteIndex ].reactions = [
        ...(updated[ noteIndex ].reactions || []),
        { user_id: user.id },
      ];
      await supabase
        .from("reactions")
        .insert([ { note_id: noteId, user_id: user.id } ]);
    }
    setNotes(updated);
  };

  const handleToggleSave = async (noteId) => {
    if (!user) return alert("Please log in!");
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    const hasSaved = notes[ noteIndex ].saves?.some((s) => s.user_id === user.id);
    const updated = [ ...notes ];
    if (hasSaved) {
      updated[ noteIndex ].saves = updated[ noteIndex ].saves.filter(
        (s) => s.user_id !== user.id
      );
      await supabase
        .from("saves")
        .delete()
        .eq("note_id", noteId)
        .eq("user_id", user.id);
    } else {
      updated[ noteIndex ].saves = [
        ...(updated[ noteIndex ].saves || []),
        { user_id: user.id },
      ];
      await supabase
        .from("saves")
        .insert([ { note_id: noteId, user_id: user.id } ]);
    }
    setNotes(updated);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col lg:flex-row text-[var(--text-main)] font-sans overflow-x-hidden transition-colors duration-300">
      <Navigation />


      <main className="flex-1 w-full lg:ml-64 px-4 md:px-8 pt-4 md:pt-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-32 lg:pb-12">
          {/* Responsive Header */}
          <header className="sticky top-0 bg-(--bg-page)/90 backdrop-blur-xl z-30 pb-4 border-b border-(--border-subtle) pt-2 transition-colors duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 truncate text-(--text-main)">
                  {filterUser ? (
                    <>
                      <button
                        onClick={() => setFilterUser(null)}
                        className="hover:text-(--accent-primary) transition-colors p-1"
                      >
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                      </button>
                      <span className="truncate">@{filterUser.username}</span>
                    </>
                  ) : (
                    "Public Feed"
                  )}
                </h1>
                {filterUser && (
                  <button
                    onClick={() => setFilterUser(null)}
                    className="shrink-0 text-[10px] font-black uppercase tracking-widest bg-(--bg-card) px-3 py-1.5 rounded-full hover:bg-(--bg-card-hover) text-(--text-muted)"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="w-full">
                <SearchBar setNotes={setNotes} />
              </div>


              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${activeCat === c
                      ? "bg-(--text-main) text-(--bg-page) border-transparent"
                      : "border-(--border-subtle) text-(--text-muted) hover:text-(--text-main)"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Posts Section */}
          {loading ? (
            <div className="flex justify-center py-20 text-(--accent-primary) animate-pulse font-black uppercase tracking-widest text-[10px]">
              Syncing...
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const hasLiked = note.reactions?.some(
                  (r) => r.user_id === user?.id
                );
                const hasSaved = note.saves?.some(
                  (s) => s.user_id === user?.id
                );

                return (
                  <article
                    key={note.id}
                    className="bg-(--bg-card) rounded-[1.5rem] md:rounded-[2rem] border border-(--border-subtle) p-4 md:p-6 hover:bg-(--bg-card-hover) transition-all"
                  >
                    <div className="flex gap-3 md:gap-4">
                      {/* Responsive Image Size */}
                      <img
                        src={
                          note.profiles?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${note.profiles?.username}`
                        }
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl object-cover cursor-pointer shrink-0"
                        onClick={() => setViewingProfile(note.profiles)}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => setViewingProfile(note.profiles)}
                            className="font-bold text-sm md:text-base text-(--text-main) cursor-pointer hover:text-(--accent-primary) hover:underline transition-all truncate"
                          >
                            @{note.profiles?.username || "anonymous"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-(--bg-page) px-2 py-0.5 rounded-md text-(--text-muted) border border-(--border-subtle) shrink-0">
                            {note.category}
                          </span>
                        </div>

                        <h2 className="text-lg md:text-xl font-bold text-(--text-main) mt-2 md:mt-4 leading-tight truncate">
                          {note.title}
                        </h2>
                        <div
                          className="text-(--text-muted) text-xs md:text-sm my-3 md:my-4 leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-(--border-subtle)">
                          <div className="flex items-center gap-4 md:gap-8">
                            <button
                              onClick={() => handleToggleLike(note.id)}
                              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${hasLiked
                                ? "text-rose-500"
                                : "text-(--text-muted) hover:text-rose-400"
                                }`}
                            >
                              <i
                                className={`${hasLiked ? "fa-solid" : "fa-regular"
                                  } fa-heart text-base hover:scale-110 transition-all `}
                              ></i>
                              <span className="text-xs font-bold">
                                {note.reactions?.length || 0}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedNote(note);
                                setIsCommentModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-(--text-muted) hover:text-(--accent-primary) transition-colors cursor-pointer"
                            >
                              <i className="fa-regular fa-comment text-base hover:scale-110 transition-all"></i>
                              <span className="text-xs font-bold">
                                {note.comments?.length || 0}
                              </span>
                            </button>
                            <button
                              onClick={() => handleToggleSave(note.id)}
                              className={`flex items-center transition-colors cursor-pointer ${hasSaved
                                ? "text-yellow-500"
                                : "text-(--text-muted) hover:text-yellow-400"
                                }`}
                            >
                              <i
                                className={`${hasSaved ? "fa-solid" : "fa-regular"
                                  } fa-bookmark text-base hover:scale-110 transition-all`}
                              ></i>
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/note/${note.id}`;
                              if (navigator.share) {
                                navigator
                                  .share({ title: note.title, url: url })
                                  .catch(() => { });
                              } else {
                                navigator.clipboard.writeText(url);
                                alert("Link copied!");
                              }
                            }}
                            className="text-(--text-muted) hover:text-emerald-400 transition-colors p-2 cursor-pointer"
                          >
                            <i className="fa-solid fa-arrow-up-from-bracket text-sm hover:scale-110 transition-all"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {isCommentModalOpen && selectedNote && (
        <CommentModal
          noteId={selectedNote.id}
          onClose={() => setIsCommentModalOpen(false)}
          onCommentAdded={fetchPosts}
        />
      )}

      {viewingProfile && (
        <ProfileCard
          profile={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onViewThoughts={(prof) => {
            setFilterUser(prof);
            setViewingProfile(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}

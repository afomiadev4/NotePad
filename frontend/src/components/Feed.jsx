import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";

export function Feed() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = () => {
    setLoading(true);
    fetch("http://localhost:3000/notes?folderId=posted&_sort=createdAt&_order=desc")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-(--bg-primary) flex text-(--text-primary)">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-4 pb-24 space-y-4">
        {loading && <p>Loading...</p>}

        {!loading && notes.length === 0 && (
          <p className="text-slate-400">No posts yet</p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-(--bg-secondary) rounded-xl border border-white/10 p-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={note.avatar}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{note.user}</p>
                <p className="text-xs text-slate-500">{note.time}</p>
              </div>
            </div>

            <h2 className="mt-4 text-xl font-bold">{note.title}</h2>
            <p className="mt-2 text-slate-400">{note.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

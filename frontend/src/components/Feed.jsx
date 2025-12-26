import { Navigation } from "./Navigation";

const notes = [
  {
    id: 1,
    user: "Alex Johnson",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEjQ_Ew42VTf4Bdd1_2j7gsNDywAJp4wT3NjGLRyaCHmw63_c_a7x53hh9eKzIc-Yk15ACVVHlQbXJUCzEpFA8Xd1u1hBHtty534-aPNggcIMoJliOI9gcZPckLCXpAnyHW4CUT-xGVVrWr2fb5U7PNm2gFrEqGEYPrdjUQ-RePNOVSixhK7uQEm8JvfH3l3m6-H0fQxeadL7Pdz2aFMvSlMMLhmT1qcIFlvfh-Q5o4BZOyrKH-EQU3k90vKHaFhAsDuuMNF5BrMYk",
    time: "2h ago",
    title: "The Art of Minimalism",
    content:
      "Minimalism isn't just about owning less; it's a mindset focused on intention and purpose. By decluttering our physical and digital spaces...",
  },
  {
    id: 2,
    user: "Maria Garcia",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6TLObtqcxMHf8CC10V8NEcrGhwb6YtUP8oCIzwElfRZBPEK5A6lkV1ENO34LrXFkomxW9-R4V04rZR-UKbE6lHAzNuffVNnFaQogeZHfT3J05I2pUbuaLwWDTglDKw3jSAMExdg2iaIomkzXgbtau1GnEnkxxr8kdh7YGmwDFW3V6mz2W5kH--1iRjiCGXmZc8YvMpJT9YJ54Nw0Lv71e3iAT9CpZOW04Xw9IG_h8LFXXpzTT5npfntflr7bwZaCgYmHoCMwJ8uVA",
    time: "5h ago",
    title: "Creative Brainstorming",
    content:
      "Unlock your creative potential with these brainstorming techniques. Start by setting a clear goal, then explore mind mapping, free association...",
  },
  {
    id: 3,
    user: "Kenji Tanaka",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlBMs_ExJVlxpldb_AGwO1Q9PkQUChE5FCVbIgMQLt9r6QtdjqoFZqLsgkNk-0AmLDjVURmklJik1e8HkM01p02T58mT0hiwj7T_ky3qYE6P0i1uPzK2kCHbuBLOOkbtON1XLBvM8AUWzoU8MCFxq6AUqKkNp8FuC4oZ3P4B5vb33tbst5X4hh9QY5Y_uJwaYWbdELGRTBPsGkC_GEjzta49ZMXuGYe_KlV6z9DMb39Qk3ogssKhi8tAXl99uEc-fODKhlDK1g9gEx",
    time: "1d ago",
    title: "My Travel Log: Kyoto",
    content:
      "Wandering through the serene bamboo groves of Arashiyama and the golden splendor of Kinkaku-ji. Every corner of this city tells a story.",
  },
];

export function Feed() {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) font-display flex">
      <Navigation />
      <main className="flex-1 flex flex-col gap-4 p-4 lg:ml-64 justfy-center">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col rounded-xl bg-(--bg-secondary)"
          >
            <div className="flex flex-col p-5">
              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${note.avatar})` }}
                    alt={`Avatar of user ${note.user}`}
                  ></div>
                  <p className="flex-1 truncate text-base font-medium">
                    {note.user}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
                  {note.time}
                </p>
              </div>

              {/* Content */}
              <div className="mt-4">
                <h2 className="text-xl font-bold leading-tight tracking-tight">
                  {note.title}
                </h2>
                <p className="mt-2 text-base font-normal leading-relaxed text-slate-600 dark:text-slate-300">
                  {note.content}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-3">
              <div className="flex justify-end gap-2 px-2">
                <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 py-2.5 px-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                  <i className="fa-regular fa-heart text-lg text-red-500"></i>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Like
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 py-2.5 px-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                  <i className="fa-regular fa-comment text-lg text-slate-600 dark:text-slate-300"></i>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Comment
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 py-2.5 px-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                  <i className="fa-regular fa-bookmark text-lg text-slate-600 dark:text-slate-300"></i>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Save
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 py-2.5 px-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ml-auto">
                  <i className="fa-solid fa-share text-lg text-slate-600 dark:text-slate-300"></i>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

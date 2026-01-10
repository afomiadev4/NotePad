export function ProfileCard({ profile, onClose, onViewThoughts }) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Dynamic Theme Banner */}
        <div className="h-28 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border-b border-[var(--border-color)] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/40 transition-all"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div className="px-8 pb-10">
          {/* Avatar Section */}
          <div className="relative -mt-14 mb-5">
            <img
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}&background=2563eb&color=fff`}
              className="w-28 h-28 rounded-[2.5rem] object-cover border-[6px] border-[var(--bg-secondary)] bg-[var(--bg-primary)] shadow-2xl"
              alt={profile.username}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-main)] leading-none">
              {profile.full_name || `@${profile.username}`}
            </h2>
            {profile.full_name && (
              <p className="text-blue-500 font-black text-xs uppercase tracking-widest mt-2">@{profile.username}</p>
            )}

            <div className="mt-5 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-inner">
              <p className="text-[var(--text-muted)] text-sm leading-relaxed italic font-medium">
                {profile.bio ? `"${profile.bio}"` : "This user prefers to keep their story a mystery..."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onViewThoughts(profile)}
              className="w-full py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-primary)] font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl active:scale-95"
            >
              View Thoughts
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] font-black text-[10px] uppercase tracking-[0.2em] hover:text-[var(--text-main)] hover:border-[var(--text-main)] transition-all active:scale-95"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
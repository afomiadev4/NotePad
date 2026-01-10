export function ProfileCard({ profile, onClose, onViewThoughts }) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors">
        <div className="h-24 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-page)] border-b border-[var(--border-subtle)]"></div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-4">
            <img
              src={
                profile.avatar_url ||
                `https://ui-avatars.com/api/?name=${profile.username}`
              }
              className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[var(--bg-card)] bg-[var(--bg-page)] shadow-xl"
              alt={profile.username}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight text-[var(--heading-main)]">
              {profile.full_name || `@${profile.username}`}
            </h2>
            {profile.full_name && (
              <p className="text-[var(--accent-primary)] font-bold text-sm mt-0.5">
                @{profile.username}
              </p>
            )}

            <p className="text-[var(--text-muted)] text-sm mt-4 leading-relaxed italic">
              "{profile.bio || "No bio available for this user."}"
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onViewThoughts(profile)}
              className="w-full py-4 rounded-2xl bg-[var(--accent-primary)] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--accent-hover)] transition-all shadow-lg active:scale-95 hover:shadow-blue-600/20"
            >
              View Thoughts
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-[var(--bg-input)] text-[var(--text-muted)] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)] transition-all active:scale-95"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

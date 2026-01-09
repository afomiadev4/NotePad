export function ProfileCard({ profile, onClose, onViewThoughts }) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 border-b border-white/5"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-4">
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`} 
              className="w-24 h-24 rounded-[2rem] object-cover border-4 border-zinc-950 bg-zinc-900 shadow-xl"
              alt={profile.username}
            />
          </div>

          <div className="mb-6">
            {/* CLEANED UP IDENTITY SECTION */}
            <h2 className="text-2xl font-black tracking-tight text-white">
              {profile.full_name || `@${profile.username}`}
            </h2>
            {/* Only show the sub-username if a full name actually exists */}
            {profile.full_name && (
              <p className="text-blue-500 font-bold text-sm mt-0.5">@{profile.username}</p>
            )}
            
            <p className="text-white/50 text-sm mt-4 leading-relaxed italic">
              "{profile.bio || "No bio available for this user."}"
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onViewThoughts(profile)}
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
            >
              View Thoughts
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 text-white/30 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
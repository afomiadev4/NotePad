import { Navigation } from "./Navigation";

export function Folders() {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-reverse items-center justify-center box-border">
      <Navigation />
      <div className="flex-1 h-screen box-border lg:ml-64">
        <div className="min-h-screen bg-[--bg-primary] text-white p-4 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">My Folders</h1>

            <button
              className="flex items-center gap-2 rounded-xl bg-(--btn-primary) px-4 py-2
                     text-sm font-semibold text-white hover:bg-cyan-600 transition cursor-pointer"
            >
              <i className="fa-solid fa-folder-plus"></i>
              Add New Folder
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              className="group rounded-2xl border border-white/10 bg-white/5 p-4
                        hover:bg-white/10 transition cursor-pointer h-32"
            >
              <div className="flex items-center justify-between mb-4">
                <i className="fa-solid fa-paper-plane text-3xl text-green-400"></i>
                <i className="fa-solid fa-ellipsis-vertical text-white/60 opacity-0 group-hover:opacity-100 transition"></i>
              </div>

              <h3 className="font-semibold truncate">Posted</h3>
              <p className="text-xs text-white/60 mt-1">12 notes</p>
            </div>

            <div
              className="group rounded-2xl border border-white/10 bg-white/5 p-4
                        hover:bg-white/10 transition cursor-pointer h-32"
            >
              <div className="flex items-center justify-between mb-4">
                <i className="fa-solid fa-bookmark text-3xl text-green-400"></i>
                <i className="fa-solid fa-ellipsis-vertical text-white/60 opacity-0 group-hover:opacity-100 transition"></i>
              </div>

              <h3 className="font-semibold truncate">Saved</h3>
              <p className="text-xs text-white/60 mt-1">20 notes</p>
            </div>

            <div
              className="group rounded-2xl border border-white/10 bg-white/5 p-4
                        hover:bg-white/10 transition cursor-pointer h-32"
            >
              <div className="flex items-center justify-between mb-4">
                <i className="fa-solid fa-folder text-3xl text-gray-400"></i>
                <i className="fa-solid fa-ellipsis-vertical text-white/60 opacity-0 group-hover:opacity-100 transition"></i>
              </div>

              <h3 className="font-semibold truncate">Uncategorized</h3>
              <p className="text-xs text-white/60 mt-1">8 notes</p>
            </div>

            <div
              className="flex flex-col items-center justify-center gap-2 rounded-2xl
                     border border-dashed border-white/20 bg-white/5
                     hover:bg-white/10 transition cursor-pointer h-32"
            >
              <i className="fa-solid fa-plus text-xl text-white/60"></i>
              <span className="text-sm text-white/60">Add Folder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

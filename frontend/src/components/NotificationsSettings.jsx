import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";

export function NotificationsSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-(--text-secondary) mb-3"
            aria-label="Back"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>

        <div className="rounded-xl bg-(--bg-secondary) border border-white/10 p-5 space-y-4">
          <label className="flex items-center justify-between">
            <span>New Likes</span>
            <input type="checkbox" className="accent-(--btn-primary)" />
          </label>

          <label className="flex items-center justify-between">
            <span>Shared Posts</span>
            <input type="checkbox" className="accent-(--btn-primary)" />
          </label>

          <label className="flex items-center justify-between">
            <span>New comments</span>
            <input type="checkbox" className="accent-(--btn-primary)" />
          </label>
        </div>
      </main>
    </div>
  );
}
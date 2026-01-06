import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";

export function PrivacySettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex">
      <Navigation />

      <main className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-(--text-secondary) mb-3"
            aria-label="Black"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Privacy & Security</h1>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-(--bg-secondary) border border-white/10 p-5 space-y-4">
          <label className="flex items-center justify-between">
            <span>Private account</span>
            <input type="checkbox" className="accent-(--btn-primary)" />
          </label>

          <label className="flex items-center justify-between">
            <span>Show profile publicly</span>
            <input type="checkbox" className="accent-(--btn-primary)" />
          </label>

          <button className="w-full mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition">
            Reset Security Settings
          </button>
        </div>
      </main>
    </div>
  );
}

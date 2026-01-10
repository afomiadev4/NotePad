import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="h-screen bg-[var(--bg-page)] box-border overflow-hidden text-[var(--text-main)] transition-colors duration-300">
      <div className="min-h-screen flex flex-col mx-auto w-[90%] max-w-md">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
            NotePad+
          </h1>
          <p className="mt-2 text-base font-normal leading-normal text-[var(--text-muted)]">
            Where ideas live forever...
          </p>
        </div>
        <div className="pb-10 space-y-3">
          <Link
            to="/register"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-base font-bold shadow-lg shadow-blue-600/20"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] text-base font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

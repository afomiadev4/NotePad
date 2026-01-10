import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="h-screen bg-(--bg-primary) box-border overflow-hidden text-(--text-primary)">
      <div className="min-h-screen flex flex-col mx-auto w-[90%] max-w-md">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight">NotePad+</h1>
          <p className="mt-2 text-base font-normal leading-normal text-(--text-secondary)">
            Where ideas live forever...
          </p>
        </div>
        <div className="pb-10 space-y-3">
          <Link
            to="/register"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-(--btn-primary) text-base font-bold"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-white/20 text-base font-medium text-white/90 hover:bg-white/5 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

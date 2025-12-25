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
        <div>
          <Link
            to="/register"
            className="flex min-w-21 w-full items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-(--btn-primary) text-base font-bold leading-normal"
          >
            <span>Get Started</span>
          </Link>
          <p className="text-(--text-secondary) text-sm font-normal leading-normal pb-10 pt-5 px-4 text-center underline">
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

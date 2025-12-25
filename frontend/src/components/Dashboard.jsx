import { Navigation } from "./Navigation";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-reverse items-center justify-center">
      <Navigation />
      <div className="border-2 w-[95%] max-w-6xl h-screen box-border flex items-center justify-center">
        <h1 className="text-4xl">Welcome to the dashboard</h1>
      </div>
    </div>
  );
}

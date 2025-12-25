export function Welcome() {
  return (
    <div className="h-screen bg-(--bg-primary) box-border overflow-hidden text-(--text-primary)">
      <div className="min-h-screen flex flex-col mx-auto w-[90%] max-w-96">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 class="text-3xl font-bold tracking-tight">NotePad+</h1>
          <p class="mt-2 text-base font-normal leading-normal text-(--text-secondary)">
            Where ideas live forever...
          </p>
        </div>
        <div>
          <a
            href="/signup"
            class="flex min-w-21 w-full items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-(--btn-primary) text-base font-bold leading-normal"
          >
            <span>Get Started</span>
          </a>
          <p class="text-(--text-secondary) text-sm font-normal leading-normal pb-10 pt-5 px-4 text-center underline">
            <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Navigation } from "./Navigation";

export function AccountPage() {
  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) font-display flex text-(--text-primary)">
      <Navigation />
      {/* Main content */}
      <div className="flex-1 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 p-4 backdrop-blur-sm shrink-0 border-b border-slate-200/10">
          <label
            htmlFor="nav-toggle"
            className="flex size-12 cursor-pointer items-center justify-start -ml-2"
          >
            <button className="flex h-10 w-10 items-center justify-center rounded-full">
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </label>
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">
            Account
          </h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent">
              <i className="fa-solid fa-ellipsis-vertical text-2xl"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 bg-background-dark">
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  alt="User Avatar"
                  className="h-28 w-28 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxnMVuj5nEyLEn0WopcnfrvaGHqG9U4hVQA_LuhtYILWOqY644_1X1nAIRl43W12_D9BGhW5Et67QTPIArWvDPBtpzPvOrVtXnBdIDqZaPEo9axzID04FmubeoSu1YcRu0OfNTCl9vHEFKBNKhUmNeLoVoRak71naeZW9ZnDWV_L7cQR3H87WdeTnv_G5Etzu13RjBJrrnEsl3juANvYFAHad_Zcv9LYSWSEgGOS0mQxWgdCLF8GM9PA7QyArxgXBhtXGwmGdoO81Z"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-(--bg-secondary)">
                  <i className="fa-solid fa-pen text-sm"></i>
                </button>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">John</p>
                <p className="text-base">john.doe@example.com</p>
              </div>
              <button className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold">
                Edit Profile
              </button>
            </div>

            {/* General settings */}
            <div className="mt-10 space-y-2">
              <h2 className="px-4 text-xs font-bold uppercase">General</h2>
              <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-bell text-slate-400"></i>
                    <span className="font-medium">Notifications</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-palette text-slate-400"></i>
                    <span className="font-medium">Appearance</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-lock text-slate-400"></i>
                    <span className="font-medium">Privacy & Security</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="mt-8 space-y-2">
              <h2 className="px-4 text-xs font-bold uppercase">Support</h2>
              <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-circle-question w-5 text-center"></i>
                    <span className="font-medium">Help Center</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
                <a className="flex items-center justify-between p-4" href="#">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-info w-5 text-center"></i>
                    <span className="font-medium">About NotePad+</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-500"></i>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

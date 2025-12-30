import { useState } from "react";
import { Navigation } from "./Navigation";
import EditProfile from "./EditProfile";
import GenericModal from "../Modals/GenericModal";
import { useTheme } from "../Context/ThemeContext";
export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const [user, setUser] = useState({
    name: "John",
    email: "john.doe@example.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxnMVuj5nEyLEn0WopcnfrvaGHqG9U4hVQA_LuhtYILWOqY644_1X1nAIRl43W12_D9BGhW5Et67QTPIArWvDPBtpzPvOrVtXnBdIDqZaPEo9axzID04FmubeoSu1YcRu0OfNTCl9vHEFKBNKhUmNeLoVoRak71naeZW9ZnDWV_L7cQR3H87WdeTnv_G5Etzu13RjBJrrnEsl3juANvYFAHad_Zcv9LYSWSEgGOS0mQxWgdCLF8GM9PA7QyArxgXBhtXGwmGdoO81Z",
  });

  return (
    <div
      className="relative w-full min-h-screen font-display flex"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navigation />

      <div className="flex-1 flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 p-4 backdrop-blur-sm border-b border-slate-200/10">
          <h1 className="flex-1 text-center text-lg font-bold">Account</h1>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 bg-background-dark">
          <div className="mx-auto max-w-md">
            {!isEditing && (
              <>
                {/* PROFILE */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      alt="User Avatar"
                      className="h-28 w-28 rounded-full object-cover border-2 border-blue-400"
                      src={user.avatar}
                    />
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-(--bg-card) cursor-pointer hover:bg-(--hover-color) transition"
                    >
                      <i className="fa-solid fa-pen text-sm"></i>
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.name}</p>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 rounded-full bg-blue-400 px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-500 transition"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* GENERAL SETTINGS */}
                <div className="mt-10 space-y-2">
                  <h2 className="px-4 text-xs font-bold uppercase">General</h2>
                  <div className="divide-y divide-slate-200/10 rounded-xl bg-( --bg-card)">
                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-() transition"
                      onClick={() => setIsNotificationsOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-bell"></i>
                        <span className="font-medium">Notifications</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>

                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-() transition"
                      onClick={() => setIsPrivacyOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-lock "></i>
                        <span className="font-medium">Privacy & Security</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>

                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-() transition rounded-b-xl"
                      onClick={() => setIsAppearanceOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-palette "></i>
                        <span className="font-medium">Appearance</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>
                  </div>
                </div>

                {/* SUPPORT */}
                <div className="mt-8 space-y-2">
                  <h2 className="px-4 text-xs font-bold uppercase">Support</h2>
                  <div className="divide-y divide-slate-200/10 rounded-xl bg-( --bg-card)">
                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-() transition"
                      onClick={() => setIsHelpOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-circle-question w-5 text-center"></i>
                        <span className="font-medium">Help Center</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>

                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-() transition rounded-b-xl"
                      onClick={() => setIsAboutOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-info w-5 text-center"></i>
                        <span className="font-medium">About NotePad+</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>
                  </div>
                </div>

                {/* MODALS */}

                <GenericModal
                  isOpen={isAboutOpen}
                  onClose={() => setIsAboutOpen(false)}
                >
                  <h3>About NotePad+</h3>
                  <p>
                    Notepad+ is a modern note-taking application that goes
                    beyond writing by integrating a built-in social media
                    platform. Users can create, manage, and organize notes while
                    also sharing ideas, reacting to posts, and engaging with
                    others in a simple, intuitive environment.
                  </p>
                </GenericModal>
                <GenericModal
                  isOpen={isHelpOpen}
                  onClose={() => setIsHelpOpen(false)}
                  title="Help Center"
                >
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>How to create a new note?</li>
                    <li>How to edit or delete notes?</li>
                    <li>How to backup my notes?</li>
                    <li>How to change my profile?</li>
                    <li>Contact support for other issues</li>
                  </ul>
                </GenericModal>

                {/* PRIVACY & SECURITY */}
                <GenericModal
                  isOpen={isPrivacyOpen}
                  onClose={() => setIsPrivacyOpen(false)}
                  title="Privacy & Security"
                >
                  <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                    <button
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-key text-slate-400"></i>
                        <span className="font-medium">Change Password</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>

                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-shield-halved text-slate-400"></i>
                        <span className="font-medium">
                          Two-Factor Authentication (2FA)
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>

                    <button
                      onClick={() => setIsLoggedOut(true)}
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-right-from-bracket text-slate-400"></i>
                        <span className="font-medium">
                          Logout from All Devices
                        </span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>

                    <button
                      className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-800 transition rounded-b-xl"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-trash text-slate-400"></i>
                        <span className="font-medium">Delete Account</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-500"></i>
                    </button>
                  </div>
                </GenericModal>

                <GenericModal
                  isOpen={isAppearanceOpen}
                  onClose={() => setIsAppearanceOpen(false)}
                  title="Appearance"
                >
                  <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                    {["light", "dark", "system"].map((t, idx) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-800 transition ${
                          idx === 2 ? "rounded-b-xl" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <i
                            className={`fa-solid ${
                              t === "light"
                                ? "fa-sun"
                                : t === "dark"
                                ? "fa-moon"
                                : "fa-desktop"
                            } text-slate-400`}
                          ></i>
                          <span className="font-medium">
                            {t === "light"
                              ? "Light Theme"
                              : t === "dark"
                              ? "Dark Theme"
                              : "System Default"}
                          </span>
                        </div>
                        <i
                          className={`fa-solid fa-check ${
                            theme === t ? "text-blue-400" : "text-transparent"
                          }`}
                        ></i>
                      </button>
                    ))}
                  </div>
                </GenericModal>

                <GenericModal
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  title="Notifications"
                >
                  <div className="divide-y divide-slate-200/10 rounded-xl bg-slate-900/60">
                    {[
                      { name: "New Notes", icon: "fa-sticky-note" },
                      { name: "Notes Updated", icon: "fa-pen-to-square" },
                      { name: "Reminders", icon: "fa-bell" },
                    ].map((item, idx) => (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between p-4 ${
                          idx === 2 ? "rounded-b-xl" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <i
                            className={`fa-solid ${item.icon} text-slate-400`}
                          ></i>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </GenericModal>
                <GenericModal
                  isOpen={isChangePasswordOpen}
                  onClose={() => setIsChangePasswordOpen(false)}
                  title="Change Password"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsChangePasswordOpen(false)}
                        className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 font-semibold hover:bg-slate-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert("Password changed!");
                          setIsChangePasswordOpen(false);
                        }}
                        className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 font-semibold hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </GenericModal>
                <GenericModal
                  isOpen={isLoggedOut}
                  onClose={() => setIsLoggedOut(false)}
                  title="Log out From All Device"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300">
                      Are you sure you want to Log Out from devices? This action
                      cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 font-semibold hover:bg-slate-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert(" you log out From device!");
                          setIsLoggedOut(false);
                        }}
                        className="flex-1 rounded-lg bg-(--btn-primary) px-4 py-2.5 font-semibold hover:bg-blue-800 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </GenericModal>
                <GenericModal
                  isOpen={isDeleteConfirmOpen}
                  onClose={() => setIsDeleteConfirmOpen(false)}
                  title="Delete Account"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300">
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 font-semibold hover:bg-slate-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert("Account deleted!");
                          setIsDeleteConfirmOpen(false);
                        }}
                        className="flex-1 rounded-lg bg-(--btn-primary) px-4 py-2.5 font-semibold hover:bg-blue-800 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </GenericModal>
              </>
            )}

            {isEditing && (
              <EditProfile
                key={user.avatar}
                user={user}
                setUser={setUser}
                onCancel={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

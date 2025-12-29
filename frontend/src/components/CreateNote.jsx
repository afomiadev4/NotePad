import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";

export function CreateNote({
  defaultFolder = "posted",
  hideFolder = true,
  isPost = false,
}) {
  const navigate = useNavigate();

  const handleSave = (newNoteData) => {
    const freshNote = {
      ...newNoteData,
      user: "John Doe", // Mock current user
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxnMVuj5nEyLEn0WopcnfrvaGHqG9U4hVQA_LuhtYILWOqY644_1X1nAIRl43W12_D9BGhW5Et67QTPIArWvDPBtpzPvOrVtXnBdIDqZaPEo9axzID04FmubeoSu1YcRu0OfNTCl9vHEFKBNKhUmNeLoVoRak71naeZW9ZnDWV_L7cQR3H87WdeTnv_G5Etzu13RjBJrrnEsl3juANvYFAHad_Zcv9LYSWSEgGOS0mQxWgdCLF8GM9PA7QyArxgXBhtXGwmGdoO81Z",
      time: "Just now",
      createdAt: new Date().toISOString(),
    };

    fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(freshNote),
    })
      .then((res) => {
        if (res.ok) {
          navigate(defaultFolder === "posted" ? "/feed" : "/folders");
        } else {
          alert("Failed to create note.");
        }
      })
      .catch((err) => {
        console.error("Error creating note:", err);
        alert("An error occurred.");
      });
  };

  const handleClose = () => {
    navigate(-1); // Go back
  };

  return (
    <div className="relative w-full min-h-screen bg-(--bg-primary) font-display flex text-(--text-primary)">
      <Navigation />

      <div className="flex-1 flex min-h-screen flex-col lg:ml-64 relative bg-(--bg-primary)">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-160 h-160 bg-blue-500/5 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-120 h-120 bg-indigo-500/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <NoteModal
          isOpen={true}
          mode="create"
          initialFolderId={defaultFolder}
          hideFolderSelection={hideFolder}
          onClose={handleClose}
          onSave={handleSave}
          isPost={isPost}
        />
      </div>
    </div>
  );
}

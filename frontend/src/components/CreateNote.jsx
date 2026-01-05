import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { NoteModal } from "./NoteModal";
import { useEffect, useState } from "react";

export function CreateNote({
  defaultFolder = "posted",
  hideFolder = true,
  isPost = false,
}) {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);

  const ensureUncategorizedFolder = async () => {
  const res = await fetch("http://localhost:3000/folders?id=uncategorized");
  const existing = await res.json();

    if (existing.length === 0) {
      await fetch("http://localhost:3000/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "uncategorized",
          name: "Uncategorized",
          icon: "fa-folder",
          color: "text-slate-400",
          type: "system",
        }),
      });
    }
  };

  const handleSave = async (newNoteData) => {
    let folderId = newNoteData.folderId || "uncategorized";

    // Check if Uncategorized exists
    const folderRes = await fetch(
      "http://localhost:3000/folders?id=uncategorized"
    );
    const existing = await folderRes.json();

    // If not, create it
    if (existing.length === 0) {
      await fetch("http://localhost:3000/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "uncategorized",
          name: "Uncategorized",
          icon: "fa-folder",
          color: "text-slate-400",
          type: "system",
        }),
      });
    }

    // 3️⃣ Save the note
    const freshNote = {
      ...newNoteData,
      folderId,
      user: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
      time: "Just now",
      createdAt: new Date().toISOString(),
    };

  const res = await fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(freshNote),
  });

  if (res.ok) {
    navigate(folderId === "posted" ? "/feed" : `/folders/${folderId}`);
  } else {
    alert("Failed to create note.");
  }
};


  const handleClose = () => {
    navigate(-1); // Go back
  };

    useEffect(() => {
    ensureUncategorizedFolder();

    fetch("http://localhost:3000/folders")
      .then(res => res.json())
      .then(data => setFolders(data))
      .catch(err => console.error("Failed to load folders", err));
  }, []);


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
          folders={folders}
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

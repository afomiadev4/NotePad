import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Navigation } from "./Navigation";
import { FolderModal } from "./FolderModal";
import { NoteModal } from "./NoteModal";
=======
>>>>>>> 9cb5ffd7828fb3d29cb53b8b2b57c8e7e4cb3978
import "./Dashboard.css";

export default function Dashboard() {
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [folderToEdit, setFolderToEdit] = useState(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteModalMode, setNoteModalMode] = useState("view");

    // Fetch folders and notes from backend
    const fetchData = () => {
        Promise.all([
            fetch("http://localhost:3000/folders").then((res) => res.json()),
            fetch("http://localhost:3000/notes").then((res) => res.json()),
        ])
            .then(([foldersData, notesData]) => {
                setFolders(foldersData);
                setNotes(notesData);
            })
            .catch((err) => console.error("Error fetching data:", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        setSelectedNote(null);
    };

    const folderNotes = selectedFolder
        ? notes.filter((note) => note.folderId === selectedFolder.id)
        : [];

    return (
        <div className="dashboard-container">
            {/* Left navigation */}
            <Navigation />

            {/* Main content */}
            <main className="dashboard-main">
                <h1 className="dashboard-title">
                    {selectedNote
                        ? selectedNote.title
                        : selectedFolder
                            ? selectedFolder.name
                            : "Dashboard"}
                </h1>

                {selectedNote ? (
                    <div className="note-content">{selectedNote.content}</div>
                ) : selectedFolder ? (
                    <div className="notes-list">
                        {folderNotes.length > 0 ? (
                            folderNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="note-card"
                                    onClick={() => setSelectedNote(note)}
                                >
                                    {note.title}
                                </div>
                            ))
                        ) : (
                            <p>No notes in this folder</p>
                        )}
                    </div>
                ) : (
                    <p>Select a folder on the right to view notes</p>
                )}
            </main>

            {/* Right sidebar */}
            <aside className="dashboard-right">
                <h2 className="folders-title">Folders</h2>
                <ul className="folders-list">
                    {folders.map((folder) => (
                        <li
                            key={folder.id}
                            className={`folder-item ${selectedFolder?.id === folder.id ? "active" : ""
                                }`}
                            onClick={() => handleFolderClick(folder)}
                        >
                            <i
                                className={`fa-solid ${folder.icon || "fa-folder"} folder-icon ${folder.color || "text-blue-400"
                                    }`}
                            ></i>
                            {folder.name}
                        </li>
                    ))}
                </ul>

                <button
                    className="new-folder-btn"
                    onClick={() => {
                        setFolderToEdit(null);
                        setIsFolderModalOpen(true);
                    }}
                >
                    <i className="fa-solid fa-plus"></i> New Folder
                </button>
            </aside>

            {/* Folder Modal */}
            <FolderModal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
                folder={folderToEdit}
                onCreate={() => fetchData()} // refresh after creation/edit
            />

            {/* Note Modal */}
            <NoteModal
                isOpen={isNoteModalOpen}
                note={selectedNote}
                mode={noteModalMode}
                onClose={() => setIsNoteModalOpen(false)}
            />
        </div>
    );
}

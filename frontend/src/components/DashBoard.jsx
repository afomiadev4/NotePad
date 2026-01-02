import React, { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import "./Dashboard.css";

export default function Dashboard() {
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:3000/folders").then((res) => res.json()),
            fetch("http://localhost:3000/notes").then((res) => res.json()),
        ])
            .then(([foldersData, notesData]) => {
                setFolders(foldersData);
                setNotes(notesData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const folderNotes = selectedFolder
        ? notes.filter((n) => n.folderId === selectedFolder.id)
        : [];

    return (
        <div className="dashboard-container">
            {/* LEFT SIDEBAR */}
            <Navigation />

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {loading ? (
                    <p>Loading...</p>
                ) : selectedNote ? (
                    <>
                        <h2>{selectedNote.title}</h2>
                        <div className="note-content">{selectedNote.content}</div>
                    </>
                ) : selectedFolder ? (
                    <>
                        <h2>{selectedFolder.name}</h2>
                        {folderNotes.length === 0 ? (
                            <p>No notes in this folder</p>
                        ) : (
                            <div className="notes-list">
                                {folderNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="note-card"
                                        onClick={() => setSelectedNote(note)}
                                    >
                                        {note.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p>Select a folder from the right</p>
                )}
            </main>

            {/* RIGHT SIDEBAR (FOLDERS) */}
            <aside className="dashboard-right">
                <h3>Folders</h3>
                <ul>
                    {folders.map((folder) => (
                        <li
                            key={folder.id}
                            className={
                                selectedFolder?.id === folder.id ? "active" : ""
                            }
                            onClick={() => {
                                setSelectedFolder(folder);
                                setSelectedNote(null);
                            }}
                        >
                            <i className="fa-solid fa-folder"></i>
                            {folder.name}
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

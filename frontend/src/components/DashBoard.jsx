import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState("Overview");
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);

    // Fetch folders and notes from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const foldersRes = await axios.get("http://localhost:3000/folders");
                const notesRes = await axios.get("http://localhost:3000/notes");
                setFolders(foldersRes.data);
                setNotes(notesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const menuItems = ["Overview", "Folders", "Notes", "Settings"];

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h2>Dashboard</h2>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            className={activeMenu === item ? "active" : ""}
                            onClick={() => setActiveMenu(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="dashboard-main">
                <h1>{activeMenu}</h1>

                {activeMenu === "Overview" && (
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <h3>Total Notes</h3>
                            <p>{notes.length}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Folders</h3>
                            <p>{folders.length}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Recent Activity</h3>
                            <p>{notes.length} notes updated today</p>
                        </div>
                    </div>
                )}

                {activeMenu === "Folders" && (
                    <div className="folders-list">
                        {folders.map((folder) => (
                            <div key={folder.id} className="folder-card">
                                <h3>{folder.name}</h3>
                                <p>{folder.description || "No description"}</p>
                                <p>{notes.filter((n) => n.folderId === folder.id).length} notes</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeMenu === "Notes" && (
                    <div className="notes-list">
                        {notes.map((note) => (
                            <div key={note.id} className="note-card">
                                <h4>{note.title}</h4>
                                <p>{note.content.slice(0, 100)}...</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeMenu === "Settings" && <p>Update your account settings here.</p>}
            </main>
        </div>
    );
};

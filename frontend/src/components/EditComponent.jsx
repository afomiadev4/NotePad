import React, { useContext } from "react";
import { NoteModal } from "./NoteModal";
import { NoteContext } from "../Context/NoteContext";

export function EditNote({ note, isOpen, onClose }) {
  const { editNote } = useContext(NoteContext);
  const handleSave = (updatedNoteData) => {
    editNote(note.id, updatedNoteData);
    onClose();
  };

  return (
    <NoteModal
      isOpen={isOpen}
      note={note}
      mode="edit"
      onClose={onClose}
      onSave={handleSave}
    />
  );
}

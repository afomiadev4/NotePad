import React, { useContext } from "react";
import { NoteModal } from "./NoteModal";
import { NoteContext } from "../Context/NoteContext";
import { useParams } from "react-router-dom";


export function EditNote() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, editNote } = useContext(NoteContext);

  const [note, setNote] = useState(null);

  // Find note from context (or fetch if needed)
  useEffect(() => {
    const foundNote = notes.find((n) => n.id === noteId);
    if (foundNote) {
      setNote(foundNote);
    }
  }, [noteId, notes]);

  const handleSave = (updatedNoteData) => {
    editNote(noteId, updatedNoteData);
    navigate(-1); // go back after save
  };

  if (!note) return null;

  return (
    <NoteModal
      isOpen={isOpen}
      note={note}
      mode="edit"
      onClose={() => Navigate(-1)}
      onSave={handleSave}
    />
  );
}

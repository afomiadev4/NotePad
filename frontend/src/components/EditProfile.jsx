import { useState, useEffect, useRef } from "react";

const EditProfile = ({ user, setUser, onCancel, onSave }) => {
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const previewUrlRef = useRef(null);
  const isSavedRef = useRef(false);
  useEffect(() => {
    return () => {
      if (previewUrlRef.current && !isSavedRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = objectUrl;
    setAvatar(objectUrl);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    isSavedRef.current = true;

    setUser({ ...user, name, avatar });
    onSave();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <img
            src={avatar}
            alt="Avatar preview"
            className="h-28 w-28 rounded-full object-cover border-2 border-blue-400"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />

          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <i className="fa-solid fa-camera text-white text-lg"></i>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <p className="text-xs text-slate-400">Click image to change photo</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-500">
          {" "}
          Change Your Name
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-(--border-color) bg-(--bg-card) p-2.5 text-(--text-primary) focus:border-blue-400 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg bg-slate-600 px-4 py-2.5 font-semibold hover:bg-slate-700 text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 text-white rounded-lg bg-(--btn-primary) px-4 py-2.5 font-semibold hover:bg-blue-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;

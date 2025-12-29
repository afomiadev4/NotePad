import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";

const EmptyNote = () => {
  const navigate = useNavigate();
  const handelClick = () => {
    navigate("/add-note");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--bg-primary) w-full relative space-y-4">
      <div className="flex flex-col items-center justify-center  text-white mb-60 space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-25 rounded-full border bg-gray-200 text-black p-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <h2>Your canvas awaits.</h2>
        <p>Tap the + button to start</p>
      </div>
      <svg
        onClick={() => handelClick()}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="fixed bottom-24 right-6 md:bottom-28 md:right-10 
             size-12 md:size-16 
             bg-blue-600 hover:bg-blue-700 
             rounded-full p-3 shadow-2xl 
             cursor-pointer transition-all active:scale-95 z-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </div>
  );
};

export default EmptyNote;

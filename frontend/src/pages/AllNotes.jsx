import React from "react";

const ALLNotes = () => {
  return (
    <div className="w-full max-w-md  rounded-xl shadow-md min-h-screen bg-(--bg-primary)  hover:shadow-lg transition p-5 space-y-3 cursor-pointer mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Meeting Recap</h2>

        <li className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
          work
        </li>
      </div>

      <p className="text-sm text-gray-100 line-clamp-3">
        Meeting recap Meeting recap Meeting recap Meeting recap Meeting recap
        Meeting recap Meeting recap
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
        <span>2 days ago</span>
        <span className="text-indigo-500 font-medium">Read more</span>
      </div>
    </div>
  );
};

export default ALLNotes;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryColorControl = () => {
  const [webMenuBgColor, setWebMenuBgColor] = useState("#ffffff");
  const [webMenuTextColor, setWebMenuTextColor] = useState("#000000");
  const [webMenuFontSize, setWebMenuFontSize] = useState(16);
  const [webMenuHoverColor, setWebMenuHoverColor] = useState("#cccccc");
  const [webMenuHoverTextColor, setWebMenuHoverTextColor] = useState("#cccccc");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/webmenu`)
      .then((res) => {
        const data = res.data;
        setWebMenuBgColor(data.webMenuBgColor || "#ffffff");
        setWebMenuTextColor(data.webMenuTextColor || "#000000");
        setWebMenuFontSize(data.webMenuFontSize || 16);
        setWebMenuHoverColor(data.webMenuHoverColor || "#cccccc");
        setWebMenuHoverTextColor(data.webMenuHoverTextColor || "#cccccc");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch web menu settings!");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/webmenu`, {
        webMenuBgColor,
        webMenuTextColor,
        webMenuFontSize: Number(webMenuFontSize),
        webMenuHoverColor,
        webMenuHoverTextColor,
      });
      toast.success("Web Menu settings saved!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save web menu settings!");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-600">
          Home page category select color control
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className={`px-3 py-1 rounded text-white font-medium ${
            isEditing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isEditing}
        >
          Edit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Web Menu Background Color */}
        <div>
          <label className="block mb-1 font-medium">
            Web Menu Background Color:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={webMenuBgColor}
              onChange={(e) => setWebMenuBgColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={webMenuBgColor}
              onChange={(e) => setWebMenuBgColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Web Menu Text Color */}
        <div>
          <label className="block mb-1 font-medium">Web Menu Text Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={webMenuTextColor}
              onChange={(e) => setWebMenuTextColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={webMenuTextColor}
              onChange={(e) => setWebMenuTextColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Web Menu Font Size */}
        <div>
          <label className="block mb-1 font-medium">
            Web Menu Font Size (px):
          </label>
          <input
            type="number"
            value={webMenuFontSize}
            onChange={(e) => setWebMenuFontSize(e.target.value)}
            disabled={!isEditing}
            className="border px-2 py-1 rounded w-20"
          />
        </div>

        {/* Web Menu Hover Color */}
        <div>
          <label className="block mb-1 font-medium">
            Web Menu Hover Color:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={webMenuHoverColor}
              onChange={(e) => setWebMenuHoverColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={webMenuHoverColor}
              onChange={(e) => setWebMenuHoverColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Web Menu Hover Text Color */}
        <div>
          <label className="block mb-1 font-medium">
            Web Menu Hover Text Color:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={webMenuHoverTextColor}
              onChange={(e) => setWebMenuHoverTextColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={webMenuHoverTextColor}
              onChange={(e) => setWebMenuHoverTextColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded text-white font-semibold mt-2 ${
            isEditing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditing}
        >
          Apply Styles
        </button>
      </form>
    </div>
  );
};

export default CategoryColorControl;
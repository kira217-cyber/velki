import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BannerColorControl = () => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/banner`)
      .then((res) => {
        const data = res.data;
        setBgColor(data.bgColor || "#ffffff");
        setTextColor(data.textColor || "#000000");
        setFontSize(data.fontSize || 16);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch banner settings!");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/banner`, {
        bgColor,
        textColor,
        fontSize: Number(fontSize),
      });
      toast.success("Banner settings saved!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save banner settings!");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-600">
          Home page banner title color control
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
        {/* Background Color */}
        <div>
          <label className="block mb-1 font-medium">Background Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block mb-1 font-medium">Text Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              disabled={!isEditing}
              className="w-16 h-10 rounded border"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              disabled={!isEditing}
              className="border px-2 py-1 rounded w-48"
            />
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block mb-1 font-medium">Font Size (px):</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            disabled={!isEditing}
            className="border px-2 py-1 rounded w-20"
          />
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

export default BannerColorControl;
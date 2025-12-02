import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const FavAndTitleControl = () => {
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [id, setId] = useState(null); // Local state for ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ✅ সেটিংস ফেচ
  const fetchSettings = async () => {
    try {
      console.log("Fetching settings from:", `${import.meta.env.VITE_API_URL}/api/settings`);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      console.log("Response data:", res.data);
      if (res.data) {
        setTitle(res.data.title || "");
        setFavicon(res.data.faviconUrl || null);
        if (res.data._id) setId(res.data._id); // Set ID from response
      }
    } catch (err) {
      console.error("Fetch error details:", err.response ? err.response.data : err.message);
      toast.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ✅ ফাইল সিলেক্ট
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // ✅ আপলোড
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (e.target.favicon.files[0]) {
      formData.append("favicon", e.target.favicon.files[0]);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Settings updated successfully!");
      setIsModalOpen(false);
      setPreview(null);
      fetchSettings();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to update settings");
    }
  };

  // ✅ ফ্যাভিকন ডিলিট
  const handleDeleteFavicon = async () => {
    try {
      if (!id) {
        toast.error("No settings ID available");
        return;
      }
      console.log("Deleting favicon with ID:", id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/settings/favicon/${id}`);
      toast.success("Favicon deleted successfully!");
      fetchSettings();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err.response ? err.response.data : err.message);
      toast.error(`Failed to delete favicon: ${err.response?.data?.message || err.message}`);
    }
  };

  // ক্লিনআপ প্রিভিউ URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="bg-[#e4d9c8]">
      {/* Upload Section */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Title & Favicon Control</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-yellow-700 transition-colors"
        >
          + Edit
        </button>
      </div>

      {/* Preview */}
      <div className="p-5">
        <h3 className="font-semibold mb-2">Website Title:</h3>
        <p className="border p-2 rounded-md">{title || "No title set"}</p>

        <h3 className="font-semibold mt-4 mb-2">Favicon:</h3>
        {favicon ? (
          <div className="relative inline-block">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="absolute cursor-pointer -top-2 -right-2 bg-yellow-600 text-white p-1 rounded-full hover:bg-yellow-700 transition-colors"
              aria-label="Delete favicon"
            >
              <FaTimes />
            </button>
            <img
              src={`${import.meta.env.VITE_API_URL}${favicon}`}
              alt="Favicon"
              className="w-16 h-16 border p-2 object-contain rounded-md"
              onError={() => toast.error("Failed to load favicon")}
            />
          </div>
        ) : (
          <p>No favicon set</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[400px] relative p-6">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setPreview(null);
              }}
              className="absolute cursor-pointer top-2 right-2 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <form onSubmit={handleUpload}>
              <label className="block mb-2 font-semibold">Website Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-4 rounded-md"
              />

              <label className="block mb-2 font-semibold">Upload Favicon</label>
              <input
                type="file"
                name="favicon"
                accept="image/*"
                onChange={handleChange}
                className="mb-2"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 border mt-2 rounded-md"
                />
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-gray-700 cursor-pointer text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[350px] p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete the favicon?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteFavicon}
                className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavAndTitleControl;
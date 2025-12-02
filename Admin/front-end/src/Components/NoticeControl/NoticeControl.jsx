import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const NoticeControl = () => {
  const [title, setTitle] = useState("");
  const [id, setId] = useState(null); // Local state for ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ✅ নোটিস ফেচ
  const fetchNotice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices`);
      console.log("Response data:", res.data);
      if (res.data) {
        setTitle(res.data.title || "");
        if (res.data._id) setId(res.data._id); // Set ID from response
      }
    } catch (err) {
      console.error("Fetch error details:", err.response ? err.response.data : err.message);
      toast.error("Failed to fetch notice");
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  // ✅ আপলোড/আপডেট
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);

    try {
      let response;
      if (id) {
        // Update existing notice
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/notices/${id}`, formData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Create new notice
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, formData, {
          headers: { "Content-Type": "application/json" },
        });
      }
      toast.success("Notice updated successfully!");
      setIsModalOpen(false);
      fetchNotice(); // Refresh data
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to update notice");
    }
  };

  // ✅ নোটিস ডিলিট
  const handleDeleteNotice = async () => {
    try {
      if (!id) {
        toast.error("No notice ID available");
        return;
      }
      console.log("Deleting notice with ID:", id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notices/${id}`);
      toast.success("Notice deleted successfully!");
      setId(null);
      setTitle("");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err.response ? err.response.data : err.message);
      toast.error(`Failed to delete notice: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="bg-[#e4d9c8]">
      {/* Upload Section */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notice Control</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-yellow-700 transition-colors"
        >
          + Edit
        </button>
      </div>

      {/* Preview */}
      <div className="p-5">
        <h3 className="font-semibold mb-2">Notice Title:</h3>
        <p className="border p-2 rounded-md">{title || "No notice set"}</p>
        {title && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="mt-2 bg-yellow-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
          >
            Delete Notice
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[400px] relative p-6">
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="absolute cursor-pointer top-2 right-2 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <form onSubmit={handleUpload}>
              <label className="block mb-2 font-semibold">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-4 rounded-md"
                placeholder="Enter notice title"
              />

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
              Are you sure you want to delete this notice?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteNotice}
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

export default NoticeControl;
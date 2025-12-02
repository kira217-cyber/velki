import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginImageControl = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loginImage, setLoginImage] = useState(null);
  const [id, setId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false); // Added dragActive state

  // ✅ লগইন ইমেজ ডাটা ফেচ
  const fetchLoginImage = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/login-image`);
      if (res.data && res.data.loginImageUrl) {
        setLoginImage(res.data.loginImageUrl);
        setId(res.data._id);
      }
    } catch (err) {
      console.error("Error fetching login image:", err);
      toast.error("Failed to fetch login image");
    }
  };

  useEffect(() => {
    fetchLoginImage();
  }, []);

  // ✅ ফাইল সিলেক্ট
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // ✅ আপলোড
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("loginImage", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/login-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Login image uploaded successfully!");
      fetchLoginImage();
      setIsModalOpen(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload login image");
    }
  };

  // ✅ ডিলিট
  const handleDelete = async () => {
    if (!id) {
      toast.error("No login image selected for deletion");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/login-image/${id}`);
      toast.success("Login image deleted successfully!");
      setIsDeleteModalOpen(false);
      setLoginImage(null);
      setId(null);
    } catch (err) {
      console.error("Delete error:", err.response ? err.response.data : err.message);
      toast.error(`Failed to delete login image: ${err.response?.data?.message || err.message}`);
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
    <div className="bg-[#e4d9c8] ">
      {/* Upload Section */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Login Image Control</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-yellow-700 transition-colors"
        >
          + Add Login Image
        </button>
      </div>

      {/* Uploaded Image Preview */}
      {loginImage ? (
        <div className="relative p-5">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="absolute cursor-pointer top-2 right-2 bg-yellow-600 text-white p-1 rounded-full hover:bg-yellow-700 transition-colors"
            aria-label="Delete login image"
          >
            <FaTimes />
          </button>

          <img
            src={`${import.meta.env.VITE_API_URL}${loginImage}`}
            alt="Login"
            className="w-full max-h-40 object-contain border p-3 rounded-md"
            onError={() => toast.error("Failed to load login image")}
          />
        </div>
      ) : (
        <p className="text-black p-5 border border-gray-300 rounded-md text-center">
          No login image found, please upload one.
        </p>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[400px] relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setPreview(null);
                setFile(null);
              }}
              className="absolute cursor-pointer top-2 right-2 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div
              className={`m-4 border-2 border-dashed rounded-md p-6 text-center ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1091/1091000.png"
                alt="Upload icon"
                className="mx-auto w-12 mb-3"
              />

              <p className="text-gray-700">
                Select an image to upload <br />
                <span className="text-sm text-gray-500">
                  or drag and drop it here
                </span>
              </p>

              <div className="flex justify-center mt-4">
                <label className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-400 transition-colors">
                  + Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto mt-4 w-32 h-32 object-cover border rounded-md"
                />
              )}
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleUpload}
                className="bg-gray-700 cursor-pointer text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                + Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[350px] p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this login image?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
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

export default LoginImageControl;
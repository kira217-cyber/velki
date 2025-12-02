import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const LogoControl = () => {
  const { logo, logoId, setLogo, setLogoId, fetchLogo } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState(null);
  const [imageError, setImageError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;
  const logoUrl = logo ? `${baseUrl}${logo.startsWith("/") ? "" : "/"}${logo}` : null;
  
  // ✅ File select
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // ✅ Drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  // ✅ Upload handler
  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first!");

    const formData = new FormData();
    formData.append("logo", file);

    try {
      await axios.post(`${baseUrl}/api/logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchLogo();
      toast.success("Logo uploaded successfully!");
      setIsModalOpen(false);
      setPreview(null);
      setFile(null);
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.response?.data?.message || "Upload failed!");
    }
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!selectedLogoId) return toast.error("No logo selected for deletion");

    try {
      await axios.delete(`${baseUrl}/api/logo/${selectedLogoId}`);
      await fetchLogo();
      setIsDeleteModalOpen(false);
      setSelectedLogoId(null);
      toast.success("Logo deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Delete failed!");
    }
  };

  // ✅ Image load error
  const handleImageError = () => {
    setImageError("Failed to load logo image");
    toast.error("Logo image failed to load!");
  };

  // ✅ Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="bg-[#e4d9c8]">
    
      {/* Upload section */}
      <div className="bg-black text-white p-2 lg:px-16 flex justify-between items-center">
        <h2 className="font-semibold">Upload Logo</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-600 text-white cursor-pointer px-3 py-1 rounded-sm text-sm hover:bg-yellow-700 transition"
        >
          + Add Logo
        </button>
      </div>

      {/* Logo Preview */}
      <div className="p-5 lg:px-16">
        {logoUrl && !imageError ? (
          <div className="relative">
            <button
              onClick={() => {
                setSelectedLogoId(logoId);
                setIsDeleteModalOpen(true);
              }}
              className="absolute cursor-pointer top-2 right-2 lg:right-14 bg-yellow-600 text-white p-1 rounded-full hover:bg-yellow-700 transition"
            >
              <FaTimes />
            </button>
            <img
              src={logoUrl}
              alt="Uploaded Logo"
              className="w-full max-h-40 object-contain border p-3 rounded-md"
              onError={handleImageError}
            />
          </div>
        ) : (
          <p className="text-black p-5 border rounded text-center">
            {imageError || "No logo selected, please upload the logo"}
          </p>
        )}
      </div>

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
              className="absolute cursor-pointer top-2 right-2 bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700 transition"
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
              onDrop={handleDrop}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1091/1091000.png"
                alt="upload icon"
                className="mx-auto w-12 mb-3"
              />
              <p className="text-gray-700">
                Select an image to upload <br />
                <span className="text-sm text-gray-500">or drag and drop it here</span>
              </p>

              <div className="flex justify-center mt-4">
                <label className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-400 transition">
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
                  className="mx-auto mt-4 w-32 h-32 object-cover border rounded"
                />
              )}
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleUpload}
                className="bg-gray-700 cursor-pointer text-white px-5 py-2 rounded hover:bg-gray-800 transition"
              >
                + Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[350px] p-6 relative">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this logo?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 cursor-pointer px-4 py-2 rounded hover:bg-gray-400 transition"
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

export default LogoControl;

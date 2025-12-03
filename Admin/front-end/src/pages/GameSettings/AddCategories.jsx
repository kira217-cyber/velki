// components/AddCategories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const categoriesList = [
  "Popular",
  "Live",
  "Table",
  "Slot",
  "Fishing",
  "Egame",
];

const AddCategories = () => {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form state
  const [form, setForm] = useState({
    categoryName: "",
    providerId: "",
    providerName: "",
    mainImage: null,
    iconImage: null,
  });

  // Preview URLs
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [iconImagePreview, setIconImagePreview] = useState("");

  // Fetch Providers & Categories
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(
          "https://apigames.oracleapi.net/api/providers",
          {
            headers: {
              "x-api-key":
                "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            },
          }
        );
        setProviders(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load providers");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories`
        );
        setCategories(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    fetchProviders();
    fetchCategories();
  }, []);

  // Handle image preview
  useEffect(() => {
    if (form.mainImage) {
      setMainImagePreview(URL.createObjectURL(form.mainImage));
    } else {
      setMainImagePreview("");
    }
    if (form.iconImage) {
      setIconImagePreview(URL.createObjectURL(form.iconImage));
    } else {
      setIconImagePreview("");
    }
  }, [form.mainImage, form.iconImage]);

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      categoryName: cat.categoryName,
      providerId: cat.providerId,
      providerName: cat.providerName,
      mainImage: null,
      iconImage: null,
    });
    setMainImagePreview(`${import.meta.env.VITE_API_URL}${cat.mainImage}`);
    setIconImagePreview(`${import.meta.env.VITE_API_URL}${cat.iconImage}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({
      categoryName: "",
      providerId: "",
      providerName: "",
      mainImage: null,
      iconImage: null,
    });
    setMainImagePreview("");
    setIconImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("categoryName", form.categoryName);
    formData.append("providerId", form.providerId);
    formData.append("providerName", form.providerName);
    if (form.mainImage) formData.append("mainImage", form.mainImage);
    if (form.iconImage) formData.append("iconImage", form.iconImage);

    try {
      if (editingCategory) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/categories/${
            editingCategory._id
          }`,
          formData
        );
        toast.success("Category updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/categories`,
          formData
        );
        toast.success("Category created successfully!");
      }

      // Refresh categories
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      setCategories(res.data.data || []);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/categories/${id}`
      );
      toast.success("Category deleted!");
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-yellow-600">
        Category Management
      </h1>

      {/* Add New Category Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-yellow-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Category
        </h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <select
              required
              value={form.categoryName}
              onChange={(e) =>
                setForm({ ...form, categoryName: e.target.value })
              }
              className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition"
            >
              <option value="">Select Category</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provider
            </label>
            <select
              required
              value={form.providerId}
              onChange={(e) => {
                const selected = providers.find(
                  (p) => p._id === e.target.value
                );
                setForm({
                  ...form,
                  providerId: e.target.value,
                  providerName: selected?.name || "",
                });
              }}
              className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition"
            >
              <option value="">Select Provider</option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingCategory}
              onChange={(e) =>
                setForm({ ...form, mainImage: e.target.files[0] })
              }
              className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
            />
            {mainImagePreview && (
              <img
                src={mainImagePreview}
                alt="Main Preview"
                className="mt-3 w-full h-48 object-cover rounded-xl border-4 border-yellow-200"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icon Image
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingCategory}
              onChange={(e) =>
                setForm({ ...form, iconImage: e.target.files[0] })
              }
              className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
            />
            {iconImagePreview && (
              <img
                src={iconImagePreview}
                alt="Icon Preview"
                className="mt-3 w-32 h-32 object-cover rounded-xl border-4 border-yellow-200 mx-auto"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black font-bold py-4 rounded-xl text-lg transition transform hover:scale-105 disabled:opacity-70"
            >
              {loading
                ? "Saving..."
                : editingCategory
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-2 border-yellow-100"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${cat.mainImage}`}
              alt={cat.categoryName}
              className="w-full h-56 object-cover"
            />
            <div className="p-2 bg-gradient-to-b from-yellow-50 to-white">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}${cat.iconImage}`}
                  alt="icon"
                  className="w-16 h-16 rounded-xl border-4 border-yellow-300 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    Category: {cat.categoryName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                   Provider: {cat.providerName}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(cat)}
                  className="flex-1 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto p-8">
            <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
              Edit Category
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Same form fields as above, with current values */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <select
                  required
                  value={form.categoryName}
                  onChange={(e) =>
                    setForm({ ...form, categoryName: e.target.value })
                  }
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl focus:ring-4 focus:ring-yellow-200"
                >
                  <option value="">Select Category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  required
                  value={form.providerId}
                  onChange={(e) => {
                    const selected = providers.find(
                      (p) => p._id === e.target.value
                    );
                    setForm({
                      ...form,
                      providerId: e.target.value,
                      providerName: selected?.name || "",
                    });
                  }}
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl focus:ring-4 focus:ring-yellow-200"
                >
                  <option value="">Select Provider</option>
                  {providers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Image (Current)
                </label>
                <img
                  src={mainImagePreview}
                  alt="Current Main"
                  className="w-full h-48 object-cover rounded-xl border-4 border-yellow-200 mb-3"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, mainImage: e.target.files[0] })
                  }
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-500 file:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon Image (Current)
                </label>
                <img
                  src={iconImagePreview}
                  alt="Current Icon"
                  className="w-32 h-32 object-cover rounded-xl border-4 border-yellow-200 mx-auto mb-3"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, iconImage: e.target.files[0] })
                  }
                  className="w-full px-5 py-3 border-2 border-yellow-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-500 file:text-white"
                />
              </div>

              <div className="md:col-span-2 flex gap-4 justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black font-bold px-12 py-4 rounded-xl text-lg transition transform hover:scale-105"
                >
                  {loading ? "Updating..." : "Update Category"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-bold px-12 py-4 rounded-xl text-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategories;

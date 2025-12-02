import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DepositSetting1 = () => {
  const [form, setForm] = useState({
    pbu_rate: 100,
    pbu_rate2: 100,
    min_amount: 100,
    max_amount: 25000,
    payment_types: ["agent", "personal"],
    promotions: [
      {
        id: 1,
        title: "Easy 5% Deposit Bonus",
        type: "Sports",
        start: "2025-06-01T02:00",
        end: "2026-01-01T01:59",
        bonusPercent: 5,
      },
    ],
    payment_methods: [
      { id: "bkash", name: "bKash", image: "https://via.placeholder.com/50?text=bKash" },
      { id: "nagad", name: "Nagad", image: "https://via.placeholder.com/50?text=Nagad" },
    ],
    currencies: ["BDT", "USD"],
    currencies2: ["BDT", "USD"],
  });

  const [newMethod, setNewMethod] = useState({ name: "", image: "" });
  const [newCurrency, setNewCurrency] = useState("");
  const [newCurrency2, setNewCurrency2] = useState("");
  const [newPaymentType, setNewPaymentType] = useState("");
  const [editMode, setEditMode] = useState(false);

  // লোড সেটিংস
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/deposit/settings`);
        setForm(res.data);
        console.log(res.data.payment_methods)
      } catch (err) {
        toast.error("সেটিংস লোড ব্যর্থ!");
      }
    };
    fetchSettings();
  }, []);

  const handleAddMethod = () => {
    if (!newMethod.name || !newMethod.image) {
      toast.error("নাম এবং ইমেজ পূরণ করুন!");
      return;
    }
    setForm({
      ...form,
      payment_methods: [
        ...form.payment_methods,
        { id: newMethod.name.toLowerCase(), ...newMethod },
      ],
    });
    setNewMethod({ name: "", image: "" });
  };

  const handleDeleteMethod = (id) => {
    setForm({
      ...form,
      payment_methods: form.payment_methods.filter((m) => m.id !== id),
    });
  };

  const handleAddCurrency = () => {
    if (!newCurrency.trim()) return toast.error("কারেন্সি লিখুন!");
    if (form.currencies.includes(newCurrency.trim().toUpperCase()))
      return toast.error("কারেন্সি ইতিমধ্যে আছে!");
    setForm({
      ...form,
      currencies: [...form.currencies, newCurrency.trim().toUpperCase()],
    });
    setNewCurrency("");
  };

  const handleDeleteCurrency = (cur) => {
    setForm({
      ...form,
      currencies: form.currencies.filter((c) => c !== cur),
    });
  };

  const handleAddCurrency2 = () => {
    if (!newCurrency2.trim()) return toast.error("কারেন্সি লিখুন!");
    if (form.currencies2.includes(newCurrency2.trim().toUpperCase()))
      return toast.error("কারেন্সি ইতিমধ্যে আছে!");
    setForm({
      ...form,
      currencies2: [...form.currencies2, newCurrency2.trim().toUpperCase()],
    });
    setNewCurrency2("");
  };

  const handleDeleteCurrency2 = (cur) => {
    setForm({
      ...form,
      currencies2: form.currencies2.filter((c) => c !== cur),
    });
  };

  const handleAddPaymentType = () => {
    if (!newPaymentType.trim()) return toast.error("পেমেন্ট টাইপ লিখুন!");
    if (form.payment_types.includes(newPaymentType.trim()))
      return toast.error("পেমেন্ট টাইপ ইতিমধ্যে আছে!");
    setForm({
      ...form,
      payment_types: [...form.payment_types, newPaymentType.trim()],
    });
    setNewPaymentType("");
  };

  const handleDeletePaymentType = (pt) => {
    setForm({
      ...form,
      payment_types: form.payment_types.filter((p) => p !== pt),
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/deposit/settings`, form);
      toast.success("সেটিংস সেভ সফল!");
      setEditMode(false);
    } catch (err) {
      toast.error("সেভ ব্যর্থ!");
    }
  };

  // ইমেজ আপলোড
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("কোনো ফাইল সিলেক্ট করা হয়নি!");
      return;
    }

    // ফাইল সাইজ চেক (৫ এমবি সীমা)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ফাইলের সাইজ ৫ এমবি এর বেশি হতে পারবে না!");
      return;
    }

    // ফাইল টাইপ চেক
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("শুধুমাত্র JPEG, PNG, বা GIF ফাইল আপলোড করা যাবে!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload/payment-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setNewMethod({ ...newMethod, image: res.data.imageUrl });
      toast.success("ইমেজ আপলোড সফল!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(err.response?.data?.message || "ইমেজ আপলোড ব্যর্থ!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto bg-gray-800 text-white p-6 rounded-xl shadow-xl border border-gray-700">
        {/* হেডার */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-red-400">Deposit Setting</h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-red-500 text-white font-bold py-1.5 px-4 rounded-lg hover:bg-yellow-600 transition"
            >
              Save Edit
            </button>
          )}
        </div>

        {/* কারেন্সি রেট এবং অ্যামাউন্ট */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Currency Rate</label>
            <input
              type="number"
              disabled={!editMode}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.pbu_rate}
              onChange={(e) => setForm({ ...form, pbu_rate: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Second Currency Rate</label>
            <input
              type="number"
              disabled={!editMode}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.pbu_rate2}
              onChange={(e) => setForm({ ...form, pbu_rate2: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Amount</label>
            <input
              type="number"
              disabled={!editMode}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.min_amount}
              onChange={(e) => setForm({ ...form, min_amount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Amount</label>
            <input
              type="number"
              disabled={!editMode}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.max_amount}
              onChange={(e) => setForm({ ...form, max_amount: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* পেমেন্ট টাইপ */}
        <div className="border-t border-gray-600 pt-4 mb-6">
          <h2 className="text-lg font-semibold text-red-400 mb-3">Payment Type</h2>
          {editMode && (
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Add a New Payment Type"
                className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newPaymentType}
                onChange={(e) => setNewPaymentType(e.target.value)}
              />
              <button
                onClick={handleAddPaymentType}
                className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {form.payment_types.map((pt, i) => (
              <div
                key={i}
                className="bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2"
              >
                <span>{pt}</span>
                {editMode && (
                  <button
                    onClick={() => handleDeletePaymentType(pt)}
                    className="text-red-400 text-xs hover:text-red-500"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* প্রথম কারেন্সি */}
        <div className="border-t border-gray-600 pt-4 mb-6">
          <h2 className="text-lg font-semibold text-red-400 mb-3">First Currency</h2>
          {editMode && (
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Add a New Currency (PBU, BDT)"
                className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
              />
              <button
                onClick={handleAddCurrency}
                className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {form.currencies.map((cur, i) => (
              <div
                key={i}
                className="bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2"
              >
                <span>{cur}</span>
                {editMode && (
                  <button
                    onClick={() => handleDeleteCurrency(cur)}
                    className="text-red-400 text-xs hover:text-red-500"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* দ্বিতীয় কারেন্সি */}
        <div className="border-t border-gray-600 pt-4 mb-6">
          <h2 className="text-lg font-semibold text-red-400 mb-3">Second Currency</h2>
          {editMode && (
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Add a New Currency (PBU, BDT)"
                className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newCurrency2}
                onChange={(e) => setNewCurrency2(e.target.value)}
              />
              <button
                onClick={handleAddCurrency2}
                className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {form.currencies2.map((cur, i) => (
              <div
                key={i}
                className="bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2"
              >
                <span>{cur}</span>
                {editMode && (
                  <button
                    onClick={() => handleDeleteCurrency2(cur)}
                    className="text-red-400 text-xs hover:text-red-500"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* পেমেন্ট মেথড */}
        <div className="border-t border-gray-600 pt-4 mb-4">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Payment Methods</h2>
          {editMode && (
            <div className="flex flex-col md:flex-row gap-2 mb-3">
              <input
                placeholder="Method name"
                className="flex-1 p-2 rounded bg-gray-700"
                value={newMethod.name}
                onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <button
                onClick={handleAddMethod}
                className="bg-red-500 text-white px-3 rounded font-semibold"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-3">
            {form.payment_methods.map((m) => (
              <div
                key={m.id}
                className="bg-gray-700 p-3 rounded-lg flex flex-col items-center w-28"
              >
                <img src={`${import.meta.env.VITE_API_URL}${m.image}`} className="w-10 h-10 object-contain mb-1" alt={m.name} />
                <p className="text-sm">{m.name}</p>
                {editMode && (
                  <button
                    onClick={() => handleDeleteMethod(m.id)}
                    className="text-red-400 text-xs mt-1"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositSetting1;
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const AccountSummary = () => {
  const { motherAdmin, balance, setBalance } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // লোডিং স্টেট

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ইনপুট ভ্যালিডেশন
    if (!amount || amount <= 0) {
      setError("দয়া করে একটি বৈধ পরিমাণ লিখুন");
      return;
    }

    if (!motherAdmin?._id) {
      setError("অ্যাডমিন তথ্য পাওয়া যায়নি। দয়া করে আবার লগইন করুন।");
      return;
    }

    setLoading(true); // লোডিং শুরু
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/add-balance`,
        {
          adminId: motherAdmin._id,
          amount: parseFloat(amount),
          role: motherAdmin.role,
        }
      );

      setBalance(response.data.updatedBalance);
      setSuccess("ব্যালেন্স সফলভাবে যোগ হয়েছে!");
      setAmount("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "ব্যালেন্স যোগ করতে সমস্যা হয়েছে।";
      setError(errorMessage);
      console.error("Axios Error:", err.response?.data);
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  return (
    <div className="border border-gray-100 p-5 bg-white mx-auto">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
            WL
          </div>
          <h1 className="text-lg font-semibold">
            {motherAdmin?.username || "Loading..."}
          </h1>
        </div>
        {motherAdmin.role === "MA" && (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-yellow-500 mb-4 text-center">
              Mother Admin Balance Add
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 mb-4 bg-[#1e2f3d] rounded-xl shadow-lg p-2"
            >
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 px-3 py-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-300"
                disabled={loading}
              />
              <button
                type="submit"
                className="px-4 cursor-pointer py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add +"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ব্যালেন্স সেকশন */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-[#2d4858] text-white text-sm font-semibold p-2">
          Your Balances
        </div>
        <div className="bg-white text-black font-semibold p-3">
          {balance} PBU
        </div>
      </div>

      {/* এরর বা সাকসেস মেসেজ */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default AccountSummary;

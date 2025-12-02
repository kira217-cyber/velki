import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { toast } from 'react-toastify';

const DepositForm = () => {
  const [transactionId, setTransactionId] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // payment method ID
  const { state: locationState } = useLocation(); // renamed to avoid confusion
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [paymentSettings, setPaymentSettings] = useState(null);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      if (!id) {
        setError("পেমেন্ট মেথড আইডি পাওয়া যায়নি!");

        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/deposit/payment-method/${id}`);
        console.log("API Response for payment settings:", res.data); // ডিবাগিং
        setPaymentSettings(res.data);
      } catch (err) {
        console.error("Error fetching payment settings:", err);
        const errorMessage = err.response?.data?.message || "পেমেন্ট সেটিংস লোড করতে ব্যর্থ!";
        setError(errorMessage);

      } finally {
        setLoading(false);
      }
    };
    fetchPaymentSettings();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {

      return;
    }

    // Safely parse amount and other values from location.state
    const amount = parseFloat(locationState?.amount) || 0;
    const pbuAmount = parseFloat(locationState?.pbuAmount) || (amount / 100); // 1 PBU = 100 BDT
    const totalPBU = parseFloat(locationState?.totalPBU) || pbuAmount;
    const paymentType = locationState?.paymentType || "unknown";
    const selectedMethod = locationState?.selectedMethod || "unknown";

    if (!locationState || isNaN(amount) || amount <= 0) {

      return;
    }

    if (!transactionId || !number) {

      return;
    }

    console.log("Submitting:", { userId, transactionId, number, paymentType, amount, pbuAmount, totalPBU }); // ডিবাগিং

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/deposit/request`, {
        userId,
        transactionId,
        number,
        selectedMethod,
        paymentType,
        amount,
        currency: "BDT",
        pbuAmount,
        totalPBU,
      });
      setTransactionId("");
      setNumber("");
      navigate("/"); // হোম পেজে নেভিগেট
      toast.success("Deposit Request Send successful");
    } catch (err) {
      console.error("Error submitting transaction:", err.response?.data || err.message);

    }
  };

  const copyToClipboard = () => {
    if (paymentSettings?.transactionNumber) {
      navigator.clipboard.writeText(paymentSettings.transactionNumber);

    } else {

    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!paymentSettings) {
    return <div className="text-center mt-10 text-white">No Data</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: paymentSettings.bgColor || "#f7f8fc" }}
    >
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-6">
          <img
            src={paymentSettings.logo ? `${import.meta.env.VITE_API_URL}${paymentSettings.logo}` : "/placeholder.png"}
            alt={`${id} Logo`}
            className="w-32 mb-2"
          />
          <p className="text-gray-600 text-sm">{paymentSettings.companyName}</p>
        </div>

        {/* Transaction Info */}
        <div className="flex justify-between items-center bg-[#f9fafb] rounded-xl border border-gray-200 mx-5 mt-6 px-4 py-3">
          <div>
            <p className="text-sm text-gray-600">লেনদেন নম্বর:</p>
            <p className="text-xs text-gray-800 mt-1 font-mono">
              {paymentSettings.transactionId || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: paymentSettings.formBgColor || "#e2136e" }}>
              ৳ {locationState?.amount?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div
            className="mt-6 px-4 py-5 rounded-xl text-white space-y-5"
            style={{ backgroundColor: paymentSettings.formBgColor || "#e2136e" }}
          >
            {/* Transaction ID */}
            <div>
              <label className="block font-semibold mb-2 text-center text-sm">
                {paymentSettings.transactionIdLabel || "ট্রানজেকশন আইডি দিন"}
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="ট্রানজেকশন আইডি দিন"
                className="w-full p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                required
              />
              <p className="text-xs mt-1 text-pink-100">
                {paymentSettings.transactionIdHint || "দয়া করে আপনার ট্রানজেকশন আইডি দিন"}
              </p>
            </div>

            {/* Number */}
            <div>
              <label className="block font-semibold mb-2 text-center text-sm">
                {paymentSettings.numberLabel || "লেনদেন নম্বর লিখুন"}
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                required
              />
              <p className="text-xs mt-1 text-pink-100">
                {paymentSettings.numberHint || "দয়া করে আপনার লেনদেন নম্বর দিন"}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              {paymentSettings.instructions && paymentSettings.instructions.length > 0 ? (
                paymentSettings.instructions.map((instruction, index) => (
                  <div key={index} className="text-white">
                    <ul className="list-disc pl-4">
                      <li className="text-[13px] border-b border-pink-800 pb-2 font-bold">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">{instruction.text}</div>
                          {instruction.isNumber && (
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="bg-white px-2 py-1 rounded font-bold whitespace-nowrap"
                                style={{ color: paymentSettings.formBgColor || "#e2136e" }}
                              >
                                {paymentSettings.transactionNumber || "N/A"}
                              </span>
                              <button
                                type="button"
                                onClick={copyToClipboard}
                                className="bg-yellow-300 text-pink-700 flex items-center gap-1 px-2 py-1 rounded font-semibold hover:bg-yellow-400 transition whitespace-nowrap"
                                title="কপি করুন"
                              >
                                <FaCopy className="text-sm" /> কপি
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-white text-sm">কোনো নির্দেশনা পাওয়া যায়নি</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 text-white font-semibold py-2 rounded-md hover:cursor-pointer transition disabled:opacity-50"
            style={{ backgroundColor: paymentSettings.formBgColor || "#e2136e" }}
          >
            {loading ? "সাবমিট হচ্ছে..." : paymentSettings.submitButtonText || "যাচাই করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositForm;
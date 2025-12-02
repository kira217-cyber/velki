import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DepositRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/deposit/requests/pending`);
      console.log("Pending Requests Response:", res.data); // Debugging
      setRequests(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "পেন্ডিং রিকোয়েস্ট লোড ব্যর্থ!";
      console.error("Fetch Pending Error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/deposit/request/${id}/approve`);
      toast.success("Approval successful! PBU added.");
      fetchPending();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Approval failed!";
      toast.error(errorMessage);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/deposit/request/${id}/cancel`);
      toast.success("Cancel successful!");
      fetchPending();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Cancel failed!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className=" bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full mx-auto bg-gray-800 text-white p-6 rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold text-red-400 mb-6 text-center">
          Pending Deposit Request
        </h1>
        {loading ? (
          <div className="text-center p-4 text-gray-300 animate-pulse">Loading...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-300">No pending requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Payment Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Transaction Id</th>
                  <th className="p-3 text-left">Number</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                    <td className="p-3">
                      {req.userId ? `${req.userId.firstName} ${req.userId.lastName}` : "অজানা"}
                    </td>
                    <td className="p-3">{req.paymentType}</td>
                    <td className="p-3">৳ {req.amount.toLocaleString()}</td>
                    <td className="p-3">{req.transactionId}</td>
                    <td className="p-3">{req.number}</td>
                    <td className="p-3">
                      {new Date(req.createdAt).toLocaleDateString("en-EN", {
                        timeZone: "Asia/Dhaka",
                      })}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-600 transition"
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(req._id)}
                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositRequest;
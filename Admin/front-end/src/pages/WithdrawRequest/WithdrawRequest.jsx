import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WithdrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/withdraw/requests/pending`);
      setRequests(res.data);
    } catch (err) {
      toast.error("Pending Request Load Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/withdraw/request/${id}/approve`);
      toast.success("Approve Successfully!");
      fetchPending();
    } catch (err) {
      toast.error("Approve Failed!");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/withdraw/request/${id}/cancel`);
      toast.success("Cancel SuccessfullY!");
      fetchPending();
    } catch (err) {
      toast.error("Cancel Failed!");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pending Withdraw Request</h1>
      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No Pending Request</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Payment Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">PBU</th>
              <th className="border p-2">Number</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="border p-2">{req.userId?.username || "unknown"}</td>
                <td className="border p-2">{req.methodId}</td>
                <td className="border p-2">{req.paymentType}</td>
                <td className="border p-2">৳ {req.amount.toLocaleString()}</td>
                <td className="border p-2">{req.pbuAmount.toFixed(2)}</td>
                <td className="border p-2">{req.number}</td>
                <td className="border p-2">
                  <button onClick={() => handleApprove(req._id)} className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded-md mr-2">Approve</button>
                  <button onClick={() => handleCancel(req._id)} className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-md">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WithdrawRequest;
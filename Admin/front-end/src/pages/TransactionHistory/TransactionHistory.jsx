import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminWithdrawHistory from "../WithdrawalHistory/WithdrawalHistory";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/deposit/history`
      );
      setHistory(res.data);
    } catch (err) {
      toast.error("History Load Failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <>
      {/* <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          All Deposit History
        </h1>

        {history.length === 0 ? (
          <p className="text-center text-gray-600">No Deposit History</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">User</th>
                  <th className="border p-2">Payment Type</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">PBU</th>
                  <th className="border p-2">Total PBU</th>
                  <th className="border p-2">Transaction Id</th>
                  <th className="border p-2">Number</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">
                      {item.userId?.username || "Unknown"}
                    </td>
                    <td className="border p-2">{item.paymentType}</td>
                    <td className="border p-2">
                      ৳ {item.amount?.toLocaleString("en-EN")}
                    </td>
                    <td className="border p-2">{item.pbuAmount?.toFixed(2)}</td>
                    <td className="border p-2">{item.totalPBU?.toFixed(2)}</td>
                    <td className="border p-2">{item.transactionId}</td>
                    <td className="border p-2">{item.number}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : item.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {item.status === "approved"
                          ? "Approved"
                          : item.status === "cancelled"
                          ? "Cancel"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="border p-2">
                      {new Date(item.createdAt).toLocaleDateString("en-EN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}

      <div className="mt-5">
        <AdminWithdrawHistory></AdminWithdrawHistory>
      </div>
    </>
  );
};

export default TransactionHistory;

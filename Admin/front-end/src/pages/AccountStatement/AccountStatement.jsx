import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Adjust path if needed

const AccountStatement = () => {
  const { motherAdmin } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [totals, setTotals] = useState({
    totalDepositUpline: "0.00",
    totalDepositDownline: "0.00",
    totalWithdrawUpline: "0.00",
    totalWithdrawDownline: "0.00",
  });

  useEffect(() => {
    if (motherAdmin?._id) {
      fetchTransactions();
    }
  }, [currentPage, limit, fromDate, toDate, motherAdmin]);

  const fetchTransactions = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/admins/transaction-history/${motherAdmin._id}?page=${currentPage}&limit=${limit}`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      const response = await axios.get(url);
      setTransactions(response.data.data);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setTotals(response.data.totals);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleJustForToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    setCurrentPage(1);
  };

  const handleFromYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    setFromDate(yesterday.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
    setCurrentPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Function to add thousand separators (optional, if you want commas like 50,000.00)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white border rounded-md shadow p-4 m-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2 px-2 py-1 border rounded-lg border-gray-400 items-center">
            <span className="bg-black text-white font-bold px-2 py-1 rounded text-sm">
              WL {/* Or use motherAdmin.role if available */}
            </span>
            <h2 className="font-semibold text-sm">{motherAdmin?.username || "User"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Last:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10 Txn</option>
              <option value={25}>25 Txn</option>
              <option value={50}>50 Txn</option>
            </select>
          </div>
        </div>
        <span className="text-gray-700 font-medium">Total Count: {totalCount}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className="bg-yellow-100 cursor-pointer hover:bg-yellow-200 border border-gray-300 px-3 py-1 rounded text-sm"
          onClick={handleJustForToday}
        >
          Just For Today
        </button>
        <button
          className="bg-yellow-100 cursor-pointer hover:bg-yellow-200 border border-gray-300 px-3 py-1 rounded text-sm"
          onClick={handleFromYesterday}
        >
          From Yesterday
        </button>
        <button className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm">
          Get P & L {/* Implement if needed */}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-700 text-white border-b">
            <tr>
              <th className="p-2 border">Date/Time</th>
              <th className="p-2 border">Deposit by Upline</th>
              <th className="p-2 border">Deposit to Downline</th>
              <th className="p-2 border">Withdraw by Upline</th>
              <th className="p-2 border">Withdraw from Downline</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Remark</th>
              <th className="p-2 border">From/To</th>
              <th className="p-2 border">IPAddress</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, i) => (
              <tr key={i} className="border-b text-sm hover:bg-gray-50">
                <td className="p-2 border">{item.datetime}</td>
                <td className="p-2 border text-right">{item.depositUpline === "-" ? "-" : formatNumber(item.depositUpline)}</td>
                <td className="p-2 border text-right">{item.depositDownline === "-" ? "-" : formatNumber(item.depositDownline)}</td>
                <td className="p-2 border text-right">{item.withdrawUpline === "-" ? "-" : formatNumber(item.withdrawUpline)}</td>
                <td className="p-2 border text-right">
                  {item.withdrawDownline === "-" ? "-" : formatNumber(item.withdrawDownline)}
                </td>
                <td className="p-2 border text-right">{formatNumber(item.balance)}</td>
                <td className="p-2 border">{item.remark}</td>
                <td className="p-2 border">{item.fromto}</td>
                <td className="p-2 border">{item.ip}</td>
              </tr>
            ))}
          </tbody>
          {/* Total Row */}
          <tfoot>
            <tr className="bg-[#FFEDD5] font-semibold">
              <td className="p-2 border">Total</td>
              <td className="p-2 border text-right">{formatNumber(totals.totalDepositUpline)}</td>
              <td className="p-2 border text-right">{formatNumber(totals.totalDepositDownline)}</td>
              <td className="p-2 border text-right">{formatNumber(totals.totalWithdrawUpline)}</td>
              <td className="p-2 border text-right">{formatNumber(totals.totalWithdrawDownline)}</td>
              <td className="p-2 border"></td>
              <td className="p-2 border"></td>
              <td className="p-2 border"></td>
              <td className="p-2 border"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-3">
        <button
          className="border px-3 py-1 rounded hover:bg-gray-100"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`border px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-100" : "hover:bg-gray-100"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="border px-3 py-1 rounded hover:bg-gray-100"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountStatement;
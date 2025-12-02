import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbReload } from "react-icons/tb";

const Banking = () => {
  const { motherAdmin } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [selectedAdminsD, setSelectedAdminsD] = useState([]); // For Deposit (D)
  const [selectedAdminsW, setSelectedAdminsW] = useState([]); // For Withdraw (W)
  const [amountsD, setAmountsD] = useState({}); // Separate amounts for Deposit
  const [amountsW, setAmountsW] = useState({}); // Separate amounts for Withdraw
  const [myBalance, setMyBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [historyTotals, setHistoryTotals] = useState({
    totalDepositUpline: "0.00",
    totalDepositDownline: "0.00",
    totalWithdrawUpline: "0.00",
    totalWithdrawDownline: "0.00",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchCreatedAdmins();
    fetchMyBalance();
  }, []);

  // Fetch own created admins
  const fetchCreatedAdmins = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admins/created/${motherAdmin._id}`
      );
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching created admins:", error);
      setMessage("Failed to load admins");
    }
  };

  // Fetch my balance
  const fetchMyBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admins/${motherAdmin._id}`
      );
      setMyBalance(response.data.balance || 0); // Use balance instead of availBal
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch transaction history for selected admin
  const fetchAdminTransactions = async (adminId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admins/transaction-history/${adminId}`
      );
      setSelectedTransactions(response.data.data);
      setHistoryTotals(response.data.totals);
    } catch (error) {
      console.error("Error fetching admin transactions:", error);
      toast.error("Failed to fetch transaction history");
    }
  };

  // Handle Deposit/Withdraw
  const handleTransaction = async (type) => {
    const selectedAdmins = type === "D" ? selectedAdminsD : selectedAdminsW;
    const amounts = type === "D" ? amountsD : amountsW;
    const amountKey = selectedAdmins.length > 0 ? selectedAdmins[0] : null;

    if (
      !selectedAdmins.length ||
      !amounts[amountKey] ||
      parseFloat(amounts[amountKey]) <= 0
    ) {
      setMessage(
        `Please select at least one admin and enter a valid amount for ${type}`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/transaction`,
        {
          fromAdminId: motherAdmin._id,
          toAdminIds: selectedAdmins,
          amount: parseFloat(amounts[amountKey]),
          type: type,
        }
      );

      // Update only the selected admins and my balance
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          selectedAdmins.includes(admin._id)
            ? {
                ...admin,
                balance:
                  response.data.toAdminBalances[admin._id] || admin.balance,
              }
            : admin
        )
      );
      setMyBalance(response.data.fromAdminBalance);

      // Show success toast
      if (type === "D") {
        toast.success(
          `Successfully deposited ${amounts[amountKey]} to ${selectedAdmins.length} admin(s)!`
        );
        handleRefresh();
        setAmountsD((prev) => {
          const newAmounts = { ...prev };
          selectedAdmins.forEach((adminId) => (newAmounts[adminId] = ""));
          return newAmounts;
        });
        setSelectedAdminsD([]);
      } else {
        toast.success(
          `Successfully withdrew ${amounts[amountKey]} from ${selectedAdmins.length} admin(s)!`
        );
        handleRefresh();
        setAmountsW((prev) => {
          const newAmounts = { ...prev };
          selectedAdmins.forEach((adminId) => (newAmounts[adminId] = ""));
          return newAmounts;
        });
        setSelectedAdminsW([]);
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Transaction failed");
    }
    setLoading(false);
  };

  // Handle input change for Deposit
  const handleAmountChangeD = (adminId, value) => {
    setAmountsD((prev) => ({ ...prev, [adminId]: value }));
  };

  // Handle input change for Withdraw
  const handleAmountChangeW = (adminId, value) => {
    setAmountsW((prev) => ({ ...prev, [adminId]: value }));
  };

  // Toggle admin selection for Deposit (D)
  const toggleAdminSelectionD = (adminId) => {
    setSelectedAdminsD((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
    setSelectedAdminsW(selectedAdminsW.filter((id) => id !== adminId)); // Clear W if D selected
  };

  // Toggle admin selection for Withdraw (W)
  const toggleAdminSelectionW = (adminId) => {
    setSelectedAdminsW((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
    setSelectedAdminsD(selectedAdminsD.filter((id) => id !== adminId)); // Clear D if W selected
  };

  // Refresh page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Filter admins
  const filteredAdmins = admins.filter((admin) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalBalance = filteredAdmins.reduce(
    (sum, admin) => sum + (admin.balance || 0),
    0
  );
  const totalExposure = filteredAdmins.reduce(
    (sum, admin) => sum + (admin.exposure || 0),
    0
  );
  const totalCreditReference = filteredAdmins.reduce(
    (sum, admin) => sum + (admin.credit || 0),
    0
  );
  const totalRefPL = filteredAdmins.reduce(
    (sum, admin) => sum + (admin.refPL || 0),
    0
  );

  // Function to add thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 bg-white">
      {/* Top Search Bar */}
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter userid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded text-sm w-40"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded text-sm"
          >
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
          <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">
            Search
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-green-600 font-bold">Status: ACTIVE</span>
          <button
            className="ml-2 cursor-pointer text-blue-500 "
            onClick={handleRefresh}
          >
            <TbReload size={20} />
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-gray-100 p-3 mb-4 rounded border">
        <span className="font-bold text-lg">
          Your Balances | PBU : {myBalance.toFixed(2)}
        </span>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-[#2d3748] text-white">
              <th className="border border-gray-300 p-2">UID</th>
              <th className="border border-gray-300 p-2">Balance</th>
              <th className="border border-gray-300 p-2">Exposure</th>
              <th className="border border-gray-300 p-2">Deposit</th>
              <th className="border border-gray-300 p-2">Withdraw</th>
              <th className="border border-gray-300 p-2">Credit Reference</th>
              <th className="border border-gray-300 p-2">Reference P/L</th>
              <th className="border border-gray-300 p-2">Remark</th>
              <th className="border border-gray-300 p-2">All Log</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr
                key={admin._id}
                className={`border-b border-gray-300 ${
                  selectedAdminsD.includes(admin._id) ||
                  selectedAdminsW.includes(admin._id)
                    ? "bg-green-50"
                    : ""
                } ${
                  filteredAdmins.indexOf(admin) % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <td className="border border-gray-300 p-2">
                  <span
                    className={`
                        font-bold text-xs px-2 py-1 rounded-[4px] cursor-pointer transition
                        ${
                          admin.role === "MA"
                            ? "bg-purple-200 text-purple-800 hover:bg-purple-300"
                            : admin.role === "SA"
                            ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
                            : admin.role === "MT"
                            ? "bg-green-200 text-green-800 hover:bg-green-300"
                            : admin.role === "AG"
                            ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                            : admin.role === "SG"
                            ? "bg-pink-200 text-pink-800 hover:bg-pink-300"
                            : admin.role === "US"
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        }
                      `}
                  >
                    {admin.role}
                  </span>{" "}
                  <span className="ml-2">{admin.username}</span>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {admin.balance.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">
                  {admin.exposure.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        selectedAdminsD.includes(admin._id)
                          ? "bg-green-600 text-white border"
                          : "bg-white text-black border"
                      }`}
                      onClick={() => {
                        toggleAdminSelectionD(admin._id);
                      }}
                    >
                      D
                    </button>
                    <input
                      type="number"
                      value={amountsD[admin._id] || ""}
                      onChange={(e) =>
                        handleAmountChangeD(admin._id, e.target.value)
                      }
                      className={`border rounded px-2 py-1 w-16 text-center ${
                        selectedAdminsD.includes(admin._id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-100"
                      }`}
                      placeholder="0.00"
                      disabled={!selectedAdminsD.includes(admin._id)}
                      step="0.01"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        selectedAdminsW.includes(admin._id)
                          ? "bg-red-600 text-white border"
                          : "bg-white text-black border"
                      }`}
                      onClick={() => {
                        toggleAdminSelectionW(admin._id);
                      }}
                    >
                      W
                    </button>
                    <input
                      type="number"
                      value={amountsW[admin._id] || ""}
                      onChange={(e) =>
                        handleAmountChangeW(admin._id, e.target.value)
                      }
                      className={`border rounded px-2 py-1 w-16 text-center ${
                        selectedAdminsW.includes(admin._id)
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-100"
                      }`}
                      placeholder="0.00"
                      disabled={!selectedAdminsW.includes(admin._id)}
                      step="0.01"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {admin.credit.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">
                  ({admin.refPL.toFixed(2)})
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  Remark
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button 
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      fetchAdminTransactions(admin._id);
                      setShowModal(true);
                    }}
                  >
                    Log
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-yellow-100 font-bold">
              <td className="border border-gray-300 p-2">Total</td>
              <td className="border border-gray-300 p-2 text-center">
                {totalBalance.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2 text-center text-red-600">
                {totalExposure.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-center">
                {totalCreditReference.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2 text-center text-red-600">
                ({totalRefPL.toFixed(2)})
              </td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between items-center mt-4 p-3 bg-gray-50 rounded">
        <div className="flex gap-2">
          <button className="bg-gray-300 px-3 py-1 rounded text-sm">
            Prev 1
          </button>
          <button className="bg-gray-300 px-3 py-1 rounded text-sm">
            Next 1
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
            GO
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 cursor-pointer rounded text-sm font-bold ${
              loading ||
              !selectedAdminsD.length ||
              !amountsD[selectedAdminsD[0]]
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white"
            }`}
            onClick={() => {
              handleTransaction("D");
              handleRefresh();
            }}
            disabled={
              loading ||
              !selectedAdminsD.length ||
              !amountsD[selectedAdminsD[0]]
            }
          >
            {loading ? "Processing..." : "Submit Deposit"}
          </button>
          <button
            className={`px-4 py-1 cursor-pointer rounded text-sm font-bold ${
              loading ||
              !selectedAdminsW.length ||
              !amountsW[selectedAdminsW[0]]
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white"
            }`}
            onClick={() => {
              handleTransaction("W");
              handleRefresh();
            }}
            disabled={
              loading ||
              !selectedAdminsW.length ||
              !amountsW[selectedAdminsW[0]]
            }
          >
            {loading ? "Processing..." : "Submit Withdraw"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-3 p-3 rounded text-center font-bold">
          <span
            className={
              message.includes("success") ? "text-green-600" : "text-red-600"
            }
          >
            {message}
          </span>
        </div>
      )}

      {/* Modal for Transaction History */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Transaction History for {selectedAdmin?.username}</h2>
              <button 
                className="text-red-500 font-bold"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
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
                  {selectedTransactions.map((item, i) => (
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
                <tfoot>
                  <tr className="bg-[#FFEDD5] font-semibold">
                    <td className="p-2 border">Total</td>
                    <td className="p-2 border text-right">{formatNumber(historyTotals.totalDepositUpline)}</td>
                    <td className="p-2 border text-right">{formatNumber(historyTotals.totalDepositDownline)}</td>
                    <td className="p-2 border text-right">{formatNumber(historyTotals.totalWithdrawUpline)}</td>
                    <td className="p-2 border text-right">{formatNumber(historyTotals.totalWithdrawDownline)}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banking;
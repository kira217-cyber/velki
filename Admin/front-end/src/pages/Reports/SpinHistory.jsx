import React, { useState } from "react";

const SpinHistory = () => {
  const [last, setLast] = useState("10 Txn");
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("2025-10-17");
  const [fromTime, setFromTime] = useState("00:00:00");
  const [toDate, setToDate] = useState("2025-10-18");
  const [toTime, setToTime] = useState("23:59:59");

  const tableData = [
    { user: "Aziz846", time: "2025-10-17 14:20:34", amount: 2 },
    { user: "bd3041", time: "2025-10-17 18:59:25", amount: 5 },
    { user: "Arif186", time: "2025-10-17 19:27:33", amount: 3 },
    { user: "Joypothik49", time: "2025-10-18 17:10:55", amount: 2 },
  ];

  const totalAmount = tableData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div className="p-6 bg-gray-100 flex justify-center items-start">
        <div className="w-[95%] bg-white border border-gray-300 rounded-md shadow-sm">
          {/* === Header Filter Section === */}
          <div className="flex justify-between items-start bg-gray-50 border-b border-gray-200 px-4 py-4">
            {/* Left Side Filters */}
            <div className="flex items-center gap-2">
              {/* Last Dropdown */}
              <label className="font-semibold text-gray-700">Last:</label>
              <select
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
              >
                <option>10 Txn</option>
                <option>20 Txn</option>
                <option>50 Txn</option>
                <option>100 Txn</option>
              </select>

              {/* Search Username */}
              <input
                type="text"
                placeholder="Search Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-40 focus:outline-none"
              />
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition">
                <i className="fa-solid fa-filter mr-1"></i>Search
              </button>

              {/* Period */}
              <label className="font-semibold text-gray-700 ml-2">Period</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="font-semibold text-gray-600">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition">
                Submit
              </button>
            </div>

            {/* Right Side Totals */}
            <div className="text-sm font-semibold text-gray-700 mt-1">
              Total Records: <span>{tableData.length}</span>{" "}
              <span className="ml-4">Total Amount: {totalAmount}</span>
            </div>
          </div>

          {/* === Table Section === */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1f3349] text-white text-sm">
                  <th className="border border-gray-300 px-4 py-2 text-left w-1/3">
                    User Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left w-1/3">
                    Time
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left w-1/3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {row.user}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {row.time}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-2xl text-center mt-5">Please Include a Api !!</div>
    </div>
  );
};

export default SpinHistory;

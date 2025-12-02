import React, { useState } from "react";

const ProfitLossReportByDownLine = () => {
  const [lastTxn, setLastTxn] = useState("10 Txn");
  const [fromDate, setFromDate] = useState("2025-10-17");
  const [fromTime, setFromTime] = useState("09:00:00");
  const [toDate, setToDate] = useState("2025-10-18");
  const [toTime, setToTime] = useState("08:59:59");

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-start">
      <div className="w-[90%] bg-white border border-gray-300 rounded-md shadow-sm">
        {/* Header Section */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Last:</label>
            <select
              value={lastTxn}
              onChange={(e) => setLastTxn(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>10 Txn</option>
              <option>20 Txn</option>
              <option>50 Txn</option>
              <option>100 Txn</option>
            </select>
          </div>

          <span className="text-sm font-medium text-gray-700">
            Total Records : <span className="font-semibold">0</span>
          </span>
        </div>

        {/* Filter Section */}
        <div className="px-4 py-5 bg-gray-50">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700 mr-2">Period</label>

            {/* From Date */}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />

            {/* From Time */}
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <span className="font-semibold text-gray-600">to</span>

            {/* To Date */}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />

            {/* To Time */}
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />

            {/* Buttons */}
            <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 text-sm rounded hover:bg-yellow-100 transition">
              Just For Today
            </button>
            <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 text-sm rounded hover:bg-yellow-100 transition">
              From Yesterday
            </button>
            <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 text-sm rounded hover:bg-yellow-100 transition">
              Weekly
            </button>
            <button className="bg-yellow-600 text-white px-3 py-1 text-sm rounded hover:bg-yellow-700 transition">
              Get P & L
            </button>
          </div>
          <div className="text-2xl text-center mt-5">
            Please Include a Api !!
          </div>

          {/* Bottom Border */}
          <div className="mt-3 border-b border-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReportByDownLine;

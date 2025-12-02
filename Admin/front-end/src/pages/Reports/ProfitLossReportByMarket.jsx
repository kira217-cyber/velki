import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const ProfitLossReportByMarket = () => {
  return (
    <div className="bg-[#f8f8f8] min-h-screen p-4">
      <div className="bg-white border border-gray-300 rounded-md p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sports</label>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>All</option>
              <option>Cricket</option>
              <option>Football</option>
            </select>

            <label className="font-semibold ml-4">Last:</label>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>10 Txn</option>
              <option>20 Txn</option>
              <option>50 Txn</option>
            </select>

            <button className="bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 ml-4">
              <FiSliders size={14} /> Search Market
            </button>
            <button className="bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1">
              <FiSearch size={14} /> Search Event
            </button>
          </div>

          <p className="font-semibold text-sm text-gray-700">
            Total Records : 444
          </p>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 mb-4">
          <label className="font-semibold">Period</label>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1"
            defaultValue="2025-10-17"
          />
          <input
            type="time"
            className="border border-gray-300 rounded px-2 py-1"
            defaultValue="09:00:00"
          />
          <span className="mx-1">to</span>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1"
            defaultValue="2025-10-18"
          />
          <input
            type="time"
            className="border border-gray-300 rounded px-2 py-1"
            defaultValue="08:59:59"
          />

          <button className="bg-gray-200 border border-gray-300 rounded px-3 py-1 ml-2">
            Just For Today
          </button>
          <button className="bg-gray-200 border border-gray-300 rounded px-3 py-1">
            From Yesterday
          </button>
          <button className="bg-yellow-600 text-white px-3 py-1 rounded">
            Get P & L
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded-md">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#2c3e50] text-white">
              <tr>
                <th className="text-left px-4 py-2">Event</th>
                <th className="text-left px-4 py-2">Market Name</th>
                <th className="text-right px-4 py-2">Stake</th>
                <th className="text-right px-4 py-2">Player P/L</th>
                <th className="text-right px-4 py-2">Downline P/L</th>
                <th className="text-right px-4 py-2">Super Comm.</th>
                <th className="text-right px-4 py-2">Upline P/L</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {[
                {
                  event: "Trinbago Knight Riders SRL T20 v St Lucia Kings SRL T20",
                  market: "WINNER (INCL. SUPER OVER)",
                  stake: "21.00",
                  player: "-21.00",
                  downline: "-21.00",
                },
                {
                  event:
                    "Lahore Qalandars SRL T20 v Islamabad United SRL T20",
                  market: "1ST INNINGS - LAHORE QALANDARS SRL TOTAL",
                  stake: "8.00",
                  player: "-8.00",
                  downline: "-8.00",
                },
                {
                  event: "Kerala v Maharashtra",
                  market: "15 OVER KER",
                  stake: "22.00",
                  player: "22.00",
                  downline: "22.00",
                },
              ].map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    <strong className="text-blue-700">Cricket</strong>{" "}
                    {item.event}
                  </td>
                  <td className="px-4 py-2 text-blue-600 underline cursor-pointer">
                    {item.market}
                  </td>
                  <td className="px-4 py-2 text-right">{item.stake}</td>
                  <td
                    className={`px-4 py-2 text-right ${
                      item.player.startsWith("-")
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {item.player}
                  </td>
                  <td
                    className={`px-4 py-2 text-right ${
                      item.downline.startsWith("-")
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {item.downline}
                  </td>
                  <td className="px-4 py-2 text-right">0.00</td>
                  <td className="px-4 py-2 text-right">0.00</td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-[#fff4e6] font-semibold border-t border-gray-300">
                <td className="px-4 py-2 text-left">Total</td>
                <td></td>
                <td className="px-4 py-2 text-right">14,359.00</td>
                <td className="px-4 py-2 text-right text-yellow-500">
                  (-1,704.48)
                </td>
                <td className="px-4 py-2 text-right text-yellow-500">
                  (-1,704.48)
                </td>
                <td className="px-4 py-2 text-right">5.07</td>
                <td className="px-4 py-2 text-right">0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-1">
          <button className="border border-gray-300 px-3 py-1 text-sm">Prev</button>
          {[1, 2, 3, 4, 5, 6, "45"].map((p, i) => (
            <button
              key={i}
              className={`border border-gray-300 px-3 py-1 text-sm ${
                p === 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="border border-gray-300 px-3 py-1 text-sm">Next</button>
        </div>
      </div>
      <div className="text-2xl text-center mt-5">
            Please Include a Api !!
          </div>
    </div>
  );
};

export default ProfitLossReportByMarket;

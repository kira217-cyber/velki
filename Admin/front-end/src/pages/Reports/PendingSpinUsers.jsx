import React from "react";

const PendingSpinUsers = () => {
  return (
    <div className="w-full bg-gray-50 p-6">
      {/* Top Filter Section */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-gray-700 font-medium">Last:</label>
        <select className="border border-gray-300 rounded px-3 py-2">
          <option>10 Txn</option>
          <option>20 Txn</option>
          <option>50 Txn</option>
        </select>

        <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Submit
        </button>

        <button className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-700">
          Search Username
          <span className="text-sm">⚙️</span>
        </button>

        <div className="ml-auto text-gray-700 font-semibold">
          Total Records : <span className="text-black">21</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-[#1f3b4d] text-white font-semibold py-2 px-4">
          <div>User Name</div>
          <div>Domain Name</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200 bg-white">
          {[
            "Sano7878",
            "Akash9430",
            "hd101",
            "Bd233",
            "Mitu994",
            "Tawfa",
            "Hhh220",
            "Rajib907",
            "Sion",
            "Bd9000",
          ].map((user, index) => (
            <div key={index} className="grid grid-cols-2 px-4 py-2 text-gray-800">
              <div>{user}</div>
              <div>velki@.live</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-4">
        <div></div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
            Prev
          </button>
          <button className="border border-gray-400 px-3 py-1 bg-gray-200 rounded">
            1
          </button>
          <button className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
            2
          </button>
          <button className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
            3
          </button>
          <button className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
            Next
          </button>
          <input
            type="text"
            className="border border-gray-400 px-2 py-1 w-12 text-center rounded"
          />
          <button className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700">
            GO
          </button>
        </div>
      
      </div>
        <div className="text-2xl text-center mt-5">
            Please Include a Api !!
          </div>
    </div>
  );
};

export default PendingSpinUsers;

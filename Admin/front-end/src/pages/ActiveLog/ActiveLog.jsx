import React, { useState } from 'react';

const ActiveLog = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const logData = [
        { id: 1, loginDate: "2025-10-14 11:23:42", loginStatus: "Login Success", ipAddress: "103.178.17.112", isp: "EarthTel", cityStateCountry: "Bogra/Rajshahi Division/Bangladesh" },
        { id: 2, loginDate: "2025-10-14 10:26:36", loginStatus: "Login Success", ipAddress: "5.30.242.75", isp: "AcdcxZVa", cityStateCountry: "Rangpur" },
        { id: 3, loginDate: "2025-10-14 09:14:58", loginStatus: "Login Failed", ipAddress: "5.30.242.75", isp: "-----", cityStateCountry: "-----" },
        { id: 4, loginDate: "2025-10-14 08:22:18", loginStatus: "Login Success", ipAddress: "5.30.242.75", isp: "-----", cityStateCountry: "-----" },
        { id: 5, loginDate: "2025-10-14 02:21:00", loginStatus: "Login Success", ipAddress: "201.168.22.24500e8e3bf5c9f2d4", isp: "-----", cityStateCountry: "-----" },
        { id: 6, loginDate: "2025-10-13 14:05:37", loginStatus: "Login Success", ipAddress: "103.178.17.112", isp: "-----", cityStateCountry: "-----" },
        { id: 7, loginDate: "2025-10-13 13:05:23", loginStatus: "Login Success", ipAddress: "103.178.17.112", isp: "-----", cityStateCountry: "-----" },
        { id: 8, loginDate: "2025-10-13 11:11:04", loginStatus: "Login Success", ipAddress: "5.30.242.75", isp: "-----", cityStateCountry: "-----" },
        { id: 9, loginDate: "2025-10-12 16:19:53", loginStatus: "Login Success", ipAddress: "5.30.242.75", isp: "-----", cityStateCountry: "-----" },
        { id: 10, loginDate: "2025-10-12 13:33:08", loginStatus: "Login Success", ipAddress: "103.178.17.112", isp: "-----", cityStateCountry: "-----" },
    ];

    const handleViewClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="p-4 border border-gray-200 bg-white rounded-md shadow m-4">
            <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="border-gray-400 items-center">
            <select className="border rounded px-2 py-1 text-sm">
              <option>Active Log</option>
           
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Last:</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option>10 Txn</option>
              <option>25 Txn</option>
              <option>50 Txn</option>
            </select>
          </div>
        </div>
        <span className="text-gray-700 font-medium">Total Count: 33</span>
        
      </div>
      <div className="flex gap-2 px-2 py-1 border rounded-lg border-gray-400 items-center w-48 mb-4">
            <span className="bg-black text-white font-bold px-2 py-1 rounded text-sm">
            WL
          </span>
          <h2 className="font-semibold text-sm">MPenjoy247</h2>
          </div>
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="p-2 text-left border">Login Date & Time</th>
                        <th className="p-2 text-left border">Login Status</th>
                        <th className="p-2 text-left border">IP Address</th>
                        <th className="p-2 text-left border">ISP</th>
                        <th className="p-2 text-left border">City/State/Country</th>
                        <th className="p-2 text-left border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logData.map((log) => (
                        <React.Fragment key={log.id}>
                            <tr className="border border-gray-200 hover:bg-gray-50">
                                <td className="p-2 border">{log.loginDate}</td>
                                <td className="p-2 border">{log.loginStatus}</td>
                                <td className="p-2 border">{log.ipAddress}</td>
                                <td className="p-2 border">{expandedRow === log.id ? log.isp : "-----"}</td>
                                <td className="p-2 border">{expandedRow === log.id ? log.cityStateCountry : "-----"}</td>
                                <td className="p-2 border">
                                    <button
                                        className="bg-yellow-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-yellow-700"
                                        onClick={() => handleViewClick(log.id)}
                                    >
                                        view
                                    </button>
                                </td>
                            </tr>
                          
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <hr className='mt-5 mb-2 border-dashed' />
            <div className="flex items-center justify-center p-2 ">
            <button className="px-2 py-1 cursor-pointer border text-black rounded-l ">Prev</button>
            <button className="px-3 py-1 cursor-pointer bg-blue-100 border text-black hover:bg-blue-200">1</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">2</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">3</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">4</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">5</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">6</button>
            <button className="px-3 py-1 cursor-pointer text-black border hover:bg-gray-100">79</button>
            <button className="px-2 py-1 cursor-pointer text-black border rounded-r hover:bg-gray-100">Next</button>
        </div>
        </div>
    );
};

export default ActiveLog;
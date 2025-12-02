import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FaSyncAlt, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Withdraw = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState(0);
  const [number, setNumber] = useState("");
  const { Balance, user } = useContext(AuthContext);
  const navigate = useNavigate()
  const userId = user._id;

  const amountOptions = [100, 500, 1000, 2000, 5000, 10000, 20000, 25000];
  const paymentOptions = [
    { id: "nagad", name: "Nagad", image: "https://i.ibb.co.com/sdgCF1HP/icon-256x256.png" },
    { id: "bkash", name: "Bkash", image: "https://i.ibb.co.com/kszjQzZn/unnamed.webp" },
    { id: "rocket", name: "Rocket", image: "https://i.ibb.co.com/S4JZ706r/dutch-bangla-rocket-logo-png-seeklogo-317692.png" },
  ];
  const paymentTypes = ["Personal", "Agent"]; // আপনার সিস্টেমের টাইপ

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return toast.error("Select A Payment Method!");
    if (!paymentType) return toast.error("Select A Payment Type!");
    if (!amount || amount <= 0) return toast.error("Type Right Amount!");
    if (!number) return toast.error("Type Number!");

    const pbuAmount = amount / 100; // 100 BDT = 1 PBU
    if (pbuAmount > Balance) return toast.error("Inadequate PBU Balance!");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/withdraw/request`, {
        userId,
        methodId: paymentMethod,
        paymentType,
        amount,
        pbuAmount,
        number,
      });
     
      setAmount(0);
      setNumber("");
      setPaymentMethod("");
      setPaymentType("");
      navigate('/');
      toast.success("Withdraw Request Send successful");
      
    } catch (err) {
        toast.error("Withdraw Request Send Failed");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white mt-14">
      {/* Payment Method */}
      <div className="p-8 border-b border-gray-700">
        <p className="font-bold mb-3 border-b border-gray-400 pb-3">
          <span className="text-yellow-400 text-2xl">|</span> Payment Method
        </p>
        <div className="flex justify-between items-center gap-2">
          {paymentOptions.map((value) => (
            <div
              className={`items-center py-2 px-5 border border-solid cursor-pointer ${paymentMethod === value.id ? "border-green-400 border-4" : ""}`}
              key={value.id}
              onClick={() => setPaymentMethod(value.id)}
            >
              <img src={value.image} alt={value.name} className="w-full h-10 rounded-4xl" />
              <p className="text-center">{value.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Type */}
      <div className="p-8 border-b border-gray-700">
        <h2 className="font-semibold mb-3 text-white text-lg">
          Select a Payment Type <span className="text-red-500">*</span>
        </h2>
        <select
          className="border rounded-lg w-full p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">-- Select a Type --</option>
          {paymentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="mb-4 p-6">
        <span className="text-green-500 text-xl">Type Your Phone Number</span>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-4 focus:outline-none"
        />
      </div>

      {/* Deposit Channel */}
      <div className="p-4 border-b border-gray-700">
        {/* Amount */}
        <div className="flex items-center justify-between border-b border-gray-400 mb-3">
          <p className="font-bold mb-2">
            <span className="text-2xl text-yellow-400">|</span> Amount
          </p>
          <p className="text-gray-400 font-bold">৳100.00 - ৳25000.00</p>
        </div>

        {/* Amount Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {amountOptions.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              className={`px-2 py-1 rounded ${amount === value ? "bg-green-500 text-black font-bold" : "bg-gray-700"}`}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">৳</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-black m-3 border border-gray-700 rounded-lg">
        <p className="p-4 font-bold">
          <span className="flex items-center gap-1"><FaInfoCircle size={20} className="text-lg mt-1" /> Reminder:</span>
          <br /> 1. Please double check the recipient's account details before proceeding. <br /> 2. DO NOT share your account with anyone to avoid losing funds or money.
        </p>
      </div>

      {/* Submit Button */}
      <div className="p-4">
        <button onClick={handleSubmit} className="w-full bg-green-500 text-white font-bold py-3 rounded">
          Submit
        </button>
      </div>

      {/* Help Section */}
      <div className="p-4">
        <div className="bg-gray-800 p-3 rounded flex justify-between items-center">
          <p>কিভাবে টাকা উইথড্র করতে হয়?</p>
          <span className="bg-green-500 px-2 py-1 rounded-full">▶</span>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
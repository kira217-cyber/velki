import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const Deposit = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  
  const [settings, setSettings] = useState({
    currencies: ["PBU"],
    currencies2: ["BDT"],
    pbu_rate: 1,
    pbu_rate2: 100,
    min_amount: 100,
    max_amount: 50000,
    payment_methods: [],
    payment_types: [],
    promotions: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/deposit/settings`);
        setSettings(res.data);
      } catch (err) {
        toast.error("সেটিংস লোড ব্যর্থ!");
      }
    };
    fetchSettings();
  }, []);

  const parsedAmount = parseFloat(amount) || 0;
  const pbuAmount = (parsedAmount / settings.pbu_rate2) * settings.pbu_rate;
  const totalPBU = pbuAmount;

  const handleAmountChange = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAdd = (value) => {
    setAmount((prev) => {
      const prevNum = parseFloat(prev) || 0;
      return (prevNum + value).toString();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMethod) return toast.error("পেমেন্ট মেথড সিলেক্ট করুন।");
    if (!paymentType) return toast.error("পেমেন্ট টাইপ সিলেক্ট করুন।");
    if (isNaN(parsedAmount) || parsedAmount < settings.min_amount || parsedAmount > settings.max_amount) return toast.error(`ভ্যালিড অ্যামাউন্ট লিখুন (${settings.min_amount} - ${settings.max_amount})।`);

    navigate(`/deposit/payment-method/${selectedMethod}`, {
      state: { paymentType, amount: parsedAmount, pbuAmount, totalPBU ,selectedMethod},
    });
  };

  return (
    <div className="bg-[#262C32] flex items-center justify-center p-4 mt-16">
      <div className="max-w-3xl w-full mx-auto bg-[#262C32] shadow-xl rounded-lg p-6 border border-gray-700">
        <div className="bg-yellow-500 text-center text-white font-bold py-3 rounded-lg">
          {settings.currencies[0]} {settings.pbu_rate} = {settings.pbu_rate2} {settings.currencies2[0]}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-3 text-white text-lg">
            Select a Payment Method <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {settings.payment_methods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-28 h-24 border rounded-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition ${
                  selectedMethod === method.id ? "border-orange-500 scale-105 bg-gray-700" : "border-gray-600"
                }`}
              >
                <img src={`${import.meta.env.VITE_API_URL}${method.image}`} alt={method.name} className="w-12 h-12 object-contain" />
                <span className="text-sm font-semibold mt-1 text-white">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedMethod && settings.payment_types.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-3 text-white text-lg">
              Select a Payment Type <span className="text-red-500">*</span>
            </h2>
            <select
              className="border rounded-lg w-full p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="">-- Select a Type --</option>
              {settings.payment_types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {[25000, 20000, 15000, 10000, 5000, 1000, 500, 100].map((v) => (
              <button key={v} type="button" onClick={() => handleQuickAdd(v)} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-md font-semibold text-black transition">
                +{v}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center">
            <span className="font-semibold mr-2 text-white">{settings.currencies2[0]}</span>
            <input type="number" placeholder="Type Amount" value={amount} onChange={(e) => handleAmountChange(e.target.value)} className="flex-1 border rounded-lg p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            {settings.currencies2[0]} {settings.min_amount.toLocaleString()} - {settings.max_amount.toLocaleString()}
          </div>

          {amount && (
            <div className="mt-3 text-blue-400 font-medium">
              You will get {amount} {settings.currencies2[0]} To {pbuAmount.toFixed(1)} {settings.currencies[0]}
            </div>
          )}
        </div>

        <button onClick={handleSubmit} className="mt-6 w-full bg-yellow-400 text-black font-semibold py-2.5 rounded-lg hover:bg-yellow-500 transition">
          Deposit
        </button>
      </div>
    </div>
  );
};

export default Deposit;
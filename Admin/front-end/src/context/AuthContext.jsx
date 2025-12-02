import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [motherAdmin, setMotherAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [logo, setLogo] = useState(null); // নতুন: লোগো পাথ স্টোর
  const [logoId, setLogoId] = useState(null); // নতুন: লোগোর MongoDB _id

  // --- ✅ Balance Fetch Function
  const fetchBalance = async (adminId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admins/${adminId}`
      );
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // --- ✅ Logo Fetch Function
  const fetchLogo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/logo`
      );
      setLogo(response.data ? response.data.path : null);
      setLogoId(response.data ? response.data._id : null);
      console.log(response.data ? response.data.path : null);
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  // --- ✅ Reload Function
  const reload = async () => {
    if (motherAdmin && motherAdmin._id) {
      await fetchBalance(motherAdmin._id);
    }
  };

  // প্রাথমিক লোড: অ্যাডমিন এবং লোগো ফেচ
  useEffect(() => {
    const storedUser = localStorage.getItem("motherAdmin");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setMotherAdmin(userData);
      if (userData && userData._id) {
        fetchBalance(userData._id);
      }
    }
    fetchLogo(); // লোগো ফেচ করা
    setLoading(false);
  }, []);

  // ব্যালেন্স রিফ্রেশ (প্রতি ৫ সেকেন্ডে)
  useEffect(() => {
    let intervalId;
    if (motherAdmin && motherAdmin._id) {
      intervalId = setInterval(() => {
        fetchBalance(motherAdmin._id);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [motherAdmin]);

  const login = (userData) => {
    setMotherAdmin(userData);
    setBalance(0);
    localStorage.setItem("motherAdmin", JSON.stringify(userData));
    if (userData._id) {
      fetchBalance(userData._id);
    }
  };

  const logout = () => {
    setMotherAdmin(null);
    setBalance(0);
    localStorage.removeItem("motherAdmin");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        motherAdmin,
        balance,
        setBalance,
        setMotherAdmin,
        login,
        logout,
        reload,
        logo, // নতুন: লোগো পাথ
        logoId, // নতুন: লোগো আইডি
        setLogo, // নতুন: লোগো সেটার
        setLogoId, // নতুন: লোগো আইডি সেটার
        fetchLogo, // নতুন: লোগো ফেচ ফাংশন
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
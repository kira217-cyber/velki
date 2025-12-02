import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user initially null

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [logo, setLogo] = useState(null); // নতুন: লোগো পাথ স্টোর

  // --- ✅ Balance Fetch Function
  const fetchBalance = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admins/${userId}`
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
      console.log(response.data ? response.data.path : null);
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo(); // লোগো ফেচ করা
  }, []);

  // --- ✅ Reload Function
  const reload = async () => {
    if (user && user._id) {
      await fetchBalance(user._id);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      if (userData && userData._id) {
        fetchBalance(userData._id);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let intervalId;
    if (user && user._id) {
      intervalId = setInterval(() => {
        fetchBalance(user._id);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [user]);

  const login = (userData) => {
    setMotherAdmin(userData);
    setBalance(0);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData._id) {
      fetchBalance(userData._id);
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    localStorage.removeItem("user");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        balance,
        loading,
        setLoading,
        logout,
        reload,
        logo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext, useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const OthersAdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validationInput, setValidationInput] = useState("");
  const [adminImage, setAdminImage] = useState(null);
  const [code, setCode] = useState(generateCode());
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔢 Random 4-digit code
  function generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // ✅ অ্যাডমিন ইমেজ ডাটা ফেচ
  const fetchAdminImage = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin-login-image`
      );
      if (res.data && res.data.loginImageUrl) {
        // ✅ Make sure it has full URL
        const fullImageUrl = `${import.meta.env.VITE_API_URL}${
          res.data.loginImageUrl
        }`;
        setAdminImage(fullImageUrl);
        console.log("✅ Admin Image URL:", fullImageUrl);
      }
    } catch (err) {
      console.error("Error fetching admin image:", err);
    }
  };

  useEffect(() => {
    fetchAdminImage();
  }, []);

  // 🔁 Refresh code
  const handleRefresh = () => setCode(generateCode());

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationInput != code) {
      toast.error("Validation code mismatch!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/ad-login`,
        { userName, password }
      );

      const data = res.data;
      if (data?.user) {
        login(data.user);
        toast.success("Login successful!");
        if      (data.user.role === "SA") navigate("/sa/sub-admin");
        else if (data.user.role === "MT") navigate("/mt/master");
        else if (data.user.role === "AG") navigate("/ag/agent");
        else if (data.user.role === "SG") navigate("/sg/sub-agent");
        else {
          toast.error("You do not have permission to access this page!");
          navigate("/restricted");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/bMktQGPC/wp2793078.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Box */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-20 p-10 rounded-lg w-[90%] max-w-md">
        {/* Logo */}
        {adminImage && (
          <img src={adminImage} alt="Logo" className="w-40 mb-4" />
        )}

        {/* Form */}
        <div className="w-full border-l-2 border-white pl-6">
          <h2 className="text-center text-white text-2xl font-bold mb-6">
            Admin <span className="text-gray-300 font-normal">Sign in</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />

            {/* Validation Code */}
            <div className="flex items-center">
              <input
                type="text"
                required
                value={validationInput}
                onChange={(e) => setValidationInput(e.target.value)}
                placeholder="Validation Code"
                className="flex-1 px-4 py-2 bg-white text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <span className="px-4 py-2 bg-white text-black font-bold border-l border-gray-400">
                {code}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-r-md flex items-center justify-center"
              >
                <FaSyncAlt size={20} className="text-white" />
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md transition-all duration-200"
            >
              Login
            </button>
          </form>

          {/* APK Download */}
          <div className="flex justify-center mt-6">
            <button className="flex items-center cursor-pointer gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              <img
                src="https://cdn-icons-png.flaticon.com/512/226/226770.png"
                alt="apk"
                className="w-5"
              />
              <span className="text-sm">Download APK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersAdminLogin;

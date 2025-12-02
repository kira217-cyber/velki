import { useForm } from "react-hook-form";
import {
  FaChevronLeft,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaRedo,
} from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { IoIosUnlock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {
  const { user, setUser, loading, setLoading,logo } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loginImage, setLoginImage] = useState(""); // State for login image
  const [id, setId] = useState(""); // State for image ID
  const navigate = useNavigate();
  const toastShownRef = useRef(false);


  const baseUrl = import.meta.env.VITE_API_URL;
  const logoUrl = logo ? `${baseUrl}${logo.startsWith("/") ? "" : "/"}${logo}` : null;


  // Redirect if already logged in
  useEffect(() => {
    if (user && !toastShownRef.current) {
      toastShownRef.current = true;
      navigate("/");
    }
  }, [user, navigate]);

  // Generate random verification code
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
  };

  useEffect(() => {
    generateVerificationCode();
  }, []);

  // Fetch login image
  const fetchLoginImage = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-login-image`);
      if (res.data && res.data.loginImageUrl) {
        setLoginImage(res.data.loginImageUrl);
        setId(res.data._id);
        console.log("Fetched login image:", res.data.loginImageUrl);
      }
    } catch (err) {
      console.error("Error fetching login image:", err);
      toast.error("Failed to fetch login image");
    }
  };

  useEffect(() => {
    fetchLoginImage();
  }, []);

  // Helper to safely get full image URL
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    // Remove leading /uploads/ if present to avoid duplication
    const cleanImg = img.startsWith("/uploads/") ? img.replace("/uploads/", "") : img;
    return `${import.meta.env.VITE_API_URL}/uploads/${cleanImg}`;
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchInputCode = watch("inputCode", "");
  const isLoginDisabled = !(watchInputCode === verificationCode);

  // Handle login submit
  const onSubmit = async (data) => {
    const { username, password } = data;

    try {
      setLoading(true);

      // Backend call
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/user-login`,
        {
          userName: username,
          password: password,
        }
      );

      const { user: userData } = res.data;

      // Save to Context + LocalStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful");

      // Navigate based on role
      if (userData.role === "MA") navigate("/ma/mother-admin");
      else if (userData.role === "SA") navigate("/sa/sub-admin");
      else navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      const msg =
        error.response?.data?.message || "Invalid username or password";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header */}
      <div className="relative bg-slate-600 px-3 py-3 text-white text-center">
        <FaChevronLeft
          className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p>Login</p>
      </div>

      {/* Image Section */}
      <div className="w-full flex justify-center mb-6">
        <img
          src={getImageUrl(loginImage)}
          alt="Login Banner"
          className="w-full max-w-md h-40 object-cover rounded-lg"
          // onError={(e) => {
          //   e.target.src = "/placeholder.png";
          //   console.log(`Failed to load login image: ${getImageUrl(loginImage)}`);
          // }}
        />
      </div>

      {/* Login Form */}
      <div className="w-full sm:p-6 text-[#6F8898] flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="uppercase text-3xl font-medium text-center text-black mb-6">
            LOGIN
          </h2>

          {/* Username Input */}
          <div className="relative flex w-full items-center gap-1.5 px-4 py-2 rounded mb-4">
            <div className="w-full h-full relative">
              <FaUser className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
                className="pl-12 pr-10 border border-black h-12 rounded-lg focus:outline-none bg-transparent w-full placeholder:text-lg"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="relative flex w-full items-center gap-1.5 px-4 py-2 rounded mb-4">
            <div className="w-full h-full relative">
              <IoIosUnlock className="absolute text-3xl left-2 top-1/2 transform -translate-y-1/2" />
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Password"
                className="pl-12 pr-10 border border-black h-12 rounded-lg focus:outline-none bg-transparent w-full placeholder:text-lg"
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Verification Input */}
          <div className="relative flex w-full items-center gap-1.5 px-4 py-2 rounded mb-4">
            <div className="w-full h-full relative">
              <FaShield className="absolute text-2xl left-2 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                {...register("inputCode", {
                  required: "Validation code is required",
                })}
                placeholder="Validation Code"
                className="pl-12 pr-10 h-12 rounded-lg focus:outline-none border border-black bg-transparent w-full placeholder:text-lg"
              />
              <div className="absolute font-bold text-xl right-2 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center">
                <span className="text-black text-3xl">{verificationCode}</span>
                <FaRedo
                  className="ml-2 text-black"
                  onClick={() => {
                    generateVerificationCode();
                    reset({ inputCode: "" });
                  }}
                />
              </div>
              {errors.inputCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.inputCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className={`bg-[#ffc800] text-black w-1/3 text-base py-6 ${
                isLoginDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoginDisabled || loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
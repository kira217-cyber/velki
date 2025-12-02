import { Input } from "@/components/ui/input";
import {
  FaChevronLeft,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaRedo,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaShield } from "react-icons/fa6";
import { IoIosUnlock } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import flag from "@/assets/bangladesh.png";
import SpinLoader from "@/components/loaders/SpinLoader";
import { HiUserGroup } from "react-icons/hi2";
import axios from "axios";
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      reffer: "",
      validationCode: "",
    },
  });

  // Check localStorage for existing user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
        // Optionally navigate to homepage if user is already logged in
        // navigate("/");
      } catch (error) {
        console.error("Error parsing localStorage user data:", error);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
  }, [navigate]);

  // Generate verification code
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
  };

  useEffect(() => {
    generateVerificationCode();
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    const { confirmPassword, validationCode, ...userInfo } = data;

    if (data.validationCode !== verificationCode) {
      toast.success("ভেরিফিকেশন কোড মেলেনি।");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/user`,
        { ...userInfo, loginStatus: "self-login" }
      );

      if (res.data?.success) {
        // Assume API returns the full user object
        const userData = {
          _id: res.data.insertedId || res.data.user._id,
          username: userInfo.username,
          role: userInfo.role || "US",
          loginStatus: "self-login",
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phone: userInfo.phone,
          email: userInfo.email,
          reffer: userInfo.reffer || "",
          credit: res.data.user?.credit || 0,
          balance: res.data.user?.balance || 0,
          exposure: res.data.user?.exposure || 0,
          availBal: res.data.user?.availBal || 0,
          totalBal: res.data.user?.totalBal || 0,
          playerBal: res.data.user?.playerBal || 0,
          refPL: res.data.user?.refPL || 0,
          timeZone: res.data.user?.timeZone || "Asia/Dhaka",
          status: res.data.user?.status || "Active",
          createdBy: res.data.user?.createdBy || null,
          createdAt: res.data.user?.createdAt || new Date().toISOString(),
          updatedAt: res.data.user?.updatedAt || new Date().toISOString(),
        };

        // Save full user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Update local state for instant UI update
        setLoggedInUser(userData);

        // Show success toast
        toast.success(`স্বাগতম, ${userInfo.username}! রেজিস্ট্রেশন সফল হয়েছে!`);

        // Navigate to homepage after a short delay for better UX
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(res.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative bg-slate-600 px-3 py-3 text-white text-center">
        <FaChevronLeft
          className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 cursor-pointer"
          onClick={handleGoBack}
        />
        <p>সাইন আপ</p>
      </div>

      {/* Banner */}
      <img
        className="w-full h-40"
        src="https://www.wickspin24.live/images/velki-bg-login.webp"
        alt="Signup Banner"
      />

      {/* Conditional UI: Show welcome message if user is logged in */}
      {loggedInUser ? (
        <div className="w-full p-2 sm:p-6 text-center">
          <h2 className="uppercase text-3xl font-medium text-black mb-4">
            স্বাগতম, {loggedInUser.username}!
          </h2>
          <p className="text-lg text-gray-600">
            আপনার রেজিস্ট্রেশন সফল হয়েছে। আপনি এখন হোম পেজে নিয়ে যাওয়া হবে...
          </p>
        </div>
      ) : (
        <div className="w-full p-2 sm:p-6 text-[#6F8898]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="uppercase text-3xl font-medium text-center text-black mb-4">
              সাইন আপ
            </h2>

            {/* Username */}
            <div className="relative mb-4">
              <FaUser className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="ইউজারনেম"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("username", {
                  required: "ইউজারনেম আবশ্যক।",
                  minLength: { value: 4, message: "কমপক্ষে ৪ অক্ষর।" },
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <IoIosUnlock className="absolute left-2 text-3xl top-1/2 transform -translate-y-1/2" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="পাসওয়ার্ড"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("password", {
                  required: "পাসওয়ার্ড আবশ্যক।",
                  minLength: { value: 6, message: "কমপক্ষে ৬ অক্ষর।" },
                })}
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

            {/* Confirm Password */}
            <div className="relative mb-4">
              <IoIosUnlock className="absolute left-2 text-3xl top-1/2 transform -translate-y-1/2" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("confirmPassword", {
                  required: "পাসওয়ার্ড নিশ্চিত করুন।",
                  validate: (value) =>
                    value === watch("password") || "পাসওয়ার্ড মেলেনি।",
                })}
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="relative mb-4">
              <FaUser className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="প্রথম নাম"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("firstName", { required: "প্রথম নাম আবশ্যক।" })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative mb-4">
              <FaUser className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="শেষ নাম"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("lastName", { required: "শেষ নাম আবশ্যক।" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="relative mb-4">
              <div className="absolute left-2 top-3 flex items-center">
                <img src={flag} alt="Bangladesh" className="w-6 h-6 mr-2" />
              </div>
              <Input
                type="text"
                placeholder="ফোন নম্বর"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("phone", {
                  required: "ফোন নম্বর আবশ্যক।",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "সঠিক ফোন নম্বর দিন (১১ অঙ্ক)।",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <MdEmail className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="email"
                placeholder="ইমেইল"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("email", {
                  required: "ইমেইল আবশ্যক।",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "সঠিক ইমেইল দিন।",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Referrer */}
            <div className="relative mb-4">
              <HiUserGroup className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="রেফার কোড (ঐচ্ছিক)"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("reffer")}
              />
            </div>

            {/* Verification Code */}
            <div className="relative mb-4">
              <FaShield className="absolute left-2 text-2xl top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="ভেরিফিকেশন কোড"
                className="pl-12 pr-10 border border-black h-10 sm:h-12 rounded-lg bg-transparent"
                {...register("validationCode", {
                  required: "ভেরিফিকেশন কোড আবশ্যক।",
                })}
              />
              <div className="absolute right-2 top-1 flex items-center">
                <span className="text-black text-3xl font-bold">
                  {verificationCode}
                </span>
                <FaRedo
                  className="ml-1 cursor-pointer text-black"
                  onClick={generateVerificationCode}
                />
              </div>
              {errors.validationCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.validationCode.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "আপনাকে টার্মস এবং কন্ডিশন মেনে নিতে হবে।",
                })}
              />
              <label htmlFor="terms">
                আমি সম্মত এবং বুঝতে পেরেছি{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-blue-500 underline"
                >
                  টার্মস এবং কন্ডিশন
                </Link>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white h-10 sm:h-12 rounded-lg"
              disabled={loading}
            >
              {loading ? <SpinLoader /> : "সাইন আপ"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
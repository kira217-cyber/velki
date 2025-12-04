import { useState, useEffect } from "react";
import { useGetHomeControlsQuery } from "@/redux/features/allApis/homeControlApi/homeControlApi";
import { checkUserStatus } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { toast } from 'react-toastify';

const MainLayout = () => {
  const { data: homeControls } = useGetHomeControlsQuery();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("My App"); // ডিফল্ট টাইটেল
  const [favicon, setFavicon] = useState("/favicon.ico"); // ডিফল্ট ফেভিকন
  const [id, setId] = useState(""); // সেটিংসের আইডি
  const [logo, setLogo] = useState("/logo.png"); // ডিফল্ট লোগো
  const [logoId, setLogoId] = useState(""); // লোগোর আইডি

  // Helper to safely get full image URL
  const getImageUrl = (img) => {
    if (!img) return "/logo.png"; // লোগো এবং ফেভিকনের জন্য ডিফল্ট
    if (img.startsWith("http")) return img;
    const cleanImg = img.startsWith("/uploads/") ? img.replace("/uploads/", "") : img;
    return `${import.meta.env.VITE_API_URL}/uploads/${cleanImg}`;
  };

  // সেটিংস ফেচ
  const fetchSettings = async () => {
    try {
      console.log("Fetching settings from:", `${import.meta.env.VITE_API_URL}/api/settings`);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      console.log("Settings response data:", res.data);
      if (res.data) {
        setTitle(res.data.title || "My App");
        console.log(res.data)
        setFavicon(res.data.faviconUrl || "/favicon.ico");
        if (res.data._id) setId(res.data._id);
      }
    } catch (err) {
      console.error("Fetch settings error:", err.response ? err.response.data : err.message);
      toast.success("Failed to fetch settings");
    }
  };

  // লোগো ফেচ
  const fetchLogo = async () => {
    try {
      console.log("Fetching logo from:", `${import.meta.env.VITE_API_URL}/api/logo`);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/logo`);
      console.log("Logo response data:", response.data);
      setLogo(response.data ? response.data.path : "/logo.png");
      setLogoId(response.data ? response.data._id : "");
    } catch (error) {
      console.error("Error fetching logo:", error);
      toast.error("Failed to fetch logo");
      setLogo("/logo.png"); // ফলব্যাক লোগো
    }
  };

  // ফেচ ডেটা এবং চেক ইউজার স্ট্যাটাস
  useEffect(() => {
    fetchSettings();
    fetchLogo();
  }, [ ]);


  // ফেচ ডেটা এবং চেক ইউজার স্ট্যাটাস
  useEffect(() => {
    dispatch(checkUserStatus());
    
  }, [dispatch]);

  return (
    <div
      style={{
        backgroundImage:
          "url('https://www.wickspin24.live/images/velki-desktop-bg.webp')",
        backgroundSize: "cover",
      }}
      className="h-screen flex justify-center"
    >
      <Helmet>
        <title>{`${title || "My App"} | Official`}</title>
        <link rel="icon" type="image/svg+xml" href={getImageUrl(favicon)} />
      </Helmet>
      <div className="hidden lg:flex w-[30%] md:w-[20%] items-center justify-center">
        <img
          src={getImageUrl(logo)}
          alt="Logo"
          className="max-w-full h-auto"
          // onError={(e) => {
          //   e.target.src = "/logo.png";
          //   console.log(`Failed to load logo image: ${getImageUrl(logo)}`);
          // }}
        />
      </div>
      <div className="w-full md:w-[60%] lg:w-[40%] xl:w-[30%] bg-[#eef6fb] overflow-y-auto">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
      <div className="hidden lg:block md:w-[20%] w-[30%]"></div>
    </div>
  );
};

export default MainLayout;
import PrimaryButton from "./PrimaryButton";
import { FiPlusCircle } from "react-icons/fi";
import { TfiReload } from "react-icons/tfi";
import { IoMdLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useContext, useEffect, useState } from "react";
import { useGetHomeControlsQuery } from "@/redux/features/allApis/homeControlApi/homeControlApi";
import { useGetColorControlsQuery } from "@/redux/features/allApis/colorControlApi/colorControlApi";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: homeControls } = useGetHomeControlsQuery();
  const { data: colorControls } = useGetColorControlsQuery();
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);

  // ✅ AuthContext থেকে ইউজার নেওয়া
  const { user, reload, loading, balance, logo } = useContext(AuthContext);

  const baseUrl = import.meta.env.VITE_API_URL;
  
  const logoUrl = logo ? `${baseUrl}${logo}` : null;

  useEffect(() => {
    console.log(baseUrl)
    console.log(logo)
    console.log(logoUrl);
  }, [logoUrl]);

  // Helper to safely get full image URL
  const getImageUrl = (img) => {
    if (!img) return "/logo.png"; // লোগো এবং ফেভিকনের জন্য ডিফল্ট
    if (img.startsWith("http")) return img;
    const cleanImg = img.startsWith("/uploads/")
      ? img.replace("/uploads/", "")
      : img;
    return `${import.meta.env.VITE_API_URL}/uploads/${cleanImg}`;
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/navbar`)
      .then((res) => {
        const data = res.data;
        setBgColor(data.bgColor || "#ffffff");
        setTextColor(data.textColor || "#000000");
        setFontSize(data.fontSize || 16);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch navbar settings!");
      });
  }, []);

  const navbarColorControl = colorControls?.find(
    (colorControl) => colorControl.section === "home-navbar"
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="fixed top-0 z-20 w-full md:w-[60%] lg:w-[40%] xl:w-[30%]">
      <div className="relative">
        {isSidebarOpen && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}

        <div
          style={{
            backgroundColor: bgColor,
            color: textColor,
            fontSize: fontSize ? fontSize : "14px",
          }}
          className="flex items-center justify-between px-3 py-2 "
        >
          {/* Left side */}
          <div className="flex flex-row items-center gap-2">
            {user && (
              <IoMenu
                className="text-black text-3xl cursor-pointer"
                onClick={toggleSidebar}
              />
            )}
            <Link to="/">
              <img className="w-[84px] h-[26px]" src={logoUrl} alt="Logo" />
            </Link>
          </div>

          {/* Right side */}
          {user ? (
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col items-start">
                <p>@{user?.username}</p>
                <div className="flex flex-row items-center gap-1 text-sm">
                  <p>PBU {balance || "0.00"}</p>
                  <p className="text-red-500">
                    <span className="font-semibold text-black">Exp</span> (0.00)
                  </p>
                </div>
              </div>
              <TfiReload
                onClick={reload}
                className={`text-lg ${loading && "animate-spin"}`}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              {/* <Link
                to="/signup"
              >
                <PrimaryButton icon={FiPlusCircle} background={""}>
                  SignUp
                </PrimaryButton>
              </Link> */}
              <Link to="/login">
                <PrimaryButton icon={IoMdLogIn} background={"red"}>
                  Login
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

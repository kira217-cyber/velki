import React from "react";
import LogoControl from "../../Components/LogoControl/LogoControl";
import SliderControl from "../../Components/SliderControl/SliderControl";
import FavAndTitleControl from "../../Components/FavAndTitleControl/FavAndTitleControl";
import NoticeControl from "../../Components/NoticeControl/NoticeControl";
import LoginImageControl from "../../Components/LoginImageControl/LoginImageControl";
import AdminImageControl from "../../Components/AdminImageControl/AdminImageControl";
import AllBanner from "../../Components/AllBanner/AllBanner";
import CricketBanner from "../../Components/CricketBanner/CricketBanner";
import SoccerBanner from "../../Components/SoccerBanner/SoccerBanner";
import TennisBanner from "../../Components/TennisBanner/TennisBanner";

const HomeControl = () => {
  return (
    <div className="space-y-7">
        {/* Header */}
      <div className="bg-yellow-500 text-center py-4 text-white font-bold text-xl">
        Home Control
      </div>

      <LogoControl></LogoControl>    
      <SliderControl></SliderControl>
      <FavAndTitleControl></FavAndTitleControl>
      <NoticeControl></NoticeControl>
      <LoginImageControl></LoginImageControl>
      <AdminImageControl></AdminImageControl>
      <AllBanner></AllBanner>
      <CricketBanner></CricketBanner>
      <SoccerBanner></SoccerBanner>
      <TennisBanner></TennisBanner>
    </div>
  );
};

export default HomeControl;

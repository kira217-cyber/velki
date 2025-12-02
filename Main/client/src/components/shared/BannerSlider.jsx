import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { HiOutlineMicrophone } from "react-icons/hi2";
import Marquee from "react-fast-marquee";
import { Button } from "@/components/ui/button";
import { GrPrevious, GrNext } from "react-icons/gr";
import axios from "axios";


const BannerSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [notice, setNotice] = useState(null);
  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
    const [title, setTitle] = useState("");

  // ✅ স্লাইডার ডাটা ফেচ
  const fetchSliders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sliders`);
      setSliders(res.data);
      console.log("Fetched sliders:", res.data);
    } catch (err) {
      console.error("Error fetching sliders:", err);

    }
  };
 // ✅ নোটিস ফেচ
  const fetchNotice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices`);
      console.log("Response data:", res.data);
      if (res.data) {
        setTitle(res.data.title || "");

      }
    } catch (err) {
      console.error("Fetch error details:", err.response ? err.response.data : err.message);
 
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  // ✅ প্রথম লোডে ডাটা আনবে
  useEffect(() => {
    fetchSliders();
  }, []);

  // ✅ স্লাইড পরিবর্তন হলে লিসেন করবে
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // ✅ প্রতি ৩ সেকেন্ডে অটো স্লাইড
  useEffect(() => {
    const interval = setInterval(() => {
      if (api && sliders.length > 0) {
        const nextIndex = (selectedIndex + 1) % sliders.length;
        api.scrollTo(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, selectedIndex, sliders.length]);

  // ✅ ম্যানুয়াল নেভিগেশন
  const scrollTo = (index) => api?.scrollTo(index);
  const handleNext = () => scrollTo((selectedIndex + 1) % sliders.length);
  const handlePrevious = () =>
    scrollTo((selectedIndex - 1 + sliders.length) % sliders.length);

  return (
    <div className="relative w-full">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {sliders?.map((item, index) => (
            <CarouselItem key={item._id}>
              <div className="relative">
                <img
                  className="w-full h-[200px] object-cover"
                  src={`${import.meta.env.VITE_API_URL}${item.imageUrl}`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prev / Next Buttons */}
        <div className="absolute inset-0 flex justify-between items-center px-4 h-full">
          <Button
            onClick={handlePrevious}
            className="bg-transparent text-white text-2xl px-2 py-1 hover:scale-110"
          >
            <GrPrevious />
          </Button>
          <Button
            onClick={handleNext}
            className="bg-transparent text-white text-2xl px-2 py-1 hover:scale-110"
          >
            <GrNext />
          </Button>
        </div>
      </Carousel>

      {/* Notice Bar */}
      <div className="px-3 opacity-90 text-black bg-white w-full py-1">
        <div className="flex items-center gap-4">
          <HiOutlineMicrophone className="text-xl md:text-2xl" />
          <Marquee className="text-xs md:text-sm">
            <ul className="flex items-center justify-between gap-20 font-bold">
              <li className="ms-8">{title || "No active notice"}</li>
            </ul>
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;

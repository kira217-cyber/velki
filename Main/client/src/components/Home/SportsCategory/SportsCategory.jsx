import { useState, useEffect } from "react";
import { BsStopwatchFill, BsHddRackFill } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { FaCalendarDays, FaTrophy } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGetHomeControlsQuery } from "@/redux/features/allApis/homeControlApi/homeControlApi";

const SportsCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("in-play");
  const [isHoveredValue, setIsHoveredValue] = useState("");
  const [webMenuBgColor, setWebMenuBgColor] = useState("#ffffff");
  const [webMenuTextColor, setWebMenuTextColor] = useState("#000000");
  const [webMenuFontSize, setWebMenuFontSize] = useState(16);
  const [webMenuHoverColor, setWebMenuHoverColor] = useState("#cccccc");
  const [webMenuHoverTextColor, setWebMenuHoverTextColor] = useState("#cccccc");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);

  const [sliders, setSliders] = useState({
    all: [],
    cricket: [],
    soccer: [],
    tennis: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed images to avoid duplicate logs

  const { data: homeControls } = useGetHomeControlsQuery();

  // Log VITE_API_URL for debugging
  console.log("API Base URL:", import.meta.env.VITE_API_URL);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/count`)
      .then((res) => {
        const data = res.data;
        setBgColor(data.bgColor || "#ffffff");
        setTextColor(data.textColor || "#000000");
        setFontSize(data.fontSize || 16);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch count settings!");
      });
  }, []);

  // Fetch subcategory UI colors
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/subcategory`)
      .then((res) => {
        const data = res.data;
        setWebMenuBgColor(data.webMenuBgColor || "#ffffff");
        setWebMenuTextColor(data.webMenuTextColor || "#000000");
        setWebMenuFontSize(data.webMenuFontSize || 16);
        setWebMenuHoverColor(data.webMenuHoverColor || "#cccccc");
        setWebMenuHoverTextColor(data.webMenuHoverTextColor || "#cccccc");
      })
      .catch((err) => {
        console.error("Error fetching subcategory settings:", err);
        toast.error("Failed to fetch subcategory settings!");
      });
  }, []);

  // Fetch different category banners
  const fetchAllSliders = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/banners`;
      console.log("Fetching banners from:", url);
      const res = await axios.get(url);
      setSliders((prev) => ({ ...prev, all: res.data }));
      console.log("Fetched banners:", res.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Failed to fetch banners: ${err.response.status} ${err.response.statusText}`
        : `Failed to fetch banners: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // 1761285340319-2025-08-21T20-46-44.529Z_velki-wall.png
  // 1761285298675-2025-08-21T20-46-37.341Z_velki-wall.png
  // 1761285298675-2025-08-21T20-46-37.341Z_velki-wall.png

  const fetchCricketSliders = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/cricket-banners`;
      console.log("Fetching cricket banners from:", url);
      const res = await axios.get(url);
      setSliders((prev) => ({ ...prev, cricket: res.data }));
      console.log("Fetched cricket banners:", res.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Failed to fetch cricket banners: ${err.response.status} ${err.response.statusText}`
        : `Failed to fetch cricket banners: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchSoccerSliders = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/soccer-banners`;
      console.log("Fetching soccer banners from:", url);
      const res = await axios.get(url);
      setSliders((prev) => ({ ...prev, soccer: res.data }));
      console.log("Fetched soccer banners:", res.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Failed to fetch soccer banners: ${err.response.status} ${err.response.statusText}`
        : `Failed to fetch soccer banners: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchTennisSliders = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/tennis-banners`;
      console.log("Fetching tennis banners from:", url);
      const res = await axios.get(url);
      setSliders((prev) => ({ ...prev, tennis: res.data }));
      console.log("Fetched tennis banners:", res.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Failed to fetch tennis banners: ${err.response.status} ${err.response.statusText}`
        : `Failed to fetch tennis banners: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Fetch all banners on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchAllSliders(),
          fetchCricketSliders(),
          fetchSoccerSliders(),
          fetchTennisSliders(),
        ]);
      } catch (err) {
        console.error("Error fetching all banners:", err);
        setError("Failed to fetch banners");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []); // Empty dependency array to run once on mount

  // Find active home controls
  const allControl = homeControls?.find(
    (control) => control.category === "banner-all" && control.isSelected
  );
  const soccerControl = homeControls?.find(
    (control) => control.category === "banner-soccer" && control.isSelected
  );
  const cricketControl = homeControls?.find(
    (control) => control.category === "banner-cricket" && control.isSelected
  );
  const tennisControl = homeControls?.find(
    (control) => control.category === "banner-tennis" && control.isSelected
  );

  // Helper to safely get full image URL
  const getImageUrl = (img) => {
    console.log("this is call log -> ", img);

    if (!img) return "/";
    if (img.startsWith("http")) return img;
    // Remove leading /uploads/ if present to avoid duplication
    const cleanImg = img.startsWith("/uploads/")
      ? img.replace("/uploads/", "")
      : img;

    console.log(
      "this is banner image side log -> ",
      `${import.meta.env.VITE_API_URL}/uploads/${cleanImg}`
    );

    return `${import.meta.env.VITE_API_URL}/uploads/${cleanImg}`;
  };

  // Subcategories
  const subcategories = [
    { icon: BsStopwatchFill, title: "In-Play", value: "in-play", route: "" },
    { icon: FaCalendarDay, title: "Today", value: "today", route: "" },
    { icon: FaCalendarDays, title: "Tomorrow", value: "tomorrow", route: "" },
    { icon: FaTrophy, title: "Leagues", value: "leagues", route: "/leagues" },
    { icon: BsHddRackFill, title: "Parlay", value: "parlay", route: "/sports" },
  ];

  const counts = {
    "in-play": { all: 19, cricket: 11, soccer: 3, tennis: 7 },
    today: { all: 10, cricket: 5, soccer: 2, tennis: 1 },
    tomorrow: { all: 12, cricket: 6, soccer: 4, tennis: 2 },
    leagues: { all: 14, cricket: 8, soccer: 5, tennis: 3 },
    parlay: { all: 9, cricket: 7, soccer: 3, tennis: 2 },
  };

  const banners = [
    {
      image: sliders.all[0]?.imageUrl,
      title: "All",
      value: "all",
      count: counts[selectedCategory].all,
    },
    {
      image: sliders.cricket[0]?.imageUrl,
      title: "Cricket",
      value: "cricket",
      count: counts[selectedCategory].cricket,
    },
    {
      image: sliders.soccer[0]?.imageUrl,
      title: "Soccer",
      value: "soccer",
      count: counts[selectedCategory].soccer,
    },
    {
      image: sliders.tennis[0]?.imageUrl,
      title: "Tennis",
      value: "tennis",
      count: counts[selectedCategory].tennis,
    },
  ];

  useEffect(() => {
    console.log("this is banner useeffect banner -> ", banners);
    console.log(
      "this is banner useeffect soccer -> ",
      sliders.soccer[0]?.imageUrl
    );
    console.log("this is banner useeffect soccerControl -> ", soccerControl);
    console.log("this is banner useeffect slider -> ", sliders);
  }, [banners, sliders, soccerControl]);

  // Log banners for debugging
  console.log(
    "Banners array:",
    banners.map((b) => ({
      title: b.title,
      image: b.image,
      resolvedUrl: getImageUrl(b.image),
    }))
  );

  if (isLoading) {
    return <div className="text-center p-4">Loading banners...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex gap-1 sm:gap-2 px-1 sm:px-3">
      {/* Sidebar */}
      <div
        style={{
          backgroundColor: webMenuBgColor,
          color: webMenuTextColor,
          fontSize: webMenuFontSize ? `${webMenuFontSize}px` : "12px",
        }}
        className="w-[20%] rounded-lg sm:p-2 h-fit"
      >
        {subcategories.map(({ icon: Icon, title, value, route }) => (
          <div key={title} className="group relative mb-1 last:mb-0 rounded-lg">
            {route ? (
              <Link to={route}>
                <div
                  className="flex flex-col gap-2 p-2 sm:p-3 justify-center items-center rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor:
                      value === isHoveredValue
                        ? webMenuHoverColor
                        : value === selectedCategory
                        ? webMenuHoverColor
                        : "transparent",
                    color:
                      value === selectedCategory || value === isHoveredValue
                        ? webMenuHoverTextColor
                        : webMenuTextColor,
                  }}
                  onMouseEnter={() => setIsHoveredValue(value)}
                  onMouseLeave={() => setIsHoveredValue("")}
                  onClick={() => setSelectedCategory(value)}
                >
                  <Icon
                    className="text-3xl"
                    style={{
                      color:
                        value === selectedCategory
                          ? webMenuHoverTextColor
                          : webMenuTextColor,
                    }}
                  />
                  <p className="text-xs sm:text-sm">{title}</p>
                </div>
              </Link>
            ) : (
              <div
                className="flex flex-col gap-2 p-2 sm:p-3 justify-center items-center rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor:
                    value === isHoveredValue
                      ? webMenuHoverColor
                      : value === selectedCategory
                      ? webMenuHoverColor
                      : "transparent",
                  color:
                    value === selectedCategory || value === isHoveredValue
                      ? webMenuHoverTextColor
                      : webMenuTextColor,
                }}
                onMouseEnter={() => setIsHoveredValue(value)}
                onMouseLeave={() => setIsHoveredValue("")}
                onClick={() => setSelectedCategory(value)}
              >
                <Icon
                  className="text-3xl"
                  style={{
                    color:
                      value === selectedCategory
                        ? webMenuHoverTextColor
                        : webMenuTextColor,
                  }}
                />
                <p className="text-xs sm:text-sm">{title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sports Banners */}
      <div className="w-[80%] flex flex-col gap-3">
        {banners?.map((banner) => (
          <div
            key={banner.value}
            className="relative rounded-lg overflow-hidden"
          >
            {console.log(
              "this is banner value ",
              banner.value,
              getImageUrl(banner.image)
            )}

            <img
              className="rounded-lg h-[120px] w-full object-cover"
              src={getImageUrl(banner.image)}
              alt={banner.title}
              loading="lazy"
              // onError={(e) => {
              //   const url = getImageUrl(banner.image);
              //   if (!failedImages.has(url)) {
              //     setFailedImages((prev) => new Set(prev).add(url));
              //     console.log(
              //       `Failed to load image for ${banner.title}: ${url}`
              //     );
              //   }
              //   e.target.src = "/";
              // }}
            />
            <div className="absolute top-5 left-7">
              <h2
                style={{
                  color: textColor,
                  fontSize: fontSize ? `${fontSize}px` : "20px",
                }}
                className="text-xl font-bold"
              >
                {banner.title}
              </h2>
              <h2
                style={{
                  color: textColor,
                  fontSize: fontSize ? `${fontSize * 2}px` : "48px",
                }}
                className="text-5xl font-bold"
              >
                {banner.count}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsCategory;

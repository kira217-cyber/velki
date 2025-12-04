// components/SelectCategory/SelectCategory.jsx
import { useState, useRef, useEffect } from "react";
import SportsCategory from "../SportsCategory/SportsCategory";  // ← এটা ইম্পোর্ট করা আছে ধরে নিচ্ছি
import GamesCategory from "../GamesCategory/GamesCategory";
import sportsIcon from "@/assets/icons/sports.svg";
import fishingIcon from "@/assets/icons/fishing.svg";
import liveIcon from "@/assets/icons/live.svg";
import slotIcon from "@/assets/icons/slot.svg";
import tableIcon from "@/assets/icons/table.svg";
import endgameIcon from "@/assets/icons/endgame.svg";
import axios from "axios";

const categories = [
  {
    title: "Sports",
    image: sportsIcon,
    value: "sports",
    description: "Manage your sports preferences here.",
  },
  {
    title: "Live",
    image: liveIcon,
    value: "live",
    description: "Live streaming and events can be managed here.",
  },
  {
    title: "Table",
    image: tableIcon,
    value: "table",
    description: "Manage table games and settings here.",
  },
  {
    title: "Slot",
    image: slotIcon,
    value: "slot",
    description: "Slots games management and preferences.",
  },
  {
    title: "Fishing",
    image: fishingIcon,
    value: "fishing",
    description: "Manage fishing game settings.",
  },
  {
    title: "Egame",
    image: endgameIcon,
    value: "egame",
    description: "Egames management and preferences.",
  },
];

export function SelectCategory() {
  const [allGames, setAllGames] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default: Sports
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const categoryContainerRef = useRef(null);
  const [isHoveredValue, setIsHoveredValue] = useState("");

  // Web menu colors
  const [webMenuBgColor, setWebMenuBgColor] = useState("#ffffff");
  const [webMenuTextColor, setWebMenuTextColor] = useState("#000000");
  const [webMenuFontSize, setWebMenuFontSize] = useState(16);
  const [webMenuHoverColor, setWebMenuHoverColor] = useState("#cccccc");
  const [webMenuHoverTextColor, setWebMenuHoverTextColor] = useState("#000000");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        const categoriesList = catRes.data.data || [];

        const selRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/selected-games`);
        const selectedGamesData = selRes.data.data || [];

        const gameIds = selectedGamesData.map(item => item.gameId);

        if (gameIds.length === 0) {
          setAllGames([]);
          setDbCategories(categoriesList);
          setLoading(false);
          return;
        }

        const gamesRes = await axios.post(
          "https://apigames.oracleapi.net/api/games/by-ids",
          { ids: gameIds },
          { headers: { "x-api-key": "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379" } }
        );

        const games = gamesRes.data.data || [];

        const gamesWithFlags = games.map(game => {
          const flag = selectedGamesData.find(s => s.gameId.toString() === game._id.toString());
          return {
            ...game,
            isCatalog: flag?.isCatalog || false,
            isLatest: flag?.isLatest || false,
            isA_Z: flag?.isA_Z || false,
          };
        });

        setAllGames(gamesWithFlags);
        setDbCategories(categoriesList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Web menu settings
    axios.get(`${import.meta.env.VITE_API_URL}/api/webmenu`)
      .then(res => {
        const d = res.data;
        setWebMenuBgColor(d.webMenuBgColor || "#ffffff");
        setWebMenuTextColor(d.webMenuTextColor || "#000000");
        setWebMenuFontSize(d.webMenuFontSize || 16);
        setWebMenuHoverColor(d.webMenuHoverColor || "#cccccc");
        setWebMenuHoverTextColor(d.webMenuHoverTextColor || "#000000");
      });

    fetchData();
  }, []);

  // Casino games (Live, Slot, etc.)
  const getGamesForCategory = (catValue) => {
    const map = { live: "Live", table: "Table", slot: "Slot", fishing: "Fishing", egame: "Egame" };
    const matchedDbCats = dbCategories.filter(c => c.categoryName === (map[catValue] || ""));
    const providerIds = matchedDbCats.map(c => c.providerId.toString());
    return allGames.filter(game => providerIds.includes(game.provider._id.toString()));
  };

  const handleScroll = () => {
    if (!categoryContainerRef.current) return;
    const scrollLeft = categoryContainerRef.current.scrollLeft;
    const scrollWidth = categoryContainerRef.current.scrollWidth - categoryContainerRef.current.clientWidth;
    const dots = Math.ceil(scrollWidth / categoryContainerRef.current.clientWidth);
    setCurrentPage(Math.round((scrollLeft / scrollWidth) * dots));
  };

  useEffect(() => {
    const container = categoryContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToPage = (page) => {
    const container = categoryContainerRef.current;
    const pageWidth = container.clientWidth;
    container.scrollTo({ left: page * pageWidth, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-20 text-3xl text-yellow-600">Loading...</div>;
  }

  const casinoGames = getGamesForCategory(selectedCategory.value);

  return (
    <div>
      {/* Category Tabs */}
      <div className="relative">
        <div
          style={{
            backgroundColor: webMenuBgColor,
            color: webMenuTextColor,
            fontSize: webMenuFontSize ? `${webMenuFontSize}px` : "14px",
          }}
          ref={categoryContainerRef}
          className="flex justify-start px-2 pt-2 pb-8 gap-2 w-full overflow-x-auto no-scrollbar h-auto bg-[#333333] scroll-smooth"
        >
          {categories.map((category) => {
            const hasGames = category.value === "sports" || getGamesForCategory(category.value).length > 0;

            return (
              <button
                style={{
                  backgroundColor:
                    category.value === isHoveredValue
                      ? webMenuHoverColor
                      : category.value === selectedCategory.value
                      ? webMenuHoverColor
                      : "transparent",
                  color:
                    category.value === isHoveredValue
                      ? webMenuHoverTextColor
                      : category.value === selectedCategory.value
                      ? webMenuHoverTextColor
                      : webMenuTextColor,
                }}
                onMouseEnter={() => setIsHoveredValue(category.value)}
                onMouseLeave={() => setIsHoveredValue("")}
                key={category.value}
                className={`min-w-20 min-h-20 p-4 text-lg flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${
                  hasGames ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => hasGames && setSelectedCategory(category)}
              >
                <p className="font-medium">{category.title}</p>
                <img
                  style={{
                    filter:
                      category.value === isHoveredValue || category.value === selectedCategory.value
                        ? "brightness(0) invert(0)"
                        : "none",
                  }}
                  className="w-12"
                  src={category.image}
                  alt={category.title}
                />
              </button>
            );
          })}
        </div>

    
      </div>

      {/* Content Area */}
      <div className="transition-opacity duration-500 ease-in-out opacity-100 mt-5">
        {selectedCategory.value === "sports" ? (
          <div className="animate-fade-in">
            <SportsCategory />
          </div>
        ) : (
          <div className="animate-fade-in">
            <GamesCategory selectedGames={casinoGames} />
          </div>
        )}
      </div>
    </div>
  );
}
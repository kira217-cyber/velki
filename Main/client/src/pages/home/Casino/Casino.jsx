// pages/Casino.jsx
import CasinoGamesCategory from "@/components/Home/CasinoGamesCategory/CasinoGamesCategory";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

const Casino = () => {
  const [allGames, setAllGames] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const fixedCategories = [
    { title: "Popular", value: "popular", image: "https://www.wickspin24.live/casino/nav/popular.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-popular.svg" },
    { title: "Live", value: "live", image: "https://www.wickspin24.live/casino/nav/live.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-live.svg" },
    { title: "Table", value: "table", image: "https://www.wickspin24.live/casino/nav/table.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-table.svg" },
    { title: "Slot", value: "slot", image: "https://www.wickspin24.live/casino/nav/slot.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-slot.svg" },
    { title: "Fishing", value: "fishing", image: "https://www.wickspin24.live/casino/nav/fishing.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-fishing.svg" },
    { title: "Egame", value: "egame", image: "https://www.wickspin24.live/casino/nav/egame.svg", hoverImage: "https://www.wickspin24.live/casino/nav/hover-egame.svg" },
  ];

  const categoryContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const currentProjectTitle = JSON.parse(localStorage.getItem("currentProject") || "{}")?.title || "Velki";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. তোমার DB থেকে categories
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        const categories = catRes.data.data || [];

        // 2. তোমার DB থেকে selected-games (যেখানে isCatalog, isLatest, isA_Z আছে)
        const selectedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/selected-games`);
        const selectedGamesData = selectedRes.data.data || [];

        const gameIds = selectedGamesData.map(item => item.gameId);

        if (gameIds.length === 0) {
          setAllGames([]);
          setDbCategories(categories);
          setLoading(false);
          return;
        }

        // 3. Oracle থেকে গেমের পুরো ডাটা
        const gamesRes = await axios.post(
          "https://apigames.oracleapi.net/api/games/by-ids",
          { ids: gameIds },
          { headers: { "x-api-key": "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379" } }
        );

        const games = gamesRes.data.data || [];

        // isCatalog, isLatest, isA_Z যোগ করা হচ্ছে Oracle গেমে
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
        setDbCategories(categories);

        // Default: Popular সিলেক্ট
        const popularCats = categories.filter(c => c.categoryName === "Popular");
        if (popularCats.length > 0) {
          setSelectedMainCat(popularCats[0]);
          setSelectedProvider(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActiveProvidersForCategory = (categoryName) => {
    return dbCategories
      .filter(cat => cat.categoryName === categoryName)
      .filter(cat => allGames.some(g => g.provider._id.toString() === cat.providerId.toString()));
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
    return <div className="text-center py-20 text-3xl text-yellow-600">Loading Games...</div>;
  }

  return (
    <div>
      {/* Fixed 6 Categories */}
      <div className="relative mt-14">
        <div
          ref={categoryContainerRef}
          className="flex justify-start px-2 pt-2 pb-8 gap-2 w-full overflow-x-auto no-scrollbar h-auto"
          style={{
            backgroundImage: "url('https://www.wickspin24.live/images/nav_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {fixedCategories.map((cat) => {
            const activeProviders = getActiveProvidersForCategory(cat.title);
            const hasAnyGame = activeProviders.length > 0;

            return (
              <div
                key={cat.value}
                className={`min-w-20 min-h-20 flex flex-col items-center justify-center gap-1 p-4 text-lg rounded-lg cursor-pointer transition-all ${
                  selectedMainCat && activeProviders.some(p => p._id === selectedMainCat._id)
                    ? "bg-[#474a4e] text-[#CCB386]"
                    : hasAnyGame
                    ? "text-[#946F3B] hover:text-[#CCB386] hover:bg-[#474a4e]"
                    : "text-gray-500 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (hasAnyGame) {
                    setSelectedMainCat(activeProviders[0]);
                    setSelectedProvider(null);
                  }
                }}
              >
                <p className="font-semibold">{cat.title}</p>
                <img
                  src={selectedMainCat && activeProviders.some(p => p._id === selectedMainCat._id) ? cat.hoverImage : cat.image}
                  alt={cat.title}
                  className={!hasAnyGame ? "grayscale" : ""}
                />
              </div>
            );
          })}
        </div>

        {/* <div className="flex justify-center p-2 bg-black absolute w-full bottom-2">
          {Array.from({ length: 6 }, (_, i) => (
            <button key={i} onClick={() => scrollToPage(i)} className={`h-2 mx-1 rounded-full ${currentPage === i ? "bg-[#f4c004] w-7" : "bg-[#828486] w-2"}`} />
          ))}
        </div> */}
      </div>

      {/* Provider Tabs */}
      {selectedMainCat && (
        <div className="bg-[#333333] py-4 px-6 flex gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setSelectedProvider(null)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${!selectedProvider ? "bg-white text-black shadow-xl scale-110" : "bg-black/40 text-white hover:bg-white/30"}`}
          >
            ALL
          </button>

          {getActiveProvidersForCategory(selectedMainCat.categoryName).map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedProvider(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${selectedProvider?._id === cat._id ? "bg-white text-black shadow-xl scale-110" : "bg-black/40 text-white hover:bg-white/30"}`}
            >
              {cat.providerName}
            </button>
          ))}
        </div>
      )}

      {/* Games Grid with Show More */}
      <CasinoGamesCategory
        allGames={allGames}
        dbCategories={dbCategories}
        selectedMainCat={selectedMainCat}
        selectedProvider={selectedProvider}
        currentProjectTitle={currentProjectTitle}
      />
    </div>
  );
};

export default Casino;
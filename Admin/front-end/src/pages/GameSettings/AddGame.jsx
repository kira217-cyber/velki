// components/AddGame.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddGame = () => {
  const [categories, setCategories] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [providerGames, setProviderGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);

  // Fetch Categories (for provider dropdown)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        setCategories(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load providers");
      }
    };
    fetchCategories();
  }, []);

  // Fetch Already Selected Games
  useEffect(() => {
    const fetchSelectedGames = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/selected-games`);
        setSelectedGames(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSelectedGames();
  }, []);

  // Fetch Games when provider changes
  useEffect(() => {
    if (!selectedProviderId) {
      setProviderGames([]);
      return;
    }

    const fetchProviderGames = async () => {
      setLoadingGames(true);
      try {
        const res = await axios.get(
          `https://apigames.oracleapi.net/api/games/pagination?page=1&limit=100&provider=${selectedProviderId}`,
          {
            headers: {
              "x-api-key": "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            },
          }
        );
        setProviderGames(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load games for this provider");
        setProviderGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchProviderGames();
  }, [selectedProviderId]);

  const handleSelectGame = async (game) => {
    const isSelected = selectedGames.some((sg) => sg.gameId === game._id);

    try {
      if (isSelected) {
        const selectedGame = selectedGames.find((sg) => sg.gameId === game._id);
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/selected-games/${selectedGame._id}`);
        setSelectedGames(prev => prev.filter(sg => sg.gameId !== game._id));
        toast.success("Game removed");
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/selected-games`, {
          gameId: game._id,
          gameUuid: game.game_uuid,
        });
        setSelectedGames(prev => [...prev, res.data.data]);
        toast.success("Game added successfully!");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleFlagChange = async (gameId, flag, checked) => {
    const selectedGame = selectedGames.find(sg => sg.gameId === gameId);
    if (!selectedGame) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/selected-games/${selectedGame._id}`,
        { [flag]: checked }
      );
      setSelectedGames(prev =>
        prev.map(sg => (sg._id === selectedGame._id ? res.data.data : sg))
      );
      toast.success(`${flag} updated`);
    } catch (err) {
      toast.error("Failed to update flag");
    }
  };

  const isGameSelected = (gameId) => selectedGames.some(sg => sg.gameId === gameId);
  const getSelectedGame = (gameId) => selectedGames.find(sg => sg.gameId === gameId);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-600">
        Add & Manage Games
      </h1>

      {/* Provider Dropdown */}
      <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border-2 border-yellow-200">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Select Provider
        </label>
        <select
          value={selectedProviderId}
          onChange={(e) => setSelectedProviderId(e.target.value)}
          className="w-full max-w-lg px-6 py-4 border-2 border-yellow-300 rounded-xl text-lg focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition"
        >
          <option value="">-- Choose a Provider --</option>
          {categories.map((cat) => (
            <option key={cat.providerId} value={cat.providerId}>
              {cat.providerName} ({cat.categoryName})
            </option>
          ))}
        </select>
      </div>

      {/* Games Section */}
      <div className="mt-8">
        {!selectedProviderId ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-2xl text-gray-500">Please select a provider to view games</p>
          </div>
        ) : loadingGames ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Loading games...</p>
          </div>
        ) : providerGames.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-3xl font-bold text-gray-500">No Games Found</p>
            <p className="text-lg text-gray-400 mt-3">
              This provider has no games available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {providerGames.map((game) => {
              const selected = isGameSelected(game._id);
              const selectedData = getSelectedGame(game._id);

              return (
                <div
                  key={game._id}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                    selected ? "ring-4 ring-yellow-400 border-4 border-yellow-300" : "border border-gray-200"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={`https://apigames.oracleapi.net/${game.image}`}
                      alt={game.name}
                      className="w-full h-56 object-cover"
                    />
                    {selected && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm">
                      Selected
                    </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 line-clamp-2">
                      {game.name}
                    </h3>

                    {/* Main Select Checkbox */}
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleSelectGame(game)}
                        className="w-6 h-6 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <span className="font-semibold text-gray-700">
                        {selected ? "Selected" : "Select this game"}
                      </span>
                    </label>

                    {/* Flags - Only show if selected */}
                    {selected && (
                      <div className="space-y-3 mt-5 pt-5 border-t border-gray-200">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedData?.isHot || false}
                            onChange={(e) => handleFlagChange(game._id, "isHot", e.target.checked)}
                            className="w-5 h-5 text-red-600 rounded"
                          />
                          <span className="font-medium">Hot Game</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedData?.isLatest || false}
                            onChange={(e) => handleFlagChange(game._id, "isLatest", e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="font-medium">Latest Game</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedData?.isLive || false}
                            onChange={(e) => handleFlagChange(game._id, "isLive", e.target.checked)}
                            className="w-5 h-5 text-green-600 rounded"
                          />
                          <span className="font-medium">Live Game</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddGame;
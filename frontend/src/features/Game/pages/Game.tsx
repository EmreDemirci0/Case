import React, { useEffect, useState } from "react";
import {
  consumeEnergy,
  fetchAppSettings,
  fetchEnergy,
  fetchItemLevel,
  fetchUserItems,
} from "../../Game/services/gameService";
import { useAuth } from "../../../hooks/useAuth";
import useLogout from "../../../hooks/useLogout";

function Game() {
  const { token } = useAuth();
  const { logout } = useLogout();

  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Burada userItems ve itemLevels state'leri tutuyoruz
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemLevels, setItemLevels] = useState<any[]>([]);

  const energyPercent = Math.min(100, (energy / maxEnergy) * 100);

  const { userId } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!token || !userId) return;

        // Kullanıcı itemlarını çek
        const userItemsRes = await fetchUserItems(token, userId);
        setUserItems(userItemsRes);
        console.log("fetchUserItems sonucu:", userItemsRes);

        // Her item için itemLevel verilerini çek
        const itemLevelsRes = await Promise.all(
          userItemsRes.map((itemInstance: any) => {
            const itemId = itemInstance.item.id;
            const level = itemInstance.currentLevel;
            return fetchItemLevel(token, itemId, level);
          })
        );
        setItemLevels(itemLevelsRes);
        console.log("fetchItemLevel sonuçları:", itemLevelsRes);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    }

    fetchData();
  }, [token, userId]);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setLoading(true);

        const settingsRes = await fetchAppSettings(token || "");
        if (settingsRes.data) {
          setMaxEnergy(Number(settingsRes.data.maxEnergy));
          setRegenMinutes(Number(settingsRes.data.regenMinutes));
        }

        const energyRes = await fetchEnergy(token || "");
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }

        setLoading(false);
      } catch (err) {
        setError("Enerji verileri alınamadı.");
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  useEffect(() => {
    if (!lastUpdate || !regenMinutes || !maxEnergy) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - new Date(lastUpdate).getTime();
      const regenMs = regenMinutes * 60 * 1000;

      const regenerated = Math.floor(diffMs / regenMs);
      const newEnergy = Math.min(maxEnergy, regenerated);
      setEnergy(newEnergy);

      const timeSinceLast = diffMs % regenMs;
      const timeLeftMs = regenMs - timeSinceLast;
      setSecondsToNextEnergy(Math.floor(timeLeftMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, regenMinutes, maxEnergy]);

  const handleConsumeEnergy = async () => {
    if (!token) return alert("Lütfen giriş yapın.");

    try {
      const result = await consumeEnergy(token, 1);
      if (result.success) {
        const energyRes = await fetchEnergy(token);
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }
      } else {
        alert(result.message);
      }
    } catch {
      alert("Enerji harcama sırasında hata oluştu.");
    }
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Çıkış */}
        <div className="flex justify-end">
          <button
            onClick={() => logout(token || "")}
            className="text-blue-400 text-sm hover:underline"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Enerji Paneli */}
        <div className="bg-[#1f1f1f] p-4 rounded-xl shadow-md space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/energyIcon.png" alt="Enerji" className="w-5 h-5" />
              <span className="text-sm font-semibold text-white">Enerji</span>
            </div>
            <span className="text-xs text-pink-400 font-medium">
              %{Math.floor(energyPercent)} ({energy}/{maxEnergy})
            </span>
          </div>

          <div className="relative h-4 bg-[#333] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
              style={{ width: `${energyPercent}%` }}
            />
            <div className="absolute w-full text-center text-[11px] text-white font-medium">
              {loading
                ? "Yükleniyor..."
                : error
                  ? error
                  : energy >= maxEnergy
                    ? "Enerji Dolu!"
                    : secondsToNextEnergy !== null
                      ? `1 Yenilenmesine Kalan: ${formatSeconds(secondsToNextEnergy)}`
                      : ""}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleConsumeEnergy}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm rounded-lg transition"
            >
              1 Enerji Harca
            </button>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex items-center gap-2 mb-2">
          {["Tüm Seviyeler", "Sv1", "Sv2", "Max Sv"].map((tab) => (
            <button
              key={tab}
              className="bg-[#2b2b2b] px-4 py-1 text-sm rounded-full text-white font-medium hover:bg-pink-600 transition"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-2 gap-4">
          {userItems.length > 0 && itemLevels.length === userItems.length ? (
            userItems.map((itemInstance, i) => {
              const itemLevel = itemLevels[i];

              return (
                <div
                  key={itemInstance.id}
                  className="relative rounded-2xl overflow-hidden h-52 border border-[#353535] shadow-lg group"
                  style={{
                    backgroundImage: `url(/${itemLevel.imageUrl || "level1.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Seviye etiketi */}
                  <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-[11px] px-2 py-[2px] rounded-bl-lg z-10">
                    Seviye {itemInstance.currentLevel}
                  </div>

                  {/* Alt içerik alanı */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#121212cc] to-transparent p-3 space-y-1 z-10">
                    {/* Başlık */}
                    <h3 className="text-white text-sm font-semibold">{itemLevel.title}</h3>

                    {/* Açıklama */}
                    <p className="text-xs text-gray-300 leading-tight line-clamp-2">
                      {itemLevel.description}
                    </p>

                    {/* Enerji + Buton */}
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1">
                        <img src="/energyIcon.png" alt="Enerji" className="w-4 h-4" />
                        <span className="text-xs text-pink-400 font-medium">
                          {itemLevel.energyCost || 50}
                        </span>
                      </div>
                      <button
                        className={`text-xs px-3 py-[4px] rounded-md ${itemInstance.currentLevel > 1 ? "bg-indigo-700" : "bg-yellow-500"
                          } text-white font-medium shadow hover:brightness-110 transition`}
                      >
                        {itemInstance.currentLevel > 1 ? "Yükselt" : "Geliştir"}
                      </button>
                    </div>
                  </div>

                  {/* Karanlık katman */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition" />
                </div>
              );
            })
          ) : (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#2b2b2b] rounded-xl p-3 border border-gray-700 h-44 flex items-center justify-center text-gray-500"
              >
                Yükleniyor...
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

}

export default Game;
